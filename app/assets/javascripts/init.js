var context;
var queue;
var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var mouseXPosition;
var mouseYPosition;
var batImage;
var stage;
var animation;
var deathAnimation;
var spriteSheet;
var charlesSpritesheet
var kerwinSpritesheet
var darcySpritesheet
var samsonSpritesheet
var enemyXPos=100;
var enemyYPos=100;
var enemyXSpeed = 1.5;
var enemyYSpeed = 1.75;
var score = 0;
var scoreText;
var gameTimer;
var gameTime = 0;
var timerText;
var ballhitSound;
var deathSound
var spriteSheetArray;


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {
    windowWidth = window.innerWidth
    windowHeight = window.innerHeight;
    var canvas = document.getElementById('myCanvas');
    
    context = canvas.getContext('2d');
    context.canvas.width = windowWidth;
    context.canvas.height = windowHeight;
    timerText.x = windowWidth - 180;
    timerText.y = 10;
}

window.onload = function()
{

    //Set up the Canvas with Size and height
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = windowWidth;
    context.canvas.height = windowHeight;
    stage = new createjs.Stage("myCanvas");

    //Set up the Asset Queue and load sounds 
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", queueLoaded, this);
    createjs.Sound.alternateExtensions = ["ogg"];

    //Create a load manifest for all assets
    queue.loadManifest([
        {id: 'paddle', src: 'https://s3.amazonaws.com/eda-quick-draw/assets/paddle.png'},
        {id: 'crossHair', src: 'https://s3.amazonaws.com/eda-quick-draw/assets/crosshair.png'},
        {id: 'ballhit', src: 'https://s3.amazonaws.com/eda-quick-draw/assets/ballhit.mp3'},
        {id: 'background', src: 'https://s3.amazonaws.com/eda-quick-draw/assets/background.mp3'},
        {id: 'gameOverSound', src: 'https://s3.amazonaws.com/eda-quick-draw/assets/gameOver.mp3'},
        {id: 'tick', src: 'https://s3.amazonaws.com/eda-quick-draw/assets/tick.mp3'},
        {id: 'deathSound', src: 'https://s3.amazonaws.com/eda-quick-draw/assets/die.mp3'},
        {id: 'tutorsSpritesheet', src: 'https://s3.amazonaws.com/eda-quick-draw/assets/all-tutors-Spritesheet.png'},
        {id: 'batDeath', src: 'https://s3.amazonaws.com/eda-quick-draw/assets/batDeath.png'},
    ]);
    console.log("hello?", queue);
    queue.load();

    
    //Create a timer that updates once per second
   setGameTimer = function() {
    gameTimer = setInterval(updateTime, 1000);
  }

  setTimeout(setGameTimer(), 5000)

}

function queueLoaded(event)
{
    //Add Score
    scoreText = new createjs.Text("score: " + score.toString(), "36px Numans", "#FFF");
    scoreText.x = 160;
    scoreText.y = 10;
    stage.addChild(scoreText);

    //Ad Timer
    timerText = new createjs.Text("Time: " + gameTime.toString(), "36px Numans", "#FFF");
    timerText.x = windowWidth - 180;
    timerText.y = 10;
    timerText.shadow = 5
    stage.addChild(timerText);

    // Create paddle
    paddle = new createjs.Bitmap(queue.getResult("paddle"));
    paddle.x = windowWidth/2;
    paddle.y = windowHeight - 195;
    stage.addChild(paddle);

    // Create crosshair
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    crossHair.x = windowWidth/2;
    crossHair.y = windowHeight/2;
    stage.addChild(crossHair);

    // Play background sound
    var backgroundSound = createjs.Sound.createInstance("background")
    backgroundSound.play();

    // add intance of ballhit sound
    ballhitSound = createjs.Sound.createInstance("ballhit")
    // console.log(ballhitSound.volume * createjs.Sound.getVolume());

    //add instance of deathSound
    deathSound = createjs.Sound.createInstance("deathSound");

    // Create bat spritesheet
    tutorsSpritesheet = new createjs.SpriteSheet({
        "images": [queue.getResult('tutorsSpritesheet')],
        "frames": {"width": 198, "height": 117},
        "animations": { "dan":   [0,4],
                        "darcy":  [5,9],
                        "eugene": [10,14],
                        "josh":   [15,19],
                        "charles":[20,24],
                        "kerwin": [25,29],
                        "michael":[30,34],
                        "raquel": [35,39],
                        "rohan":  [40,44],
                        "samson": [45,49]}
    });    


    spriteAnimationArray = ["dan", "darcy", "eugene", "josh", "charles", "kerwin", "michael", "raquel", "rohan", "samson"]

    // Create bat death spritesheet
    batDeathSpriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('batDeath')],
        "frames": {"width": 198, "height" : 148},
        "animations": {"die": [0,7, false,1 ] }
    });

    // Create random sprite
    createEnemy();

    // Add ticker
    createjs.Ticker.setFPS(15);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);

    // Set up events AFTER the game is loaded
    window.onmousemove = handleMouseMove;
    window.onmousedown = handleMouseDown;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function createEnemy()
{   
    var numOfEnemies = spriteAnimationArray.length
	animation = new createjs.Sprite(tutorsSpritesheet, spriteAnimationArray[getRandomInt(0, numOfEnemies)]);
    animation.regX = 99;
    animation.regY = 58;
    animation.x = enemyXPos;
    animation.y = enemyYPos;
    animation.gotoAndPlay("flap");
    stage.addChildAt(animation,1);
}

function batDeath()
{
  deathAnimation = new createjs.Sprite(batDeathSpriteSheet, "die");
  deathAnimation.regX = 99;
  deathAnimation.regY = 58;
  deathAnimation.x = enemyXPos;
  deathAnimation.y = enemyYPos;
  deathAnimation.gotoAndPlay("die");
  stage.addChild(deathAnimation);
}

function tickEvent()
{
	//Make sure enemy bat is within game boundaries and move enemy Bat
	if(enemyXPos < windowWidth && enemyXPos > 0)
	{
		enemyXPos += enemyXSpeed;
	} else 
	{
		enemyXSpeed = enemyXSpeed * (-1);
		enemyXPos += enemyXSpeed;
	}
	if(enemyYPos < windowHeight && enemyYPos > 0)
	{
		enemyYPos += enemyYSpeed;
	} else
	{
		enemyYSpeed = enemyYSpeed * (-1);
		enemyYPos += enemyYSpeed;
	}

	animation.x = enemyXPos;
	animation.y = enemyYPos;
}


function handleMouseMove(event)
{
    //Offset the position by 45 pixels so mouse is in center of crosshair
    crossHair.x = event.clientX-45;
    crossHair.y = event.clientY-45;
    paddle.x = event.clientX-45;
    paddle.y = windowHeight-195;

}

function handleMouseDown(event) {
    
    //Display CrossHair
    // crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    // crossHair.x = event.clientX-45;
    // crossHair.y = event.clientY-45;
    // stage.addChild(crossHair);
    // createjs.Tween.get(crossHair).to({alpha: 0},1000);
    

    //Play ballhit sound
    ballhitSound.play({volume:20})

    //Increase speed of enemy slightly
    enemyXSpeed *= 1.05;
    enemyYSpeed *= 1.06;

    //Obtain Shot position
    var ballhitX = Math.round(event.clientX);
    var ballhitY = Math.round(event.clientY);
    var spriteX = Math.round(animation.x);
    var spriteY = Math.round(animation.y);

    // Compute the X and Y distance using absolte value
    var distX = Math.abs(ballhitX - spriteX);
    var distY = Math.abs(ballhitY - spriteY);

    // Anywhere in the body or head is a hit - but not the wings
    if(distX < 30 && distY < 59 )
    {
    	//Hit
    	stage.removeChild(animation);
    	batDeath();
    	score += 100;
    	scoreText.text = "score: " + score.toString();
        deathSound.play();
    	
        //Make it harder next time
    	enemyYSpeed *= 1.25;
    	enemyXSpeed *= 1.3;

    	//Create new enemy
    	var timeToCreate = Math.floor((Math.random()*3500)+1);
	    setTimeout(createEnemy,timeToCreate);

    } else
    {
    	//Miss
    	score -= 10;
    	scoreText.text = "score: " + score.toString();

    }
}

function sendPoints(scoreObject) {
    $.ajax({
        type: "POST",
        url: "https://eda-quick-draw.herokuapp.com/scores",
        data: scoreObject
    }).done(function (response) {
        console.log(response);
        alert("Congratulations!\nYou scored: " + response[1] + "\nYour high score is: " + response[0]);
        window.location.href = 'https://eda-quick-draw.herokuapp.com/';
    }).fail(function (err) {
        alert(err);
        window.location.href = 'https://eda-quick-draw.herokuapp.com/';
    });
}

function updateTime()
{
    gameTime += 1;
    if(gameTime > 60)
    {
        //End Game and Clean up
        timerText.text = "fin";
        stage.removeChild(animation);
        stage.removeChild(crossHair);
        stage.removeChild(paddle);
        createjs.Sound.removeSound("ballhit");
        // var si =createjs.Sound.play("gameOverSound");
        clearInterval(gameTimer);
        sendPoints({"points": score});

    }
    else
    {
        timerText.text = "Time: " + gameTime
    // createjs.Sound.play("tick");
    }
}



