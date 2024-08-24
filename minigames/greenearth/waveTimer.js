class waveTimer extends Phaser.Scene {
    constructor(){
        super('waveTimer');
    }
    
    create () {
        this.shownVictory = false;
        this.secondSpawnCreated = false;
        this.thirdSpawnCreated = false;
        this.gameEnded = false;
        this.finishedSpawning = true;
        this.pressed = false;
        this.haventStarted = true;
        this.mainGame = this.scene.get("startGame");
        this.mageBootstrap = this.mainGame.mageBootstrap;
        this.hotbarScene = this.scene.get("hotbar");
        this.resources = this.scene.get("resources");
        this.timeLeft = 0;
        this.inProgress = false;
        // this.add.image(40, 40, "energy").setScale(1.5);
        this.timerText = new FancyText(this, config.width-350-115, 69, false, "", "32px", "white", "red");
        this.timerText.alpha = 0;
        this.mageBootstrap.add(this.timerText);
        this.timerText.idRequirements = "stickToRight";
       
    }
     async decreaseTimer(){
        
        
        try {
        while(this.timeLeft > 0){
            this.timeLeft -= 1;
            for(let i = 0; i < 60; i++){
                if(this.gameEnded == true){
                    return;
                }
                await downtime(16.666666666667);
            }
            
            
        } 
        if(!this.inProgress){
            this.mainGame.startWave();
        }
        } catch (error){
            alert(error);
        }
        
    }
    update(){

            if(this.mainGame.victoryScreenActive){
                this.timeLeft = 35;
                this.hotbarScene.tutorialActive = true;
                this.hotbarScene.tutorialActiveSP = true;
                this.hotbarScene.tutorialActiveTree = true;
            }
        
            if(player.highestWave < this.mainGame.waveNumber && !this.mainGame.creativeMode){
                player.highestWave = this.mainGame.waveNumber;
            }
            if(this.mainGame.waveNumber == 21 && this.shownVictory == false && !this.mainGame.creativeMode){
                this.mainGame.victoryScreenActive = true;
                this.scene.launch("victoryScreen");
                this.shownVictory = true;
            }
            if(this.mainGame.creativeMode && !this.pressed){
                this.timeLeft = 99;
            }


            if(this.mainGame.waveNumber >= 5 && !this.secondSpawnCreated){
                this.secondSpawnCreated = true;
                this.mainGame.createEnemySpawn(500, 1500);
                if(player.highestWave <= 5 && !this.mainGame.creativeMode){
                    this.mainGame.anotherSpawner(500, 1500);
                }
            } else if (this.secondSpawnCreated && this.mainGame.waveNumber < 5){
                this.mainGame.removeEnemySpawn(500, 1500, 2);
            }

            if(this.mainGame.waveNumber >= 15 && !this.thirdSpawnCreated){
                this.thirdSpawnCreated = true;
                this.mainGame.createEnemySpawn(1500, 500);
                if(player.highestWave <= 15 && !this.mainGame.creativeMode){
                    this.mainGame.anotherSpawner(1500, 500);
                }
            } else if (this.thirdSpawnCreated && this.mainGame.waveNumber < 15){
                this.mainGame.removeEnemySpawn(1500, 500, 3);
            }





        if(this.inProgress){
            if(this.mainGame.waveNumber == 10 || this.mainGame.waveNumber == 20){
                this.timerText.text = "BOSS WAVE!";    
                if(this.mainGame.bossObjects.getChildren().length == 0){
                    
                    this.finishedSpawning = true;
                    this.mainGame.stopAnimations();
                }
            } else {
                this.timerText.text = "CO2 INCOMING!";
            }
            this.hotbarScene.canPlace = false;
        } else {
            this.timerText.text = "Wave " + this.mainGame.waveNumber + " In: " + this.timeLeft + "s";
            this.hotbarScene.canPlace = true;
            this.mainGame.oxygen.getChildren().forEach(function(oxygen){
                oxygen.destroy();
            },this);
        }

        if(this.finishedSpawning && !this.mainGame.checkIfEnemiesAlive() && this.haventStarted) {
            
            
            this.haventStarted = false;
            this.mainGame.waveNumber += 1;
            
            

            this.inProgress = false;
            if(this.mainGame.waveNumber == this.mainGame.startingWave+1){
                this.timeLeft = 60;
            } else {
                this.timeLeft = 35;
            }

            
            if(player.highestWave-1 < 0){
                this.timeLeft = 20000;
            } else {
                this.hotbarScene.startWaveButton.setAlpha(1);
                this.timerText.alpha = 1;
            }
            
            this.resources.calcLeaves();
            this.mainGame.backObjects.getChildren().forEach(function(tower){
            switch(tower.texture.key){
                case "algaeTower":
                    tower.play("algaeTowerIdle");
                    break;
                case "slowTower":
                    tower.play("slowTowerIdle");
                    break;
            }
        }, this);
        this.mainGame.frontObjects.getChildren().forEach(function(tower){
            switch(tower.texture.key){
                case "algaeTower":
                    tower.play("algaeTowerIdle");
                    break;
                case "slowTower":
                    tower.play("slowTowerIdle");
                    break;
            }
        }, this);
        this.mainGame.enemiesAlive = false;
        this.pressed = false;

            // this.hotbarScene.startWaveButton.setInteractive(true);
            
            this.decreaseTimer();
           
        }
        
    }
}