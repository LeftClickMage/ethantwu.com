class ObjectCreator extends Phaser.GameObjects.Sprite{

constructor(scene, object){
    // var x = scene.game.input.mousePointer.x + this.player.x - config.width/2;
    // var y = scenegame.input.mousePointer.y + this.player.y - config.height/2;
    var x = 0;
    var y = 0;
    super(scene, x, y, object);
    // this.setImmovable(true);
    var scale = 1;
    if(object == "solarPanel"){
        scale = 2;
    } else if (object == "windmill"){
        scale = 3/4;
    }
    scene.add.existing(this.setScale(3/scale));
    scene.physics.world.enableBody(this);
}



}