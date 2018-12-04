//------------------------------------------------------------------------------------------------------------------------
//GENERAL CODE
//------------------------------------------------------------------------------------------------------------------------

//Settings
const zoomFactor = 0.8;
const slowSpeed = 2;
const highSpeed = 7;

//Initialising the canvas
const canvas = document.getElementById("gameboard");
const ctx = canvas.getContext("2d");
canvas.width = 1200 * zoomFactor;
canvas.height = 600 * zoomFactor;

//creating the board
class Board {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.img = new Image();
    this.img.src = "images/mapclaire.jpg";
    this.height = canvas.height;
    this.width = canvas.width;
  }
}

const board = new Board();

//Timer
let timer = 90;
const timerSpan = document.getElementById("timer-span");
const timerInterval = setInterval(function() {
  timer--;
  timerSpan.textContent = timer;
  if (timer <= 0) {
    clearInterval(timerInterval);
  }
}, 1000);

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

class Character {
  constructor(x, img, imgWidth) {
    this.x = x;
    this.y = 80;
    this.ego = 100;
    this.img = img;
    this.width = imgWidth * zoomFactor;
    this.height = 150 * zoomFactor;
  }
}

// Characters creation

//Load image for Trump
const trumpimg = new Image();
trumpimg.src = "images/Trump.png";
//creation of Trump
const trump = new Character(25, trumpimg, 147);

//Load image for Kim
const kimimg = new Image();
kimimg.src = "images/KimCharacter.png";
//creation of Kim
const kim = new Character(canvas.width - 150, kimimg, 122);

//------------------------------------------------------------------------------------------------------------------------
//CHARACTERS PROJECTILES
//------------------------------------------------------------------------------------------------------------------------

//TWEETS object and methods
class Tweet {
  constructor() {
    this.x = trump.x + trump.width + 5;
    this.y = trump.y + 25;
    this.img = new Image();
    this.img.src = "./images/Logo-Twitter.png";
    this.height = 24;
    this.width = 30;
    this.isIntercepted = false;
  }

  move() {
    this.x += highSpeed;
  }
}

//Create a second type of tweets that will move slower

class SlowTweet extends Tweet {
  constructor(x, img, width, height, isIntercepted) {
    super(x, img, width, height, isIntercepted);
    this.y = trump.y + 45;
  }

  move() {
    this.x += slowSpeed;
  }
}

//ROCKETS object and methods
class Rocket {
  constructor() {
    this.x = kim.x;
    this.y = kim.y + 75;
    this.img = new Image();
    this.img.src = "./images/Rocket.png";
    this.width = 30;
    this.height = 30;
    this.isIntercepted = false;
  }

  move() {
    this.x -= highSpeed;
  }
}

//Create a second type of rockets that will move slower

class SlowRocket extends Rocket {
  constructor(x, img, width, height, isIntercepted) {
    super(x, img, width, height, isIntercepted);
    this.y = kim.y + 30;
  }

  move() {
    this.x -= slowSpeed;
  }
}

//HAVE THE CHARACTERS RANDOMLY SHOOT PROJECTILES
let tweets = [];
let rockets = [];

//This function adds amo in the array that will serve as a reserve for shootings
function addTweets() {
  const newTweet = new Tweet();
  const newSlowTweet = new SlowTweet();
  tweets.push(newTweet);
  tweets.push(newSlowTweet);
}

function addRockets() {
  const newRocket = new Rocket();
  const newSlowRocket = new SlowRocket();
  rockets.push(newRocket);
  rockets.push(newSlowRocket);
}

//This self-calling function calls the addTweets and addRockets functions with randomIntervals
(function tweetLoop() {
  const rand = Math.round(Math.random() * (6000 - 2000)) + 2000;
  setTimeout(function() {
    addTweets();
    tweetLoop();
  }, rand);
})();

(function rocketLoop() {
  const rand = Math.round(Math.random() * (6000 - 2000)) + 2000;
  setTimeout(function() {
    addRockets();
    rocketLoop();
  }, rand);
})();

//------------------------------------------------------------------------------------------------------------------------
//USER BAR OBJECT AND METHODS
//------------------------------------------------------------------------------------------------------------------------

//User Bar Prototype
class UserBar {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height - 80;
    this.img = new Image();
    this.img.src = "./images/HeartBar.png";
    this.height = 60 * zoomFactor;
    this.width = 60 * zoomFactor;
  }

  shoot() {
    const newHeart = new Heart();
    hearts.push(newHeart);
  }
}

//Creation of the userBar
const userBar = new UserBar();
const hearts = [];

//Heart Projectile Object and methods
class Heart {
  constructor() {
    this.x = userBar.x;
    this.y = userBar.y;
    this.img = new Image();
    this.img.src = "./images/like.png";
    this.width = 30;
    this.height = 30;
  }

  move() {
    this.y -= 15;
  }
}

//----------------------------------------------------------------------------------------------------------
//GAME LOGIC AND VISUALS
//----------------------------------------------------------------------------------------------------------

//If the user manages to keep the game going on for 2 min without having the characters lose their temper, he wins yay yay!
const game = setTimeout(function() {
  clearInterval(drawLoop);
}, 90000);

//Draw loop (){
const drawLoop = setInterval(function() {
  //erase the old drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //redraw the background, the characters and user bar
  draw(board);
  draw(userBar);
  draw(trump);
  draw(kim);

  //Manage hearts, rockets and tweets drawing and collisions
  heartsLogic();
  rocketsLogic();
  tweetsLogic();

  //erase tweets that have been intercepted by a heart
  tweets = tweets.filter(function(oneTweet) {
    return !oneTweet.isIntercepted;
  });

  rockets = rockets.filter(function(oneRocket) {
    return !oneRocket.isIntercepted;
  });
}, 1000 / 60);

function heartsLogic() {
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
}

function rocketsLogic() {
  //manage rockets drawings and interaction with target
  rockets.forEach(function(oneRocket) {
    if (collision(oneRocket, trump)) {
      oneRocket.isIntercepted = true;
      trump.ego -= 5;
      document.getElementById("trump-ego").setAttribute("value", trump.ego);

      //If Trump loses face: GAME OVER - NUCLEAR WAR: YOUR KIDS WILL BE BORN WITH THREE LEGS AND ONLY ONE EYE
      if (trump.ego <= 0) {
        clearInterval(drawLoop);
        clearInterval(timerInterval);
      }
    }

    draw(oneRocket);
    oneRocket.move();
  });
}

function tweetsLogic() {
  //manage tweets drawings and interaction with target
  tweets.forEach(function(oneTweet) {
    //if a tweet hits Kim, kim's ego gets damage
    if (collision(oneTweet, kim)) {
      oneTweet.isIntercepted = true;
      kim.ego -= 5;
      document.getElementById("kim-ego").setAttribute("value", kim.ego);

      //if Kim loses face: GAME OVER - NUCLEAR WAR: YOUR KIDS WILL BE BORN WITH THREE LEGS AND ONLY ONE EYE
      if (kim.ego <= 0) {
        clearInterval(drawLoop);
        clearInterval(timerInterval);
      }
    }

    //Draw tweet
    draw(oneTweet);
    oneTweet.move();
  });
}
//
//-------------------------------------------------------------------------------------------------------------------
//USER INPUT
//-------------------------------------------------------------------------------------------------------------------
const body = document.querySelector("body");
body.onkeydown = e => {
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
