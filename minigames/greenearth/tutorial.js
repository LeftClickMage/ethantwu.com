class tutorial extends Phaser.Scene {
    constructor(){
        super('tutorial');
    }
    
    create () {
      this.mainGame = this.scene.get("startGame");
      this.mageBootstrap = this.mainGame.mageBootstrap;
      this.waveTimerScene = this.scene.get("waveTimer");

    }
async createBox(x, y, text, callback){
    // alert(this.mageBootstrap);
    while(typeof this.mageBootstrap == "undefined"){
        await downtime(25);
    }
    this.dialougeBox1 = this.add.rectangle(x, y, config.width, 200, 0xFFFFFF).setOrigin(0).setAlpha(.9);
    
    this.mainGame.mageBootstrap.add(this.dialougeBox1);
    this.dialougeBox1.idRequirements = "scaleToFitX";

    this.dialougeBox2 = this.add.rectangle(x, y, config.width, 15, 0x000000).setOrigin(0).setAlpha(1);

    this.mainGame.mageBootstrap.add(this.dialougeBox2);
    this.dialougeBox2.idRequirements = "scaleToFitX";
    this.dialougeBox3 = this.add.rectangle(x, y+200, config.width, 15, 0x000000).setOrigin(0).setAlpha(1);

    this.mainGame.mageBootstrap.add(this.dialougeBox3);
    this.dialougeBox3.idRequirements = "scaleToFitX";
    this.agentTalking = this.add.sprite(x+100, y+100, "agentTalking").setScale(10);
    this.agentTalking.play("agentTalking");
    this.text = new FancyText(this, x+10+200, y+20, false, text, "35px", "black", "yellow");

    this.mainGame.mageBootstrap.add(this.text);
    this.text.idRequirements = "scaleToFitTextX";
    await downtime(1150);
    

    this.button = new Button(this, config.width - 50 - 50, y + 150, "next", 3, "down", ()=>{
        if(callback == "enemySpawn"){
            this.mainGame.tutorialEnemySpawn();
        } else if(callback == "map"){
            this.mainGame.tutorialMap();
        } else if(callback == "hotbar"){
            this.mainGame.tutorialHotbar();
        } else if(callback == "placeSolarPanel"){
            this.mainGame.tutorialPlaceSolarPanel();
        } else if(callback == "startWave"){
            this.mainGame.tutorialStartWave();
        } else if (callback == "closeTutorial") {
            this.destroyBox();
            this.mainGame.lockCamOn(this.mainGame.player);

            this.mainGame.tutorialScene.scene.stop();
            this.waveTimerScene.timeLeft = 35;
        } else {

        }
    });
    if(callback == "none"){
        this.button.setAlpha(0);
    }

    this.mainGame.mageBootstrap.add(this.button);
    this.button.idRequirements = "stickToRight";
}
destroyBox(){
        this.agentTalking.destroy();
        this.dialougeBox1.destroy();
        this.dialougeBox2.destroy();
        this.dialougeBox3.destroy();
        this.button.destroy();
        this.text.destroy();
}
    update(){

    
    }
}