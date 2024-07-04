class ToolTip extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y, width, height, color){
        super(scene, x, y, width, height, color);
        scene.add.existing(this);
        this.setOrigin(0);
        this.setAlpha(0);
  }
}