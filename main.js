//------------------------------------------------------------------------------------------------------------------------
//GENERAL CODE
//------------------------------------------------------------------------------------------------------------------------

//Initialising the canvas
var canvas = document.getElementById("gameboard");
var ctx = canvas.getContext("2d");
canvas.width = 1200 * 1.5;
canvas.height = 600 * 1.5;

//creating the board
function Board() {
  this.x = 0;
  this.y = 0;
  this.img = new Image();
  this.img.src = "images/background.jpg";
  this.height = canvas.height;
  this.width = canvas.width;
}

var board = new Board();

//Timer
var timer = 90;
function timerCountdown() {
  var interval = setInterval(function() {
    timer--;
    $(".timer span").text(timer);
    if (timer <= 0){
      clearInterval(interval);
    }
  }, 1000);
}

//run Timer
timerCountdown();

//GENERAL RE-USABLE FUNCTIONS

//Draw elements on canvas
function draw(object) {
  ctx.beginPath();
  ctx.drawImage(object.img, object.x, object.y, object.width, object.height);
  ctx.closePath();
}

//Detect collision between two objects
function collision(objA, objB) {
  return (
    objA.x < objB.x + objB.width &&
    objA.x + objA.width > objB.x &&
    objA.y < objB.y + objB.height &&
    objA.height + objA.y > objB.y
  );
}

//------------------------------------------------------------------------------------------------------------------------
//CHARACTER METHODS
//------------------------------------------------------------------------------------------------------------------------

function Character(x, img, imgWidth) {
  this.x = x;
  this.y = 200;
  this.ego = 100;
  this.img = img;
  this.width = imgWidth;
  this.height = 100 * 2.5;
}

// Characters creation
//Load image for Trump
var trumpimg = new Image();
trumpimg.src = "images/Trump.png";
//creation of Trump
var trump = new Character(25, trumpimg, 98 * 2.5);

//Load image for Kim
var kimimg = new Image();
kimimg.src = "images/KimCharacter.png";
//creation of Kim
var kim = new Character(canvas.width - 300, kimimg, 81 * 2.5);

//------------------------------------------------------------------------------------------------------------------------
//CHARACTERS PROJECTILES
//------------------------------------------------------------------------------------------------------------------------

//Tweet object and methods
function Tweet() {
  this.x = trump.x + trump.width;
  this.y = trump.y + 75;
  this.img = new Image();
  this.img.src = "./images/Logo-Twitter.png";
  this.height = 32 * 1.5;
  this.width = 40 * 1.5;
  this.isIntercepted = false;
}

Tweet.prototype.move = function() {
  this.x += 15;
};

//Rocket object and methods
function Rocket() {
  this.x = kim.x;
  this.y = kim.y + 150;
  this.img = new Image();
  this.img.src = "./images/Rocket.png";
  this.width = 40 * 1.5;
  this.height = 40 * 1.5;
  this.isIntercepted = false;
}

Rocket.prototype.move = function() {
  this.x -= 15;
};

// Rocket.prototype.hitTarget = function (){
//   if ( xRocket === trump.x){
//     trump.ego -= 5;
//   }
// }

//Have the characters randomly shoot tweets/rockets
var tweets = [];
var rockets = [];

var addProjectile = setInterval(function() {
  var newTweet = new Tweet();
  tweets.push(newTweet);
  var newRocket = new Rocket();
  rockets.push(newRocket);
}, 2000);

//------------------------------------------------------------------------------------------------------------------------
//USER BAR OBJECT AND METHODS
//------------------------------------------------------------------------------------------------------------------------

//User Bar Prototype
function UserBar() {
  this.x = canvas.width / 2;
  this.y = canvas.height - 110;
  this.img = new Image();
  this.img.src = "./images/HeartBar.png";
  this.height = 100;
  this.width = 100;
}

// UserBar.prototype.move = function (dx){
//   var x = (this.x + dx) % 1100;
// }

UserBar.prototype.shoot = function() {
  var newHeart = new Heart();
  hearts.push(newHeart);
};

//Creation of the userBar
var userBar = new UserBar();
var hearts = [];

//Heart Projectile Object and methods
function Heart() {
  this.x = userBar.x;
  this.y = userBar.y;
  this.img = new Image();
  this.img.src = "./images/like.png";
  this.width = 40 * 1.5;
  this.height = 40 * 1.5;
}

Heart.prototype.move = function() {
  this.y -= 15;
};

//----------------------------------------------------------------------------------------------------------
//GAME LOGIC AND VISUALS
//----------------------------------------------------------------------------------------------------------

//If the user manage to keep the game going on for 2 min without having the characters lose face, he wins yay yay!
var game = setTimeout(function() {
  clearInterval(drawLoop);
}, 90000);

var drawLoop = setInterval(function() {
  //erase the old drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //redraw the background, the characters and user bar
  draw(board);
  draw(userBar);
  draw(trump);
  draw(kim);

  //Manage heart drawing and interaction with projectiles
  hearts.forEach(function(oneHeart) {
    //manage tweets interaction with hearts
    tweets.forEach(function(oneTweet) {
      if (collision(oneHeart, oneTweet)) {
        oneTweet.isIntercepted = true;
      }
    });

    //manage rockets interaction with hearts
    rockets.forEach(function(oneRocket) {
      if (collision(oneHeart, oneRocket)) {
        oneRocket.isIntercepted = true;
      }
    });

    //Draw hearts
    draw(oneHeart);
    oneHeart.move();
  });

  //manage rockets drawings and interaction with target
  rockets.forEach(function(oneRocket) {
    if (collision(oneRocket, trump)) {
      oneRocket.isIntercepted = true;
      trump.ego -= 5;

      //If Trump loses face: GAME OVER
      if (trump.ego <= 0) {
        clearInterval(drawLoop);
      }
    }

    draw(oneRocket);
    oneRocket.move();
  });

  //manage tweets drawings and interaction with target
  tweets.forEach(function(oneTweet) {
    //if a tweet hits Kim, kim's ego gets damage
    if (collision(oneTweet, kim)) {
      oneTweet.isIntercepted = true;
      kim.ego -= 5;
      //if Kim loses face: GAME OVER - NUCLEAR WAR: YOUR KIDS WILL BE BORN WITH THREE LEGS AND ONLY ONE EYE
      if (kim.ego <= 0) {
        clearInterval(drawLoop);
      }
    }

    //Draw tweet
    draw(oneTweet);
    oneTweet.move();
  });

  //Redraw the ego points of each character after being hit
  ctx.font = "bold 45px monospace";
  ctx.fillStyle = "#b30000";
  ctx.fillText("Ego level :" + trump.ego, 40, 150);
  ctx.fillStyle = "#b30000";
  ctx.fillText("Ego level :" + kim.ego, kim.x - 100, 150);

  //erase tweets that have been intercepted by a heart
  tweets = tweets.filter(function(oneTweet) {
    return !oneTweet.isIntercepted;
  });

  rockets = rockets.filter(function(oneRocket) {
    return !oneRocket.isIntercepted;
  });
}, 1000 / 60);

//-------------------------------------------------------------------------------------------------------------------
//USER INPUT
//-------------------------------------------------------------------------------------------------------------------
var body = document.querySelector("body");
body.onkeydown = e => {
  // if (userBar.x >= 100 && userBar.x <= 1100){
  if (e.keyCode === 39) {
    if (userBar.x <= 1800) {
      userBar.x += 30;
      e.preventDefault();
    }
  } else if (e.keyCode === 37) {
    if (userBar.x >= 250) {
      userBar.x -= 30;
      e.preventDefault();
    }
  } else if (e.keyCode === 32) {
    userBar.shoot();
    e.preventDefault();
  }
};
