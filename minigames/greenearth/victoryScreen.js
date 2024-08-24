class victoryScreen extends Phaser.Scene {
    constructor(){
        super('victoryScreen');
    }
    
    create ()  {    
        this.mainGame = this.scene.get("startGame");
        this.mageBootstrap = this.mainGame.mageBootstrap;
        this.goGroupAlpha = 0;
        this.goGroup = this.physics.add.group();

        this.gobox =  this.add.rectangle(0, 0, config.width, config.height, 0x000000).setOrigin(0).setAlpha(0.7);
        this.goGroup.add(this.gobox);
        this.mageBootstrap.add(this.gobox);
        this.gobox.idRequirements = "scaleToFitX";
        this.gotext = new FancyText(this, config.width/2, 200 , true, "YOU WIN!", "100px", "white", "green");
        this.goGroup.add(this.gotext);

        this.mageBootstrap.add(this.gotext);
        this.gotext.idRequirements = "centerX";

       
        this.playAgainButton = new Button(this, config.width/2, 325, "playAgain", 5, "down", ()=>{
         // alert('testss');
            this.mainGame.victoryPlayAgain();
        });
        this.goGroup.add(this.playAgainButton);
      
        this.mageBootstrap.add(this.playAgainButton);
        this.playAgainButton.idRequirements = "centerX";

        this.continueButton = new Button(this, config.width/2, 390, "continue", 5, "down", ()=>{  
            // this.scene.start("titleScreen");
            this.mainGame.victoryContinue();
        });
        this.goGroup.add(this.continueButton);
        
        this.mageBootstrap.add(this.continueButton);
        this.continueButton.idRequirements = "centerX";

this.mainGame.calcCash(this.mainGame.waveNumber-1);
        this.calcLeaves();

        this.gotext2 = new FancyText(this, config.width/2, 50, true, "You Earned", "40px", "white", "lightGreen");
        this.goGroup.add(this.gotext2);

        this.mageBootstrap.add(this.gotext2);
        this.gotext2.idRequirements = "centerX";


        this.leaf = this.add.sprite(config.width/2-30, 100, "leaf").setScale(1.6);
        this.goGroup.add(this.leaf);        

        this.mageBootstrap.add(this.leaf);
        this.leaf.idRequirements = "centerX";

        this.leafAmount = new FancyText(this, config.width/2+5, 100, false,this.leaves, "35px", "white", "lightGreen");
        this.leafAmount.y = this.leafAmount.y -= this.leafAmount.height/2;
        this.goGroup.add(this.leafAmount);

        this.mageBootstrap.add(this.leafAmount);
        this.leafAmount.idRequirements = "centerX";

        this.victoryBadge = this.add.sprite(config.width/2, 570, "victoryBadge").setScale(7);
        this.mageBootstrap.add(this.victoryBadge);
        this.victoryBadge.idRequirements = "centerX";

    }


calcLeaves(){
   var amount = 0;
   if(!this.mainGame.creativeMode){
        for(let i = this.mainGame.startingWave+1; i <= this.mainGame.waveNumber-1; i++){
            amount += i * 20;
        }
        }
        this.leaves = amount;
        
}

 update(){
      //       this.goGroup.setAlpha(this.goGroupAlpha);
      //   } else {
            // this.goGroupAlpha = 1;
            // this.goGroup.setAlpha(1);
      // }
    }
}