class Button extends Phaser.GameObjects.Sprite
{
  constructor(scene, x, y, texture, scale, type, callback)
  {
    super(scene, x, y, texture)
    scene.add.existing(this)
    this.setScale(scale);
    this.setInteractive()
    this.on("pointer" + type, ()=> { callback() })
  }
}
