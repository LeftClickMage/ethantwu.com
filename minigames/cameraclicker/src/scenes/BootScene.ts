import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload(): void {
    this.load.image("digicam", "public/sprites/digicam.png");
  }

  create(): void {
    this.scene.start("GameScene");
  }
}
