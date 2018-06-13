//------------------------------------------------------------------------------------------------------------------------
//GENERAL CODE
//------------------------------------------------------------------------------------------------------------------------

//Initialising the canvas
var canvas = document.getElementById('gameboard');
var ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height= 600;

//General re-usable functions:
//generaliser la fonction draw

//Detect collision between two objects
function collision(objA, objB) {
  return objA.x < objB.x + objB.width &&
    objA.x + objA.width > objB.x &&
    objA.y < objB.y + objB.height &&
    objA.height + objA.y > objB.y;
}

//------------------------------------------------------------------------------------------------------------------------
//CHARACTER METHODS
//------------------------------------------------------------------------------------------------------------------------

function Character (x, img, imgWidth){
  this.x = x;
  this.y = 100;
  this.ego = 100;
  this.img = img;
  this.width = imgWidth;
  this.height = 100;
}

Character.prototype.draw = function () {
  ctx.beginPath();
  ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  ctx.closePath();
}


// Characters creation
//Load image for Trump
var trumpimg = new Image();
trumpimg.src = "images/Trump.png";
//creation of Trump
var trump = new Character(25, trumpimg, 98);


//Load image for Kim
var kimimg = new Image();
kimimg.src = "images/KimCharacter.png";
//creation of Kim
var kim = new Character (1125, kimimg, 81);

//------------------------------------------------------------------------------------------------------------------------
//CHARACTERS PROJECTILES
//------------------------------------------------------------------------------------------------------------------------

//Tweet object and methods
function Tweet (){
  this.x = trump.x;
  this.y = trump.y;
  this.img = new Image();
  this.img.src = './images/Logo-Twitter.png'
  this.height = 32;
  this.width = 40;
  this.isIntercepted = false;
}

Tweet.prototype.move = function (){
  this.x++;
}

// Tweet.prototype.hit = function(){
//   if ( xTweet === kim.x){
//     kim.ego -= 5;
//   }
// }

Tweet.prototype.draw = function () {
  ctx.beginPath();
  ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  ctx.closePath();
}

//Rocket object and methods
function Rocket (){
  this.x = kim.x;
  this.y = kim.y;
  this.img = new Image();
  this.img.src = './images/Rocket.png';
  this.width = 40;
  this.height = 40;
  this.isIntercepted = false;
}

Rocket.prototype.move = function (){
  this.x--;
}

// Rocket.prototype.hitTarget = function (){
//   if ( xRocket === trump.x){
//     trump.ego -= 5;
//   }
// }

Rocket.prototype.draw = function () {
  ctx.beginPath();
  ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  ctx.closePath();
}

//Have the characters randomly shoot tweets/rockets
var tweets = [];
var rockets = [];

var addProjectile = setInterval(function(){
  var newTweet = new Tweet;
  tweets.push(newTweet);
  var newRocket = new Rocket;
  rockets.push(newRocket);
}, 600);


//Projectile.prototype.draw = function (){
//   ctx.drawImage(this.img, this.x, this.y, 20, 20);
//}

//------------------------------------------------------------------------------------------------------------------------
//USER BAR OBJECT AND METHODS
//------------------------------------------------------------------------------------------------------------------------

//User Bar Prototype
function UserBar () {
  this.x = 580;
  this.y = 580;

  this.img = new Image();
  this.img.src = "./images/HeartBar.png";

}

UserBar.prototype.draw = function () {
  ctx.beginPath();
  ctx.drawImage(this.img, this.x-25, this.y-25, 50, 50);
  ctx.closePath();
}

UserBar.prototype.move = function (dx){
  var x = (this.x + dx) % 1100;
}

UserBar.prototype.shoot = function (){
  var newHeart = new Heart;
  hearts.push(newHeart);
}
//Creation of the userBar
var userBar = new UserBar;
var hearts = [];

//Heart Projectile Object and methods
function Heart (){
  this.x = userBar.x;
  this.y = userBar.y;
  this.img = new Image();
  this.img.src = './images/like.png';
  this.width = 40;
  this.height = 40;
}

Heart.prototype.move = function (){
  this.y--;
}

// Heart.prototype.hit = function (){
//   if ( xHeart === xTweet && yHeart === yTweet){

//   } else if (xHeart === xRocket && yHeart === yRocket){

//   } else continue;
// }

Heart.prototype.draw = function () {
  ctx.beginPath();
  ctx.drawImage(this.img, this.x-25, this.y-25, 50, 50);
  ctx.closePath();
}


//GAME OBJECT
function Game (){
  //setTimeout(function(){


  var drawLoop = setInterval(function(){

    //erase the old drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //redraw characters and user bar
    userBar.draw();
    trump.draw();
    kim.draw();

    //Manage heart drawing and interaction with projectiles
    hearts.forEach(function(oneHeart){

      //manage tweets drawings and interaction with hearts and target
      tweets.forEach(function(oneTweet){
        //if a heart intercepts a tweet, the tweet should be marked
        if (collision(oneHeart,oneTweet)){
          oneTweet.isIntercepted === true;
        }
        //if a tweet hits Kim, kim's ego gets damage
        if(collision(oneTweet,kim)){
          kim.ego -= 5;
          if (kim.ego<=0){
            clearInterval(drawLoop);
          }
        }

        //Draw tweet
        oneTweet.draw();
        oneTweet.move();
      })

      //erase tweets that have been intercepted by a heart
      tweets.filter(function(oneTweet){
        return !oneTweet.isIntercepted;
      })

      //manage rockets drawings and interaction with hearts and target
      rockets.forEach(function(oneRocket){
        if (collision(oneHeart,oneRocket)){
          oneRocket.isIntercepted === true;
        };

        if(collision(oneRocket,trump)){
          trump.ego -= 5;
          if (trump.ego<=0){
            clearInterval(drawLoop);
          }
        };

        oneRocket.draw();
        oneRocket.move();
      })

      rockets.filter(function(oneRocket){
        return !oneRocket.isIntercepted;
      })
    })
  }, 1000/60);

  //userBar.move();
  //}, 180000);
}

//-------------------------------------------------------------------------------------------------------------------
//USER INPUT
//-------------------------------------------------------------------------------------------------------------------
var body = document.querySelector("body");
body.onkeydown = (e) => {
  if (e.keyCode === 39) {
    userBar.x+= 5;
    console.log("right");
    e.preventDefault();
  } else if (e.keyCode === 37) {
    userBar.x-= 5;
    console.log("left")
    e.preventDefault();
  } else if (e.keyCode === 32){
    userBar.shoot();
    console.log("shoot")
    e.preventDefault();
  }
}

var game = new Game();




