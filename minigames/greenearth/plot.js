class Plot extends Phaser.GameObjects.Sprite{

constructor(x, y, scene){
    var x = x;
    var y = y;
    super(scene, x, y, "plot");
    this.setScale(4)
    this.occupied = false;
    this.occupiedWith = "";
    this.setInteractive();
    scene.add.existing(this);
    scene.physics.world.enableBody(this);

}
update(){
   
}


}