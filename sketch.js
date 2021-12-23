var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, invisibleGround, groundImage;
var kid, kid_running;
var virusGroup, virus1, virus2;
var fruitsGroup, fruit1, fruit2, fruit3, fruit4;
var gameover, gameoverImage;
var safe, safeImage;
var score;
var jumpSound, dieSound;

function preload(){
    groundImage = loadImage("background.png");
    kid_running = loadAnimation("kid1.png","kid2.png");

    virus1 = loadImage("virus1.png");
    virus2 = loadImage("virus2.png");

    fruit1 = loadImage("fruit1.png");
    fruit2 = loadImage("fruit2.png");
    fruit3 = loadImage("fruit3.png");
    fruit4 = loadImage("fruit4.png");

    gameoverImage = loadImage("gameover.png");
    safeImage = loadImage("staysafe.png");

    jumpSound = loadSound("jump.mp3")
    dieSound = loadSound("infected.mp3");
}


function setup(){
    createCanvas(500,180);

    //ground = createSprite(200,180,400,20);
    ground = createSprite(100,100);
    ground.addImage("ground",groundImage);
    ground.x = ground.width/2;

    invisibleGround = createSprite(200,170,400,10);
    invisibleGround.visible = false;

    kid = createSprite(50,170,20,50);
    kid.addAnimation("running",kid_running);
    kid.scale = 0.15;

    //create virus group
    virusGroup = createGroup();

    //create fruits group
    fruitsGroup = createGroup();

    gameover = createSprite(250,60);
    gameover.addImage(gameoverImage);
    gameover.scale = 0.1;

    safe = createSprite(250,140);
    safe.addImage(safeImage);
    safe.scale = 0.05;

    score = 0;
}

function draw(){
    background(230);

    //display socre
    text("Score: "+ score, 20,15);

    //display game description
    text("Eat Fruits and Vegetables! Avoid COVID-19 Omicron Virus!", 100,15);

    if(gameState === PLAY){

        gameover.visible = false;
        safe.visible = false;

        //move the ground
        ground.velocityX = -4;

        if (ground.x < 0){
            ground.x = ground.width/2;
        }

        //make the kid jump when space key is pressed
        if (keyDown("space") && kid.y >= 135){
            kid.velocityY = -11;
            jumpSound.play();
        }

        //add gravity
        kid.velocityY = kid.velocityY + 0.8

        //spawn the viruses
        spawnVirus();

        if(virusGroup.isTouching(kid)){
            gameState = END;
            dieSound.play();
        }

        //spawn the fruits
        spawnFruits();

        if(fruitsGroup.isTouching(kid)){
            fruitsGroup.destroyEach();
            score = score + 10;
        }
    }

    else if (gameState === END){
        gameover.visible = true;
        safe.visible = true;

        ground.velocityX = 0;
        kid.velocityY = 0
        kid.visible = false;

        fruitsGroup.destroyEach();
        virusGroup.destroyEach();

    }
    
    //stop kid from falling down
    kid.collide(invisibleGround);

    drawSprites();
}

function spawnVirus(){
    if (frameCount % 60 === 0){
        var covid = createSprite(400,145,10,30);
        covid.velocityX = -5;

        //generate random covid virus
        var rand_virus = Math.round(random(1,2));
        switch(rand_virus){
            case 1: covid.addImage(virus1);
                break;
            case 2: covid.addImage(virus2);
                break;
            default: break;
        }

        covid.scale = 0.05;
        covid.lifetime = 200;

        virusGroup.add(covid);
    }
}

function spawnFruits(){
    if (frameCount % 60 === 0){
        var health = createSprite(350,140,30,30);
        health.velocityX = -5;
        health.y = Math.round(random(80,100));

        //generate random healthy fruits
        var rand_fruit = Math.round(random(1,4));
        switch(rand_fruit){
            case 1: health.addImage(fruit1);
                break;
            case 2: health.addImage(fruit2);
                break;
            case 3: health.addImage(fruit3);
                break;
            case 4: health.addImage(fruit4);
                break;
            default: break;
        }

        health.scale = 0.15;
        health.lifetime = 150;

        fruitsGroup.add(health);
    }
}