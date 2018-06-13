//------------------------------------------------------------------------------------------------------------------------
//GENERAL CODE
//------------------------------------------------------------------------------------------------------------------------

//Initialising the canvas
var canvas = document.getElementById('gameboard');
var ctx = canvas.getContext('2d');
canvas.width = 1200;
canvas.height= 600;

//GENERAL RE-USABLE FUNCTIONS

//Draw objects on canvas
function draw (object) {
  ctx.beginPath();
  ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
  ctx.closePath();
}

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


//Have the characters randomly shoot tweets/rockets
var tweets = [];
var rockets = [];

var addProjectile = setInterval(function(){
  var newTweet = new Tweet;
  tweets.push(newTweet);
  var newRocket = new Rocket;
  rockets.push(newRocket);
}, 2000);




//------------------------------------------------------------------------------------------------------------------------
//USER BAR OBJECT AND METHODS
//------------------------------------------------------------------------------------------------------------------------

//User Bar Prototype
function UserBar () {
  this.x = 555;
  this.y = 555;
  this.img = new Image();
  this.img.src = "./images/HeartBar.png";
  this.height = 50;
  this.width = 50;
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


//----------------------------------------------------------------------------------------------------------
//GAME OBJECT
//----------------------------------------------------------------------------------------------------------

function Game (){
  //setTimeout(function(){


  var drawLoop = setInterval(function(){

    //erase the old drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //redraw characters and user bar
    draw(userBar);
    draw(trump);
    draw(kim);

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
        draw(oneTweet);
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

        draw(oneRocket);
        oneRocket.move();
      })

      rockets.filter(function(oneRocket){
        return !oneRocket.isIntercepted;
      })
    })
  }, 1000/60);


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




