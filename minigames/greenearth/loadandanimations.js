class loadandanimations extends Phaser.Scene{
    constructor(){
        super("loadandanimations");
    }
    preload(){
        this.load.image("background", "assets/Grass.png");
        this.load.image("energy", "assets/energySymbol.png");
        this.load.image("house", "assets/testhouse.png");
        this.load.image("townHall", "assets/BlueHouse.png");
        this.load.image("treeBorder", "assets/TreeBorder.png");
        this.load.image("hotbarSlot", "assets/HotbarSlot.png");
        this.load.image("supportSlot", "assets/SupportSlot.png");
        this.load.image("plot", "assets/Plot.png");
        this.load.image("minimapB", "assets/MinimapBorder.png");
        this.load.image("solarPanel", "assets/SolarPanel.png");
        this.load.image("emptyHeart", "assets/EmptyHeart.png");
        this.load.image("fullHeart", "assets/FullHeart.png");
        this.load.image("CO2Stationary", "assets/CO2WalkDownStationary.png");
        this.load.image("enemySpawn", "assets/enemySpawn.png");
        this.load.image("startWave", "assets/startWave.png");
        this.load.image("playAgain", "assets/playAgain.png");
        this.load.image("titleScreenBG", "assets/titleScreenBG.png");
        this.load.image("titleText", "assets/titleText.png");
        this.load.image("startGame", "assets/startGame.png");
        this.load.spritesheet("loseHealth", "assets/LoseHealth.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("explosionBaba", "assets/explosionBaba.PNG", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("player", "assets/WalkDown.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("idle", "assets/Idle.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("walkLeft", "assets/WalkLeft.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("walkUp", "assets/WalkUp.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("walkRight", "assets/WalkRight.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("CO2WalkDown", "assets/CO2WalkDown.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("CO2WalkUp", "assets/CO2WalkUp.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("CO2WalkLeft", "assets/CO2WalkLeft.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("CO2WalkRight", "assets/CO2WalkRight.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("tree", "assets/Tree.png", {
            frameWidth: 32,
            frameHeight: 32
        });
    }
    create(){
        this.anims.create({
            key: "loseHealth",
            frames: this.anims.generateFrameNumbers("loseHealth"),
            frameRate: 10,
            repeat: 2
        });
        this.anims.create({
            key: "walkDown",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "walkUp",
            frames: this.anims.generateFrameNumbers("walkUp"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "walkRight",
            frames: this.anims.generateFrameNumbers("walkRight"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "walkLeft",
            frames: this.anims.generateFrameNumbers("walkLeft"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("idle"),
            frameRate: 1,
            repeat: -1
        });
        this.anims.create({
            key: "CO2WalkDown",
            frames: this.anims.generateFrameNumbers("CO2WalkDown"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "CO2WalkLeft",
            frames: this.anims.generateFrameNumbers("CO2WalkLeft"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "CO2WalkRight",
            frames: this.anims.generateFrameNumbers("CO2WalkRight"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "CO2WalkUp",
            frames: this.anims.generateFrameNumbers("CO2WalkUp"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "tree",
            frames: this.anims.generateFrameNumbers("tree"),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: "explosionBaba",
            frames: this.anims.generateFrameNumbers("explosionBaba"),
            frameRate: 15,
            repeat: 0,
            hideOnComplete: true
        });
        this.scene.start("titleScreen");
    }
}