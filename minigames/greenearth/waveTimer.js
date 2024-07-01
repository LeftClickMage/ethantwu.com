class waveTimer extends Phaser.Scene {
    constructor(){
        super('waveTimer');
    }
    
    create () {
        this.finishedSpawning = true;
        this.haventStarted = true;
        this.mainGame = this.scene.get("startGame");
        this.hotbarScene = this.scene.get("hotbar");
        this.timeLeft = 30;
        this.inProgress = false;
        // this.add.image(40, 40, "energy").setScale(1.5);
        this.timerText = this.add.text(config.width-350-115, 69, "wavenum", {font: "30px Minecraft"});
       
    }
     async decreaseTimer(){
        
        

        while(this.timeLeft > 0){
            this.timeLeft -= 1;
            await downtime(1000);
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
        }

        if(this.finishedSpawning && !this.mainGame.checkIfEnemiesAlive() && this.haventStarted) {
            this.haventStarted = false;
            this.mainGame.waveNumber += 1;
            this.inProgress = false;
            this.hotbarScene.startWaveButton.setAlpha(1);
            this.hotbarScene.startWaveButton.setInteractive(true);
            this.timeLeft = 25;
            this.decreaseTimer();
           
        }
        
    }
}