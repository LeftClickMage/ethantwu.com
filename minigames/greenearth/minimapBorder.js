class minimapBorder extends Phaser.Scene {
    constructor(){
        super('minimapBorder');
    }
    
    create () {
        this.mainGame = this.scene.get("startGame");
        this.add.image(config.width-210+100, 10+100, "minimapB").setScale(2);
        

    }
    
}