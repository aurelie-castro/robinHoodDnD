let config = {
    type: Phaser.CANVAS,
    width: 360,
    height: 640,
    physics: {
        default: 'arcade'
    },
    scene: {
        init: init,
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: '#f7e07f',
    audio: {
        disableWebAudio: false
    },
    autoCenter: true
};

//------------global vars-----------
let game = new Phaser.Game(config);

//variable de fin de puzzle
let successfulDropoff;

//var de la flèche
var nextArrow;

//vars de son
var holdSound;
var wrongSound;
var correctSound;
var finishSound;

var soundButton;
var hasBeenClicked;

//var du background
var gameBg;

//var de l'étoile de fin
var star;
var starScale;

var gameCover;
var startClicked;

//
function init() {
}

function preload() {
    //---personnage en transparence---
    this.load.image('background', './assets/robindesbois-01.png');
    
    this.load.image('cover', './assets/robinCOVER2-01.png');
    
    //----membres----
    this.load.image('head', './assets/robHead-01.png');
    this.load.image('body', './assets/robBody-01.png');
    this.load.image('legL', './assets/robLegL-01.png');
    this.load.image('legR', './assets/robLegR-01.png');
    this.load.image('footL', './assets/robFootL-01.png');
    this.load.image('footR', './assets/robFootR-01.png');
    
     //---arrow next---
    this.load.image('nextArrow', './assets/yellow-arrow.png');
    
    //---audio files---
    this.load.audio('hold', './assets/hold.wav');
    this.load.audio('wrong', './assets/wrong.wav');
    this.load.audio('correct', './assets/correct.wav');
    this.load.audio('finish', './assets/finish.wav');
    
    //---sound button----
    this.load.image('soundBtn', './assets/volume-up (3).png');
    
    //---star at the end---
    this.load.image('star', './assets/yellow-star.png');
    
    //---background pattern---
    this.load.image('gameBg', './assets/leaf--pattern-01.png');

}

function create() {
    
    gameCover = this.add.image(180, 320, 'cover');
    gameCover.setDepth(5);
    
    gameBg = this.add.image(180, 320, 'gameBg');
    gameBg.setVisible(false);
    gameBg.alpha = 0.8;
    
    var image = this.add.image(200, 250, 'background');
    image.alpha = 0.3;
    
    //---star---
    starScale = 0.1;
    star = this.add.image(90,530, 'star');
    star.setScale(starScale);
    star.setVisible(false);
    star.setDepth(0);
    
    //---audio---
    holdSound = this.sound.add('hold');
    wrongSound = this.sound.add('wrong');
    correctSound = this.sound.add('correct');
    finishSound = this.sound.add('finish');
    
    
    
    //----audio  btn----
    soundButton = this.add.image(50,50, 'soundBtn');
    soundButton.setScale(0.1);
    soundButton.setInteractive();
    soundButton.alpha = 0.5;
    soundButton.on('pointerdown', enableMusic);
    
    //drop off counter
    successfulDropoff = 0;
    
    //---next arrow----
    nextArrow = this.add.image(300, 550, 'nextArrow');
    nextArrow.setScale(0.7);
    nextArrow.setVisible(false);
    
    //----les membres-----
    var head = this.add.image(310, 70, 'head', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(head);
    head.setName('head');
    
    var body = this.add.image(300, 512, 'body', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(body);
    body.setName('body');
    
    var legL = this.add.image(120, 550, 'legL', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(legL);
    legL.setName('legL');
    
    var legR = this.add.image(40, 550, 'legR', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(legR);
    legR.setName('legR')
    
    var footL = this.add.image(50, 320, 'footL', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(footL);
    footL.setName('footL');
    
    var footR = this.add.image(50, 420, 'footR', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(footR);
    footR.setName('footR');
    
    //-----les drop zones----
    // margin left, margin top, width, heigth 
    //  A drop zone
    var zone = this.add.zone(227, 140, 100, 90).setRectangleDropZone(100, 90);
    zone.setName('head');
    
    //  A drop zone
    var zone2 = this.add.zone(182, 202, 240, 100).setRectangleDropZone(240, 100);
    zone2.setName('body');
    
    //  A drop zone
    var zone3 = this.add.zone(200, 350, 50, 70).setRectangleDropZone(50, 70);
    zone3.setName('legL');
    
    
    //  A drop zone
    var zone4 = this.add.zone(273, 344, 70, 70).setRectangleDropZone(70, 70);
    zone4.setName('legR');
    
    //  A drop zone
    var zone5 = this.add.zone(182, 410, 60, 60).setRectangleDropZone(60, 60);
    zone5.setName('footL');
    
     //  A drop zone
    var zone6 = this.add.zone(317, 409, 60, 60).setRectangleDropZone(60, 60);
    zone6.setName('footR');
    
    
 
    //---drag and drop mechanics---
    this.input.on('dragstart', function (pointer, gameObject) {

         if (startClicked === true){
        this.children.bringToTop(gameObject);
              holdSound.play();
         }
    }, this);

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

        gameObject.x = dragX;
        gameObject.y = dragY;

    });

    this.input.on('dragenter', function (pointer, gameObject, dropZone) {


    });

    this.input.on('dragleave', function (pointer, gameObject, dropZone) {

    });

    this.input.on('drop', function (pointer, gameObject, dropZone) {
        if(gameObject.name == dropZone.name){
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;

            gameObject.input.enabled = false;
            console.log(dropZone.name == gameObject.name);
            console.log('successful dropoff of ' + gameObject.name + ' in ' + dropZone.name);
            
            successfulDropoff++;
            console.log(successfulDropoff);
            correctSound.play();
        }
else{
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
            console.log('failed dropoff of ' + gameObject.name + ' in ' + dropZone.name);
    
            wrongSound.play();
        }
        

    });

    this.input.on('dragend', function (pointer, gameObject, dropped) {

        if (!dropped)
        {
            gameObject.x = gameObject.input.dragStartX;
            gameObject.y = gameObject.input.dragStartY;
            
        }
        
        if(successfulDropoff === 6){
            console.log("well done!!!!");
            nextArrow.setVisible(true);
            nextArrow.setInteractive();
            finishSound.play();
            star.setVisible(true);
            gameBg.setVisible(true);
    }
        

    });
    
    nextArrow.on('pointerdown', onClick);
    
         this.input.on('pointerdown', function(pointer){
         console.log(pointer.x);
         console.log(pointer.y);
        if(pointer.x >= 27 && pointer.x <= 118  && pointer.y >= 410 && pointer.y <=500){
            startClicked = true;
            gameCover.setVisible(false);
}});
    

}


function update() {
    if(successfulDropoff === 6){
         starScale += 0.001;
        star.setScale(starScale);
        if (starScale > 0.2){
            starScale = 0.2;
        } }
    
    if (hasBeenClicked === true){
        soundButton.alpha = 1;
        }

}

function onClick(){
    window.location.replace("https://games.caramel.be/friar-tuck/index.html");

}

function enableMusic(){
    hasBeenClicked = true;
}
