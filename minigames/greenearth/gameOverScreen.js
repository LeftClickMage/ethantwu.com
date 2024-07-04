class gameOverScreen extends Phaser.Scene {
    constructor(){
        super('gameOverScreen');
    }
    
    create ()  {    
        this.mainGame = this.scene.get("startGame");
        this.goGroupAlpha = 0;
        this.goGroup = this.physics.add.group();

        this.gobox =  this.add.rectangle(0, 0, config.width, config.height, 0x000000).setOrigin(0);
        this.goGroup.add(this.gobox);

        this.gotext = new FancyText(this, config.width/2, config.height/2-20, true, "GAMEOVER", "100px", "white", "lightOrange");
        this.goGroup.add(this.gotext);

       
        this.playAgainButton = new Button(this, config.width/2, config.height/2+100, "playAgain", 6, "down", ()=>{  
            this.scene.start("titleScreen");
        });
        this.goGroup.add(this.playAgainButton);
        

this.mainGame.calcCash(this.mainGame.waveNumber-1);
        this.calcLeaves();

        this.gotext2 = new FancyText(this, config.width/2, config.height/2-250, true, "You Earned", "40px", "white", "lightOrange");
        this.goGroup.add(this.gotext2);


        this.leaf = this.add.sprite(config.width/2-30, config.height/2-170, "leaf").setScale(1.6);
        this.goGroup.add(this.leaf);        

        this.leafAmount = new FancyText(this, config.width/2+5, config.height/2-170, false,this.leaves, "35px", "white", "lightGreen");
        this.leafAmount.y = this.leafAmount.y -= this.leafAmount.height/2;
        this.goGroup.add(this.leafAmount);
    }


calcLeaves(){
   var amount = 0;
        for(let i = this.mainGame.startingWave+1; i <= this.mainGame.waveNumber-1; i++){
            amount += i * 20;
        }
        this.leaves = amount;
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