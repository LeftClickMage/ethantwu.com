class health extends Phaser.Scene {
    constructor(){
        super('health');
    }
    
    create () {
        this.mainGame = this.scene.get("startGame");
        this.mageBootstrap = this.mainGame.mageBootstrap;
        this.hotbarScene = this.scene.get("hotbar");
        // this.input.on("pointerdown", this.check, this);

        this.heart1 = this.add.sprite(config.width-250, 40, "fullHeart").setScale(1.5);
        this.mageBootstrap.add(this.heart1);
        this.heart1.idRequirements = "stickToRight";
        this.heart2 = this.add.sprite(config.width-300, 40, "fullHeart").setScale(1.5);
        this.mageBootstrap.add(this.heart2);
        this.heart2.idRequirements = "stickToRight";
        this.heart3 = this.add.sprite(config.width-350, 40, "fullHeart").setScale(1.5);
        this.mageBootstrap.add(this.heart3);
        this.heart3.idRequirements = "stickToRight";
        this.heart4 = this.add.sprite(config.width-400, 40, "fullHeart").setScale(1.5);
        this.mageBootstrap.add(this.heart4);
        this.heart4.idRequirements = "stickToRight";
        this.heart5 = this.add.sprite(config.width-450, 40, "fullHeart").setScale(1.5);
        this.mageBootstrap.add(this.heart5);
        this.heart5.idRequirements = "stickToRight";
        // this.heart6 = this.add.sprite(config.width-500, 40, "fullHeart").setScale(1.5);
        // this.heart7 = this.add.sprite(config.width-550, 40, "fullHeart").setScale(1.5);
        // this.heart8 = this.add.sprite(config.width-600, 40, "fullHeart").setScale(1.5);
        // this.heart9 = this.add.sprite(config.width-650, 40, "fullHeart").setScale(1.5);
        // this.heart10 = this.add.sprite(config.width-700, 40, "fullHeart").setScale(1.5);
    }
    async updateHealthBar(){
        if(this.mainGame.townHallHealth <= 4 && this.heart1.texture.key == "fullHeart"){
            this.heart1.play("loseHealth", true);
            await downtime(650);
            this.heart1.setTexture("emptyHeart");
        } 
        if(this.mainGame.townHallHealth <= 3 && this.heart2.texture.key == "fullHeart"){
            this.heart2.play("loseHealth", true);
            await downtime(650);
            this.heart2.setTexture("emptyHeart");
        } 
        if(this.mainGame.townHallHealth <= 2 && this.heart3.texture.key == "fullHeart"){
            this.heart3.play("loseHealth", true);
            await downtime(650);
            this.heart3.setTexture("emptyHeart");
        } 
        if(this.mainGame.townHallHealth <= 1 && this.heart4.texture.key == "fullHeart"){
            this.heart4.play("loseHealth", true);
            await downtime(650);
            this.heart4.setTexture("emptyHeart");
        } 
        if(this.mainGame.townHallHealth <= 0 && this.heart5.texture.key == "fullHeart"){

            this.mainGame.townHall.setTexture("blueHouseBroken");
            this.mainGame.townHall1.setTexture("blueHouseBroken");
            this.heart5.play("loseHealth", true);

            this.hotbarScene.backButton.setAlpha(0);
            this.hotbarScene.backButton.setInteractive(false);
            await downtime(650);
            this.heart5.setTexture("emptyHeart");
            
            await downtime(1000);
            this.mainGame.gameOver();
            
        } 
    }

//     check(pointer, targets){
//         this.target = targets[0];
       
    
//    }
    update(){
        this.updateHealthBar();
    }
}