//initiate Game STATEs
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex,runningtrex,deadtrex;
var ground,groundImage,invisibleGround;
var cloudImage,CloudsGroup;
var ObstaclesGroup;
var obstacle1,obstacle2,obstacle3,obstacle4,obstacle5,obstacle6;
var gameOver,gameOverImage,restart,restartImage;
var jump,die,checkpoint;
var count = 0;
localStorage["HighestScore"] = 0;
function preload(){
  runningtrex=loadAnimation("trex1.png","trex3.png","trex4.png");
  deadtrex=loadAnimation("trex_collided.png");
  groundImage=loadImage("ground2.png");
  cloudImage=loadImage("cloud.png");
  obstacle1=loadImage("obstacle1.png");
  obstacle2=loadImage("obstacle2.png");
  obstacle3=loadImage("obstacle3.png");
  obstacle4=loadImage("obstacle4.png");
  obstacle5=loadImage("obstacle5.png");
  obstacle6=loadImage("obstacle6.png");
  gameOverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  jump = loadSound("jump.mp3");
  die = loadSound("die.mp3");
  checkpoint = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
//create a trex sprite
trex = createSprite(300,180,20,50);
trex.addAnimation("running",runningtrex);
  trex.addAnimation("dead",deadtrex);
  
  
//scale and position the trex
trex.scale = 0.5;
trex.x = 50;

//create a ground sprite
ground = createSprite(300,180,600,20);
ground.addImage(groundImage);
ground.x = ground.width /2;
  

//invisible Ground to support Trex
invisibleGround = createSprite(300,185,600,5);
invisibleGround.visible = false;
  
  
//create Obstacle and Cloud Groups
ObstaclesGroup = new Group();
CloudsGroup = new Group();

  //place gameOver and restart icon on the screen
gameOver = createSprite(300,100);
restart = createSprite(300,140);
gameOver.addImage(gameOverImage);
gameOver.scale = 0.5;
restart.addImage(restartImage);
restart.scale = 0.5;

gameOver.visible = false;
restart.visible = false;

  
//set text
textSize(18);
textFont("Georgia");

}

function draw() {
   //set background to white
  background("white");
  //display score
  text("Score: "+ count, 450, 50);

  
  if(gameState === PLAY){
    //move the ground
    ground.velocityX = -(6 + 3*count/100);
    //scoring
    count += Math.round(getFrameRate()/60);
    
    if (count>0 && count%100 === 0){
     checkpoint.play();
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
     //jump when the space key is pressed
    if(keyDown("space") && trex.y >= 150){
      trex.velocityY = -12 ;
     jump.play();
    }
  
    //add gravity
    trex.velocityY = trex.velocityY + 0.8;
    
    //spawn the clouds
   spawnClouds();
    //spawn obstacles
    spawnObstacles();
    
    //End the game when trex is touching the obstacle
    if(ObstaclesGroup.isTouching(trex)){
      die.play();
      gameState = END;
    }
    
  }
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    ObstaclesGroup.setVelocityXEach(0);
    CloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("dead",deadtrex);
    
    //set lifetime of the game objects so that they are never destroyed
    ObstaclesGroup.setLifetimeEach(-1);
    CloudsGroup.setLifetimeEach(-1);
    
    
  }
  
  if(mousePressedOver(restart)) {
    reset();
  }
  
  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = random(80,120);
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    CloudsGroup.add(cloud);
  }
  
}
function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = - (6 + 3*count/100);
    
    //generate random obstacles
    var rand = Math.round( random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obstacle1);
        break;
      case 2:obstacle.addImage(obstacle2);
        break;
      case 3:obstacle.addImage(obstacle3);
        break;
      case 4:obstacle.addImage(obstacle4);
        break;
      case 5:obstacle.addImage(obstacle5);
        break;
      case 6:obstacle.addImage(obstacle6);
        break;
    }
    
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 100;
    //add each obstacle to the group
    ObstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  CloudsGroup.destroyEach();
  ObstaclesGroup.destroyEach();
  trex.changeAnimation("running",runningtrex);
  if(localStorage["HighestScore"]<count){
    localStorage["HighestScore"] = count;
  }
  count=0;
  
}
