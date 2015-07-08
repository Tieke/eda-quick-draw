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
var enemyXPos=100;
var enemyYPos=100;
var enemyXSpeed = 1.5;
var enemyYSpeed = 1.75;
var score = 0;
var scoreText;
var gameTimer;
var gameTime = 0;
var timerText;
var backgroundImage;
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
    backgroundImage.scaleY = windowHeight / 768
    backgroundImage.scaleX = windowWidth / 1024
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
        {id: 'backgroundImage', src: 'assets/background.png'},
        {id: 'paddle', src: 'assets/paddle.png'},
        {id: 'crossHair', src: 'assets/crosshair.png'},
        {id: 'ballhit', src: 'assets/ballhit.mp3'},
        {id: 'background', src: 'assets/countryside.mp3'},
        {id: 'gameOverSound', src: 'assets/gameOver.mp3'},
        {id: 'tick', src: 'assets/tick.mp3'},
        {id: 'deathSound', src: 'assets/die.mp3'},
        {id: 'batSpritesheet', src: 'assets/batSpritesheet.png'},
        {id: 'danSpritesheet', src: 'assets/dan-Spritesheet.png'},
        {id: 'eugeneSpritesheet', src: 'assets/eugene-Spritesheet.png'},
        {id: 'joshSpritesheet', src: 'assets/josh-Spritesheet.png'},
        {id: 'batDeath', src: 'assets/batDeath.png'},
    ]);
    queue.load();

    
    //Create a timer that updates once per second
    gameTimer = setInterval(updateTime, 1000);

}

function queueLoaded(event)
{
    // Add background image
    backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"))
    backgroundImage.scaleY = windowHeight / 768
    backgroundImage.scaleX = windowWidth / 1024
    stage.addChild(backgroundImage);

    //Add Score
    scoreText = new createjs.Text("score: " + score.toString(), "36px Arial", "#FFF");
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);

    //Ad Timer
    timerText = new createjs.Text("Time: " + gameTime.toString(), "36px Arial", "#FFF");
    timerText.x = windowWidth - 180;
    timerText.y = 10;
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
    backgroundSound.play({loop: -1});

    // add intance of ballhit sound
    ballhitSound = createjs.Sound.createInstance("ballhit")
    console.log(ballhitSound.volume * createjs.Sound.getVolume())

    //add instance of deathSound
    deathSound = createjs.Sound.createInstance("deathSound")

    // Create bat spritesheet
    batSpritesheet = new createjs.SpriteSheet({
        "images": [queue.getResult('batSpritesheet')],
        "frames": {"width": 198, "height": 117},
        "animations": { "flap": [0,4] }
    });    

    danSpritesheet = new createjs.SpriteSheet({
        "images": [queue.getResult('danSpritesheet')],
        "frames": {"width": 198, "height": 117},
        "animations": { "flap": [0,4] }
    });    

    eugeneSpritesheet = new createjs.SpriteSheet({
        "images": [queue.getResult('eugeneSpritesheet')],
        "frames": {"width": 198, "height": 117},
        "animations": { "flap": [0,4] }
    });    

    joshSpritesheet = new createjs.SpriteSheet({
        "images": [queue.getResult('joshSpritesheet')],
        "frames": {"width": 198, "height": 117},
        "animations": { "flap": [0,4] }
    });

    spriteSheetArray = [batSpritesheet, danSpritesheet, eugeneSpritesheet, joshSpritesheet]

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
    var numOfEnemies = spriteSheetArray.length
	animation = new createjs.Sprite(spriteSheetArray[getRandomInt(0, numOfEnemies)], "flap");
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
    crossHair.y = event.clientY-35;
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
    	scoreText.text = "1UP: " + score.toString();
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
    	scoreText.text = "1UP: " + score.toString();

    }
}

function sendPoints(scoreObject) {
    $.ajax({
        type: "POST",
        url: "http://localhost:3000/scores",
        data: scoreObject
    }).done(function (response) {
        console.log('YES - sendPoints');
        alert("Your high score: " + response);
    }).fail(function (err) {
        alert(err);
    });
}

function updateTime()
{
    gameTime += 1;
    if(gameTime > 30)
    {
        //End Game and Clean up
        timerText.text = "fin";
        stage.removeChild(animation);
        stage.removeChild(crossHair);
        createjs.Sound.removeSound("background");
        var si =createjs.Sound.play("gameOverSound");
        clearInterval(gameTimer);
        sendPoints({"points": score});
    }
    else
    {
        timerText.text = "Time: " + gameTime
    createjs.Sound.play("tick");
    }
}