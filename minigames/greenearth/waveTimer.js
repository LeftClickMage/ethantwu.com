class waveTimer extends Phaser.Scene {
    constructor(){
        super('waveTimer');
    }
    
    create () {
        this.secondSpawnCreated = false;
        this.gameEnded = false;
        this.finishedSpawning = true;
        this.haventStarted = true;
        this.mainGame = this.scene.get("startGame");
        this.hotbarScene = this.scene.get("hotbar");
        this.resources = this.scene.get("resources");
        this.timeLeft = 0;
        this.inProgress = false;
        // this.add.image(40, 40, "energy").setScale(1.5);
        this.timerText = new FancyText(this, config.width-350-115, 69, false, "", "32px", "white", "red");
       
    }
     async decreaseTimer(){
        
        

        while(this.timeLeft > 0){
            this.timeLeft -= 1;
            for(let i = 0; i < 60; i++){
                if(this.gameEnded == true){
                    return;
                }
                await downtime(16.666666666667);
            }
            
            
        }
        this.mainGame.startWave();
        
    }
    update(){
        if(this.inProgress){
            this.timerText.text = "CO2 INCOMING!";
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
            
            if(player.highestWave < this.mainGame.waveNumber){
                player.highestWave = this.mainGame.waveNumber;
            }
            if(this.mainGame.waveNumber >= 5 && !this.secondSpawnCreated){
                this.secondSpawnCreated = true;
                this.mainGame.createEnemySpawn(500, 1500);
                if(player.highestWave <= 5){
                    this.mainGame.anotherSpawner();
                }
            }
            this.inProgress = false;
            this.timeLeft = 35;

            
            if(player.highestWave-1 == 0){
                this.timeLeft = 2000;
            }
            
            this.resources.calcLeaves();
            this.mainGame.backObjects.getChildren().forEach(function(tower){
            if(tower.texture.key == "algaeTower"){
                tower.play("algaeTowerIdle");
            }
        }, this);
        this.mainGame.frontObjects.getChildren().forEach(function(tower){
            if(tower.texture.key == "algaeTower"){
                tower.play("algaeTowerIdle");
            }
        }, this);
        this.mainGame.enemiesAlive = false;

        this.hotbarScene.startWaveButton.setAlpha(1);
            this.hotbarScene.startWaveButton.setInteractive(true);
            
            this.decreaseTimer();
           
        }
        
    }
}