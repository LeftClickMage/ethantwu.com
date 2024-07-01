class gameOverScreen extends Phaser.Scene {
    constructor(){
        super('gameOverScreen');
    }
    
    create ()  {    
        this.goGroupAlpha = 0;
        this.goGroup = this.physics.add.group();

        this.gobox =  this.add.rectangle(0, 0, config.width, config.height, 0x000000).setOrigin(0);
        this.goGroup.add(this.gobox);

        this.gotext = this.add.text(config.width/2, config.height/2-150, "GAME OVER", {font: "100px Minecraft"});
        this.goGroup.add(this.gotext);
        this.gotext.x = config.width/2 - this.gotext.width/2;

        this.playAgainButton = this.add.sprite(config.width/2, config.height/2+100, "playAgain").setScale(6);
        this.goGroup.add(this.playAgainButton);
        this.playAgainButton.x = config.width/2;
        this.playAgainButton.setInteractive();

        this.input.on("pointerdown", this.checkObject, this);

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