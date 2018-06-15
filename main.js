//------------------------------------------------------------------------------------------------------------------------
//GENERAL CODE
//------------------------------------------------------------------------------------------------------------------------

//Initialising the canvas
var canvas = document.getElementById("gameboard");
var ctx = canvas.getContext("2d");
canvas.width = 1200;
canvas.height = 600;

//creating the board
function Board() {
  this.x = 0;
  this.y = 0;
  this.img = new Image();
  this.img.src = "images/mapclaire.jpg";
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
  this.y = 80;
  this.ego = 100;
  this.img = img;
  this.width = imgWidth;
  this.height = 100 * 1.5;
}

// Characters creation
//Load image for Trump
var trumpimg = new Image();
trumpimg.src = "images/Trump.png";
//creation of Trump
var trump = new Character(25, trumpimg, 98 * 1.5);

//Load image for Kim
var kimimg = new Image();
kimimg.src = "images/KimCharacter.png";
//creation of Kim
var kim = new Character(canvas.width - 150, kimimg, 81 * 1.5);

//------------------------------------------------------------------------------------------------------------------------
//CHARACTERS PROJECTILES
//------------------------------------------------------------------------------------------------------------------------

//TWEETS object and methods
function Tweet() {
  this.x = trump.x + trump.width;
  this.y = trump.y + 25;
  this.img = new Image();
  this.img.src = "./images/Logo-Twitter.png";
  this.height = 24;
  this.width = 30;
  this.isIntercepted = false;
}

Tweet.prototype.move = function() {
  this.x += 10;
};

//Create a second type of tweets that will move slower
SlowTweet.prototype = Object.create(Tweet.prototype);

function SlowTweet(x, img, width, height, isIntercepted) {
  Tweet.call(this, x, img, width, height, isIntercepted);
  this.y = trump.y + 45;
}

SlowTweet.prototype.move = function(){
  this.x += 3;
}



//ROCKETS object and methods
function Rocket() {
  this.x = kim.x;
  this.y = kim.y + 75;
  this.img = new Image();
  this.img.src = "./images/Rocket.png";
  this.width = 30;
  this.height = 30;
  this.isIntercepted = false;
}

Rocket.prototype.move = function() {
  this.x -= 10;
};

//Create a second type of rockets that will move slower
SlowRocket.prototype = Object.create(Rocket.prototype)
function SlowRocket(x, img, width, height, isIntercepted) {
  Rocket.call(this, x, img, width, height, isIntercepted);
  this.y = kim.y + 30;
}

SlowRocket.prototype.move = function(){
  this.x -= 3;
}


//HAVE THE CHARACTERS RANDOMLY SHOOT PROJECTILES
var tweets = [];
var rockets = [];

  //This function adds amo in the array that will serve as a reserve for shootings
function addProjectile() {
  var newTweet = new Tweet();
  var newSlowTweet = new SlowTweet();
  tweets.push(newTweet);
  tweets.push(newSlowTweet);
  var newRocket = new Rocket();
  var newSlowRocket = new SlowRocket();
  rockets.push(newRocket);
  rockets.push(newSlowRocket);
}

  //This anonymous function randomly calls the addProjectile function (setInterval can only have regular interval, I want irregularity)
(function loop() {
    var rand = Math.round(Math.random() * (8000 - 2000)) + 2000;
    setTimeout(function() {
            addProjectile();
            loop();
    }, rand);
}());

//------------------------------------------------------------------------------------------------------------------------
//USER BAR OBJECT AND METHODS
//------------------------------------------------------------------------------------------------------------------------

//User Bar Prototype
function UserBar() {
  this.x = canvas.width / 2;
  this.y = canvas.height - 80;
  this.img = new Image();
  this.img.src = "./images/HeartBar.png";
  this.height = 60;
  this.width = 60;
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
  this.width = 40 * 1.2;
  this.height = 40 * 1.2;
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
        timer = 00;
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
        timer = 00;
      }
    }

    //Draw tweet
    draw(oneTweet);
    oneTweet.move();
  });

  //Redraw the ego points of each character after being hit
  ctx.font = "30px 'Kanit'";
  ctx.fillStyle = "#f15b29";
  ctx.fillText("Ego level: " + trump.ego, 40, 30);
  ctx.fillText("Ego level: " + kim.ego, kim.x - 100, 30);
  ctx.strokeStyle = "#931f20";
  ctx.strokeText("Ego level: " + trump.ego, 40, 30);
  ctx.strokeText("Ego level: " + kim.ego, kim.x - 100, 30);

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
    if (userBar.x <= 1100) {
      userBar.x += 30;
      e.preventDefault();
    }
  } else if (e.keyCode === 37) {
    if (userBar.x >= 100) {
      userBar.x -= 30;
      e.preventDefault();
    }
  } else if (e.keyCode === 32) {
    userBar.shoot();
    e.preventDefault();
  }
};
