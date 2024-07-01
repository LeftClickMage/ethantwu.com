class health extends Phaser.Scene {
    constructor(){
        super('health');
    }
    
    create () {
        this.mainGame = this.scene.get("startGame");
        
        // this.input.on("pointerdown", this.check, this);

        this.heart1 = this.add.sprite(config.width-250, 40, "fullHeart").setScale(1.5);
        
        this.heart2 = this.add.sprite(config.width-300, 40, "fullHeart").setScale(1.5);
        this.heart3 = this.add.sprite(config.width-350, 40, "fullHeart").setScale(1.5);
        this.heart4 = this.add.sprite(config.width-400, 40, "fullHeart").setScale(1.5);
        this.heart5 = this.add.sprite(config.width-450, 40, "fullHeart").setScale(1.5);
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
            this.mainGame.townHall.destroy();
            this.mainGame.townHall1.destroy();
            this.heart5.play("loseHealth", true);
            await downtime(650);
            this.heart5.setTexture("emptyHeart");
            
            await downtime(400);
            this.gameOver();
            
        } 
    }
    async gameOver(){
        this.mainGame.scene.launch("gameOverScreen");
    }
//     check(pointer, targets){
//         this.target = targets[0];
       
    
//    }
    update(){
        this.updateHealthBar();
    }
}