class gameOverScreen extends Phaser.Scene {
    constructor(){
        super('gameOverScreen');
    }
    
    create ()  {    
        this.mainGame = this.scene.get("startGame");
        this.mageBootstrap = this.add.group();
        this.goGroupAlpha = 0;
        this.goGroup = this.physics.add.group();
        
        this.gobox =  this.add.rectangle(0, 0, config.width, config.height, 0x000000).setOrigin(0);
        this.goGroup.add(this.gobox);
        this.mageBootstrap.add(this.gobox);
        this.gobox.idRequirements = "centerX";

        this.gotext = new FancyText(this, config.width/2, 200, true, "GAMEOVER", "100px", "white", "red");
        this.goGroup.add(this.gotext);

        this.mageBootstrap.add(this.gotext);
        this.gotext.idRequirements = "centerX";

       
        this.playAgainButton = new Button(this, config.width/2, 325, "playAgain", 5, "down", ()=>{  
            this.mainGame.creativeMode = false;
            this.scene.start("titleScreen");
        });
        this.goGroup.add(this.playAgainButton);

        this.mageBootstrap.add(this.playAgainButton);
        this.playAgainButton.idRequirements = "centerX";
        

this.mainGame.calcCash(this.mainGame.waveNumber-1);
        this.calcLeaves();

        this.gotext2 = new FancyText(this, config.width/2, 50, true, "You Earned", "40px", "white", "lightOrange");
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

            
        if(configNew.height !== config.height || configNew.width !== config.width){
            for(let object of this.mageBootstrap.getChildren()){
                // alert('tes');
                var requirements = [""];
                if(object.idRequirements){
                    requirements = [object.idRequirements];
                    for(let letter of object.idRequirements){
                        if (letter == " "){
                            requirements = object.idRequirements.split(" ");
                            break;
                        }
                    }
                }
                for(let requirement of requirements){
                    switch(requirement) {
                        case "stickToBottom": 
                            object.y += configNew.height-config.height;
                            break;
                        case "scaleToFitX":
                            object.width = configNew.width;
                            break;
                        case "centerX":
                            object.x += (configNew.width-config.width)/2;
                            break;
                        case "stickToRight":
                            object.x += configNew.width-config.width;
                            break;
                    }
                }
            }
            config.height = configNew.height;
            config.width = configNew.width;
        }
 
 
        if (this.goGroupAlpha < 1) {
            this.goGroupAlpha += 0.01;
            this.goGroup.setAlpha(this.goGroupAlpha);
        } else {
            this.goGroupAlpha = 1;
            this.goGroup.setAlpha(1);
        }
    }
}