class titleScreen extends Phaser.Scene {
    constructor(){
        super('titleScreen');
    }
    
    create ()  {    
        
        this.goGroupAlpha = 0;
        this.goGroup = this.physics.add.group();

        this.gobox =  this.add.tileSprite(0, 0, config.width, config.height, "titleScreenBG").setScale(2);
        this.goGroup.add(this.gobox);

        this.gotext = this.add.sprite(config.width/2, config.height/2-45, "titleText").setScale(4.8);
        this.goGroup.add(this.gotext);

        this.playAgainButton = this.add.sprite(config.width/2, config.height/2+45, "startGame").setScale(6);
        this.goGroup.add(this.playAgainButton);
        this.playAgainButton.x = config.width/2;
        this.playAgainButton.setInteractive();

        this.input.on("pointerdown", this.checkObject, this);
        this.add.text(0, 0, "Version 1.0: RELEASE (June 30 2024)", {font: "25px Minecraft"});

    }
   checkObject(pointer, targets){
    this.target = targets[0];
        if(this.target !== undefined){
            this.input.off("pointerdown", this.checkObject, this);
            this.scene.start("startGame");
            
        } 
    }
 update(){
        if (this.goGroupAlpha < 1) {
            this.goGroupAlpha += 0.01;
            this.goGroup.setAlpha(this.goGroupAlpha);
        } else {
            this.goGroupAlpha = 1;
            this.goGroup.setAlpha(1);
        }
    }
}