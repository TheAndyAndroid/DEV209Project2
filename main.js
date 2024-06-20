// Create the Canvas

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.getElementById("canvas-holder").appendChild(canvas);
alert("Objective: Eat 10 pieces of food to WIN without touching any rotten food, otherwise it's GAME OVER!");

// lots of variables to keep track of sprite geometry
//  I have 4 rows and 4 cols in my sumo sprite sheet
// adjust your numbers to match your sprite sheet
var rows = 4;
var cols = 4;

var counter = 0; //slow animation

// just CONSTANTS to add names to which row on sprite sheet to use based
// which direction the sumo is moving
//second row for the right movement (counting the index from 0)
var trackRight = 2;
//third row for the left movement (counting the index from 0)
var trackLeft = 1;
var trackUp = 3;   
var trackDown = 0;

// set the pixel width and height for the section of your sheet that you are using
// in my example, I used the whole thing as mine had no extra junk
var spriteWidth = 272; // 
var spriteHeight = 288;  //  
var sumoWidth = spriteWidth / cols;  // this is how tall 1 frame is
var sumoHeight = spriteHeight / rows;   // this is how wide 1 frame is

var curXFrame = 0; // start on left side
var frameCount = 4;  // 3 frames per row on my sprite sheet
//x and y coordinates of the upper left pixel of the top left sprite sub image 
// again, I am using the entire sheet, so mine is 0 0
var srcX = 0;  // my image has no borders or other stuff
var srcY = 0;

//Assuming that at start the character is not moving
// variable set in update to say which way the character is moving.
// render will use this to pick which frame to draw
var left = false;
var right = false;
var up = false;
var down = false;

let chessBoard = [
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x'],
    ['x','x','x','x','x','x','x','x','x']
]

// **************** End of Canvas Creation **********************

// ******************** Start of Sounds  ************************

var soundGameOver = "sounds/win.wav"; //Win game sound efx
var soundEat = "sounds/eat.wav"; //Food eaten sound efx
var soundTimeLimit = "sounds/time.wav"; //Time limit runs out sound efx
let soundDead = "sounds/died.wav"; // Touch rotten food sound efx
//Assign audio to soundEfx
var soundEfx = document.getElementById("soundEfx");


// ********************* End of Sounds **************************

// ******************** Start of Images  ************************


// Background image

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image

var sumoReady = false;
var sumoImage = new Image();
sumoImage.onload = function () {
sumoReady = true;
};
sumoImage.src = "images/sumo.png";

// Monster image

var meatReady = false;
var meatImage = new Image();
meatImage.onload = function () {
meatReady = true;
};
meatImage.src = "images/meat.png";

// Sushi image

var sushiReady = false;
var sushiImage = new Image();
sushiImage.onload = function () {
sushiReady = true;
};
sushiImage.src = "images/sushi.png";

// Carrot image

var carrotReady = false;
var carrotImage = new Image();
carrotImage.onload = function () {
carrotReady = true;
};
carrotImage.src = "images/carrot.png";

// Rotten Apple image

var rottenappleReady = false;
var rottenappleImage = new Image();
rottenappleImage.onload = function () {
rottenappleReady = true;
};
rottenappleImage.src = "images/rottenapple.png";

var rottenapple1Ready = false;
var rottenapple1Image = new Image();
rottenapple1Image.onload = function () {
rottenapple1Ready = true;
};
rottenapple1Image.src = "images/rottenapple.png";

// Fish Bone image

var fishboneReady = false;
var fishboneImage = new Image();
fishboneImage.onload = function () {
fishboneReady = true;
};
fishboneImage.src = "images/fishbone.png";

var fishbone1Ready = false;
var fishbone1Image = new Image();
fishbone1Image.onload = function () {
fishbone1Ready = true;
};
fishbone1Image.src = "images/fishbone.png";

// Top Border image

var topborderReady = false;
var topborderImage = new Image();
topborderImage.onload = function () {
topborderReady = true;
};
topborderImage.src = "images/bordertop.jpg";

// Side Border image

var sideborderReady = false;
var sideborderImage = new Image();
sideborderImage.onload = function () {
sideborderReady = true;
};
sideborderImage.src = "images/borderside.jpg";

// ******************* End of Images *************************

// ***************** Create Game Objects *********************

// Game objects

var sumo = {
    speed: 256, // movement in pixels per second
    x: 467, // where on the canvas are they?
    y: 450 // where on the canvas are they?
};

var meat = {
    // The Meat does not move, so only x and y
    x: 457,
    y: 750
};

var sushi = {
    // The Sushi does not move, so only x and y
    x: 210,
    y: 290
};

var carrot = {
    // The Carrot does not move, so only x and y
    x: 700,
    y: 300
};

var rottenapple = {
    // The Rotten Apple does not move, so only x and y
    x: 100,
    y: 90
};

var rottenapple1 = {
    // The Rotten Apple does not move, so only x and y
    x: 810,
    y: 790
};

var fishbone = {
    // The Fish Bone does not move, so only x and y
    x: 800,
    y: 100
};

var fishbone1 = {
    // The Fish Bone does not move, so only x and y
    x: 100,
    y: 800
};
 
// ******************* End of Game Objects *************************

// ******************* Define Random Variables ********************** 

var foodsCaught = 0;
let gameOver = false;

// ******************* End Of Random Variables ********************** 

// ******************* Handle Keyboard Controls ********************** 

// Handle keyboard controls

var keysDown = {}; //object were we properties when keys go down
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down. In our game loop, we will move the sumo image if when
// we go thru render, a key is down
addEventListener("keydown", function (e) {
console.log(e.keyCode + " down")
keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
console.log(e.keyCode + " up")
delete keysDown[e.keyCode];
}, false)

// **************** End Of Handle Keyboard Controls ******************



// Update game objects

var update = function (modifier) {

    left = false;
    right = false;
    up = false;
    down = false;

    if (38 in keysDown && sumo.y > 32 + 4) { // holding up key
        sumo.y -= sumo.speed * modifier;
        up = true;
        }

    if (40 in keysDown && sumo.y < canvas.height - (93 + 8)) { // holding down key
        sumo.y += sumo.speed * modifier;
        down = true;
        }

    if (37 in keysDown && sumo.x > (17 + 4)) { // holding left key
        sumo.x -= sumo.speed * modifier;
        left = true;
        }

    if (39 in keysDown && sumo.x < canvas.width - (80 + 8)) { // holding right key
        sumo.x += sumo.speed * modifier;
        right = true;
        }

    // Is the sumo touching the meat?
    if (
        sumo.x <= (meat.x + 57) // Right
        && meat.x <= (sumo.x + 20) // Left
        && sumo.y <= (meat.y + 55) // Bottom
        && meat.y <= (sumo.y + 20) // Top
    ) {
        ++foodsCaught; // keep track of our “score”
        if(foodsCaught == 10){
            soundEfx.src = soundGameOver ;
            soundEfx.play();
            gameOver = true;
            soundEfx.addEventListener("ended", function() {
                alert("YOU WIN! You collected 10 pieces of food.")
            });
            reset(); // start a new cycle 
        }
        else{
            soundEfx.src = soundEat ;
            soundEfx.play();
            reset(); // start a new cycle 
        }
    }

    // Is the sumoo touching the sushi?
    if (
        sumo.x <= (sushi.x + 47) // Right
        && sushi.x <= (sumo.x + 20) // Left
        && sumo.y <= (sushi.y + 55) // Bottom
        && sushi.y <= (sumo.y + 40) // Top
     ) {
        ++foodsCaught; // keep track of our “score”
        if(foodsCaught == 10){
            soundEfx.src = soundGameOver ;
            soundEfx.play();
            gameOver = true;
            soundEfx.addEventListener("ended", function() {
                alert("YOU WIN! You collected 10 pieces of food.")
            });
            reset(); // start a new cycle 
        }
        else{
            soundEfx.src = soundEat ;
            soundEfx.play();
            reset(); // start a new cycle 
        }
    }

        // Is the sumo touching the Carrot?
        if (
            sumo.x <= (carrot.x + 37) // Right
            && carrot.x <= (sumo.x + 30) // Left
            && sumo.y <= (carrot.y + 50) // Bottom
            && carrot.y <= (sumo.y + 50) // Top
         ) {
            ++foodsCaught; // keep track of our “score”
            if(foodsCaught == 10){
                soundEfx.src = soundGameOver ;
                soundEfx.play();
                gameOver = true;
                soundEfx.addEventListener("ended", function() {
                    alert("YOU WIN! You collected 10 pieces of food.")
                });
                reset(); // start a new cycle 
            }
            else{
                soundEfx.src = soundEat ;
                soundEfx.play();
                reset(); // start a new cycle 
            }
        }

    // Is the sumo touching the rotten apple?
    if (
        sumo.x <= (rottenapple.x + 45) // Right
        && rottenapple.x <= (sumo.x + 10) // Left
        && sumo.y <= (rottenapple.y + 65) // Bottom
        && rottenapple.y <= (sumo.y + 60) // Top
    ) {
        // Sound effect for eating rotten food.
	    soundEfx.src = soundDead;
	    soundEfx.play();
        soundEfx.addEventListener("ended", function() {
            alert("GAME OVER! You touched a rotten food.")
        });
        gameOver = true; // keep track of our “score”
        reset(); // start a new cycle
    }

    if (
        sumo.x <= (rottenapple1.x + 45) // Right
        && rottenapple1.x <= (sumo.x + 10) // Left
        && sumo.y <= (rottenapple1.y + 65) // Bottom
        && rottenapple1.y <= (sumo.y + 60) // Top
    ) {
        // Sound effect for eating rotten food.
	    soundEfx.src = soundDead;
	    soundEfx.play();
        soundEfx.addEventListener("ended", function() {
            alert("GAME OVER! You touched a rotten food.")
        });
        gameOver = true; // keep track of our “score”
        reset(); // start a new cycle
    }

    // Is the sumo touching the Fish Bone?

    if (
        sumo.x <= (fishbone.x + 59) // Right
        && fishbone.x <= (sumo.x + 25) // Left
        && sumo.y <= (fishbone.y + 60) // Bottom
        && fishbone.y <= (sumo.y + 52) // Top
    ) {
        // Sound effect for eating rotten food.
	    soundEfx.src = soundDead;
	    soundEfx.play();
        soundEfx.addEventListener("ended", function() {
            alert("GAME OVER! You touched a rotten food.")
        });
        gameOver = true; // keep track of our “score”
        reset(); // start a new cycle
    }

    if (
        sumo.x <= (fishbone1.x + 59) // Right
        && fishbone1.x <= (sumo.x + 25) // Left
        && sumo.y <= (fishbone1.y + 60) // Bottom
        && fishbone1.y <= (sumo.y + 52) // Top
    ) {
        // Sound effect for eating rotten food.
	    soundEfx.src = soundDead;
	    soundEfx.play();
        soundEfx.addEventListener("ended", function() {
            alert("GAME OVER! You touched a rotten food.")
        });
        gameOver = true; // keep track of our “score”
        reset(); // start a new cycle
    }

    // curXFrame = ++curXFrame % frameCount; 	//Updating the sprite frame index 
    // it will count 0,1,2,0,1,2,0, etc

    if (counter == 20) {  // adjust this to change "walking speed" of animation
        curXFrame = ++curXFrame % frameCount; 	//Updating the sprite frame index 
        // it will count 0,1,2,0,1,2,0, etc
        counter = 0;
    } else {
        counter++;
    }

    srcX = curXFrame * sumoWidth;   	//Calculating the x coordinate for spritesheet 
    //if left is true,  pick Y dim of the correct row
    if (left) {
        //calculate srcY 
        srcY = trackLeft * sumoHeight;
    }

    //if the right is true,   pick Y dim of the correct row
    if (right) {
        //calculating y coordinate for spritesheet
        srcY = trackRight * sumoHeight;
    }

     //if the up is true,   pick Y dim of the correct row
     if (up) {
        //calculating y coordinate for spritesheet
        srcY = trackUp * sumoHeight;
    }

     //if the down is true,   pick Y dim of the correct row
     if (down) {
        //calculating y coordinate for spritesheet
        srcY = trackDown * sumoHeight;
    }

    // this code picks one frame to use if they are not moving
    if (left == false && right == false && up == false && down == false) {
        srcX = 2 * sumoWidth;
        srcY = 0 * sumoHeight;
    }
};


// The main game loop
var main = function () {
    if (gameOver == false){
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;
    // Request to do this again ASAP
    requestAnimationFrame(main);
    }
};

var render = function () {
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        } //border location
        if (topborderReady && sideborderReady) {
            ctx.drawImage(topborderImage, 0, 0);
            ctx.drawImage(topborderImage, 0, (1000 - 32));
            ctx.drawImage(sideborderImage, (1000 - 32), 0);
            ctx.drawImage(sideborderImage, 0, 0);
        }
        if (sumoReady) {
            ctx.drawImage(sumoImage, srcX, srcY, sumoWidth, sumoHeight, sumo.x, sumo.y, sumoWidth, sumoHeight);
        }

        if (meatReady) {
            ctx.drawImage(meatImage, meat.x, meat.y);
         }
        
        if (sushiReady) {
            ctx.drawImage(sushiImage, sushi.x, sushi.y);
        }

        if (carrotReady) {
            ctx.drawImage(carrotImage, carrot.x, carrot.y);
        }

        if (rottenappleReady) {
            ctx.drawImage(rottenappleImage, rottenapple.x, rottenapple.y);
        }

        if (rottenapple1Ready) {
            ctx.drawImage(rottenapple1Image, rottenapple1.x, rottenapple1.y);
        }

        if (fishboneReady) {
            ctx.drawImage(fishboneImage, fishbone.x, fishbone.y);
        }

        if (fishbone1Ready) {
            ctx.drawImage(fishbone1Image, fishbone1.x, fishbone1.y);
        }

         // Score
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "36px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText("Foods eaten: " + foodsCaught, 32, 32);
}


// Reset the game when the sumo catches a piece of food

var reset = function () {
    if(gameOver == false){

        placeItem(sumo);
        placeItem(meat);
        placeItem(sushi);
        placeItem(carrot);
        placeItem(rottenapple);
        placeItem(rottenapple1);
        placeItem(fishbone);
        placeItem(fishbone1);

    }
};

let placeItem = function (character)
{
    let X = 5;
    let Y = 6;
    let success = false;
    while(!success) {
        X = Math.floor( Math.random( ) * 9 ); //Returns 0 through 8

        Y = Math.floor( Math.random( ) * 9 ); //Returns 0 through 8

        if (chessBoard[X][Y] === 'x' ) {
            success = true;
        }
    }
    chessBoard[X][Y] = 'O'; //Mark that these squares are taken
    character.x = (X*100) + 32// allow for border
    character.y = (Y*100) + 32
};

// Let's play this game!

var then = Date.now();
//reset();
main(); // call the main game loop.