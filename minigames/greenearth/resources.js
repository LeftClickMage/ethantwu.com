class resources extends Phaser.Scene {
    constructor(){
        super('resources');
    }
    
    create () {
        this.mainGame = this.scene.get("startGame");
        this.add.image(40, 40, "energy").setScale(1.5);
        this.energyValue = this.add.text(70, 40-25, "0", {font: "40px Minecraft"});
    }
    update(){
        this.energyValue.text = Math.round(this.mainGame.energyValue);
    
    }
}