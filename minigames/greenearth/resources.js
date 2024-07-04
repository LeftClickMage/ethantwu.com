class resources extends Phaser.Scene {
    constructor(){
        super('resources');
    }
    
    create () {
        this.leaves = 0;
        this.resourcesY = 40;
        this.mainGame = this.scene.get("startGame");

        this.add.image(40, this.resourcesY, "energy").setScale(1.5);
        this.energyValue = new FancyText(this, 70, this.resourcesY-25, false, "0", "40px", "white", "yellow");
        this.add.image(200, this.resourcesY, "leaf").setScale(1.5);
        this.leafValue = new FancyText(this, 225, this.resourcesY-25, false, "0", "40px", "white", "lightGreen");
    }
    calcLeaves(){
        var amount = 0;
        for(let i = this.mainGame.startingWave+1; i <= this.mainGame.waveNumber-1; i++){
            amount += i * 20;
        }
        this.leaves = amount;
}
    update(){
        this.energyValue.text = Math.round(this.mainGame.energyValue);
        this.leafValue.text = this.leaves;
    
    }
}