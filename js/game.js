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
    backgroundColor: '#fdec96',
    audio: {
        disableWebAudio: true
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

//
function init() {
}

function preload() {
    //---personnage en transparence---
    this.load.image('background', './assets/moine-01.png');
    
    //----membres----
    this.load.image('head', './assets/moiHead-01.png');
    this.load.image('body', './assets/moiBody-01.png');
    this.load.image('hips', './assets/moiLegs2-01.png');
    this.load.image('legL', './assets/moiFootL-01.png');
    this.load.image('legR', './assets/moiFootR-01.png');
    
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
    this.load.image('gameBg', './assets/feuilledroite-01-01.png');

}

function create() {
    gameBg = this.add.image(180, 320, 'gameBg');
    gameBg.setVisible(false);
    gameBg.alpha = 0.8;
    
    var image = this.add.image(200, 250, 'background');
    image.alpha = 0.3;
//    image.setScale(0.45);
    
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
//    head.setScale(2);
    head.setName('head');
//    head.setScale(0.45);
    
    var body = this.add.image(300, 512, 'body', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(body);
    body.setName('body');
//    body.setScale(0.45);
    
    var hips = this.add.image(70, 550, 'hips', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(hips);
    hips.setName('hips');
//    hips.setScale(0.45);
    
    var legL = this.add.image(50, 212, 'legL', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(legL);
    legL.setName('legL');
//    legL.setScale(0.45);
    
    var legR = this.add.image(50, 280, 'legR', Phaser.Math.RND.pick(frames)).setInteractive();
    this.input.setDraggable(legR);
    legR.setName('legR');
//    legR.setScale(0.45);
    
    //-----les drop zones----
    // margin left, margin top, width, heigth 
    //  A drop zone
    var zone = this.add.zone(187, 158, 100, 90).setRectangleDropZone(100, 90);
    zone.setName('head');
    
    //  A drop zone
    var zone2 = this.add.zone(200, 220, 240, 70).setRectangleDropZone(240, 70);
    zone2.setName('body');
    
    //  A drop zone
    var zone3 = this.add.zone(195, 340, 180, 85).setRectangleDropZone(180, 85);
    zone3.setName('hips');
    
    
    //  A drop zone
    var zone4 = this.add.zone(232, 395, 70, 30).setRectangleDropZone(70, 30);
    zone4.setName('legR');
    
    //  A drop zone
    var zone5 = this.add.zone(127, 396, 60, 25).setRectangleDropZone(60, 25);
    zone5.setName('legL');
    
//      var graphics = this.add.graphics();
//    graphics.lineStyle(2, 0xffff00);
//    graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);
//    
//    graphics.strokeRect(zone2.x - zone2.input.hitArea.width / 2, zone2.y - zone2.input.hitArea.height / 2, zone2.input.hitArea.width, zone2.input.hitArea.height);
//    
//    graphics.strokeRect(zone3.x - zone3.input.hitArea.width / 2, zone3.y - zone3.input.hitArea.height / 2, zone3.input.hitArea.width, zone3.input.hitArea.height);
//    
//    graphics.strokeRect(zone4.x - zone4.input.hitArea.width / 2, zone4.y - zone4.input.hitArea.height / 2, zone4.input.hitArea.width, zone4.input.hitArea.height);
//    
//    graphics.strokeRect(zone5.x - zone5.input.hitArea.width / 2, zone5.y - zone5.input.hitArea.height / 2, zone5.input.hitArea.width, zone5.input.hitArea.height);
    
 
    
 
    //---drag and drop mechanics---
    this.input.on('dragstart', function (pointer, gameObject) {

        this.children.bringToTop(gameObject);
        holdSound.play();

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
        
        if(successfulDropoff === 5){
            console.log("well done!!!!");
            nextArrow.setVisible(true);
            nextArrow.setInteractive();
            finishSound.play();
            star.setVisible(true);
            gameBg.setVisible(true);
    }
        
        nextArrow.on('pointerdown', onClick);

    });
    

}


function update() {
    if(successfulDropoff === 5){
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
//    window.open("https://www.google.com", "_blank");
    window.location.replace("http://www.w3schools.com");

}

function enableMusic(){
    hasBeenClicked = true;
}
