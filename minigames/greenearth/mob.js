class Mob extends Phaser.GameObjects.Sprite{

constructor(x, y, scene){
    var x = x;
    var y = y;
    super(scene, x, y, "CO2WalkDown");
    this.setScale(3)
    scene.add.existing(this);
    scene.physics.world.enableBody(this);

}
update(){
   
}


}