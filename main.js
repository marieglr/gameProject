//initialising the canvas
var canvas = document.getElementById('gameboard');
var ctx = canvas.getContext('2d');


function Character (x, name){
  this.x = x;
  this.y = 150;
  this.ego = 100;
  this.name = name;
}

// Character.prototype.drawMe = function (characterName) {
  //var img = new Image();
  //this.img.src =
//   ctx.beginPath();
//   ctx.drawImage(this.img, this.x, this.y, 20, 20);
//   ctx.closePath();
// }

//Fonction qui fait automatiquement tirer des projectiles aux deux personnages
Character.prototype.shoot = function (){
    setInterval(function(){
      if (this.name === "Trump"){
        var newTweet = new Tweet;
      } else if (this.name === "Kim"){
        var newRocket = new Rocket;
      }
    }, 500);
}

function Tweet (){
  xTweet = trump.x;
  yTweet = trump.y;
}

Tweet.prototype.move = function (){
  xTweet++;
}

Tweet.prototype.hit = function(){
  if ( xTweet === kim.x){
    kim.ego -= 10;
  }
}

function Rocket (){
  xRocket = kim.x;
  yRocket = kim.y;
}

Rocket.prototype.move = function (){
  xRocket--;
}

Rocket.prototype.hit = function (){
  if ( xRocket === trump.x){
    trump.ego -= 10;
  }
}




//Projectile.prototype.draw = function (){
  //var img = new Image();
  //this.img.src =
//   ctx.beginPath();
//   ctx.drawImage(this.img, this.x, this.y, 20, 20);
//   ctx.closePath();
// }
//}


function UserBar () {
  this.x = 390;
  this.y = 380;
  document.onkeydown = (e) => {
    if (e.keyCode === 37) {
      this.move(-1);
    } else if (e.keyCode === 37) {
      this.move(-1);
    }
  }
}

//UserBar.prototype.draw = function (){
  //var img = new Image();
  //this.img.src =
//   ctx.beginPath();
//   ctx.drawImage(this.img, this.x, this.y, 20, 20);
//   ctx.closePath();
// }
//}

UserBar.prototype.move = function (dx){
  var x = (this.x + dx) % 760;
}

UserBar.prototype.shoot = function (){
  var heart = new Heart;
}


function Heart (){
  xHeart = userBar.x;
  yHeart = userBar.y;
}

Heart.prototype.move = function (){
  yHeart--;
}

// Heart.prototype.hit = function (){
//   if ( xHeart === xTweet && yHeart === yTweet){

//   } else if (xHeart === xRocket && yHeart === yRocket){

//   } else continue;
// }



function Game (){
  setTimeout(function(){
    var trump = new Character (20, "Trump", "Kim");
    var kim = new Character (780, "Kim", "Trump");
    var userBar = new UserBar;
  }, 180000)
}

var game = new Game;
