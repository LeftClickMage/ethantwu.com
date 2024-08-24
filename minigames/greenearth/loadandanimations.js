class loadandanimations extends Phaser.Scene{
    
    constructor(){
        super("loadandanimations");
        this.startingScene = "titleScreen";
    }
    preload(){
        this.load.image("thELevel1", "assets/townHallEnergyLevel1.png");
        this.load.image("thELevel2", "assets/townHallEnergyLevel2.png");
        this.load.image("thELevel3", "assets/townHallEnergyLevel3.png");
        this.load.image("thELevel4", "assets/townHallEnergyLevel4.png");
        this.load.image("thELevel5", "assets/townHallEnergyLevel5.png");
        this.load.image("upgradeButton", "assets/upgrade.png");
        this.load.image("background", "assets/Grass.png");
        this.load.image("reset", "assets/reset.png");
        this.load.image("energy", "assets/energySymbol.png");
        this.load.image("highestWave", "assets/highestWave.png");
        this.load.image("house", "assets/testhouse.png");
        this.load.image("thELevel0", "assets/BlueHouse.png");
        this.load.image("blueHouseBroken", "assets/blueHouseBroken.png");
        this.load.image("treeBorder", "assets/TreeBorder.png");
        this.load.image("hotbarSlot", "assets/HotbarSlot.png");
        this.load.image("supportSlot", "assets/SupportSlot.png");
        this.load.image("attackSlot", "assets/AttackSlot.png");
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
        this.load.image("next", "assets/Next.png");
        this.load.image("titleText", "assets/titleText.png");
        this.load.image("leaf", "assets/leaf.png");
        this.load.image("startGame", "assets/startGame.png");
        this.load.image("back", "assets/Back.png");
        this.load.image("statsPageBG", "assets/statsPageBG.png");
        this.load.image("removeTower", "assets/removeTower.png");
        this.load.image("removeSlot", "assets/removeSlot.png");
        this.load.image("creativeMode", "assets/creativeMode.png"); 
        this.load.image("minusWave", "assets/minusWave.png");
        this.load.image("plusWave", "assets/plusWave.png");
        this.load.image("continue", "assets/continue.png");
        this.load.image("victoryBadge", "assets/victoryBadge.png");
        
        this.load.spritesheet("windmill", "assets/Windmill.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("loseHealth", "assets/LoseHealth.png", {
            frameWidth: 32, 
            frameHeight: 32
        });
        this.load.spritesheet("batteryPack", "assets/BatteryPack.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("agentTalking", "assets/AgentTalking.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("factoryActive", "assets/factoryActive.png", {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet("factoryIdle", "assets/factoryIdle.png", {
            frameWidth: 64,
            frameHeight: 64
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
        this.load.spritesheet("O2WalkDown", "assets/O2WalkDown.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("O2WalkUp", "assets/O2WalkUp.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("O2WalkLeft", "assets/O2WalkLeft.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("O2WalkRight", "assets/O2WalkRight.png", {
            frameWidth: 16,
            frameHeight: 16
        });
        this.load.spritesheet("tree", "assets/Tree.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("algaeTower", "assets/AlgaeTower.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("algaeTowerIdle", "assets/AlgaeTowerIdle.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("forest", "assets/Forest.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("medbay", "assets/medbay.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("truckBoss", "assets/truckBoss.png", {
            frameWidth: 96,
            frameHeight: 96
        });
        this.load.spritesheet("cfcBoss", "assets/cfcBoss.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        this.load.spritesheet("slowTower", "assets/slowTower.png", {
            frameWidth: 32,
            frameHeight: 32
        });
        this.load.spritesheet("slowTowerIdle", "assets/slowTowerIdle.png", {
            frameWidth: 32,
            frameHeight: 32
        });
    }
    create(){
        this.anims.create({
            key: "agentTalking",
            frames: this.anims.generateFrameNumbers("agentTalking"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "batteryPack",
            frames: this.anims.generateFrameNumbers("batteryPack"),
            frameRate: 20,
            repeat: -1
        });
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
            key: "factoryActive",
            frames: this.anims.generateFrameNumbers("factoryActive"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "factoryIdle",
            frames: this.anims.generateFrameNumbers("factoryIdle"),
            frameRate: 5,
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
            key: "O2WalkDown",
            frames: this.anims.generateFrameNumbers("O2WalkDown"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "O2WalkLeft",
            frames: this.anims.generateFrameNumbers("O2WalkLeft"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "O2WalkRight",
            frames: this.anims.generateFrameNumbers("O2WalkRight"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "O2WalkUp",
            frames: this.anims.generateFrameNumbers("O2WalkUp"),
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
            key: "windmill",
            frames: this.anims.generateFrameNumbers("windmill"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "forest",
            frames: this.anims.generateFrameNumbers("forest"),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: "medbay",
            frames: this.anims.generateFrameNumbers("medbay"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "algaeTower",
            frames: this.anims.generateFrameNumbers("algaeTower"),
            frameRate: 12,
            repeat: -1
        });
        this.anims.create({
            key: "algaeTowerIdle",
            frames: this.anims.generateFrameNumbers("algaeTowerIdle"),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: "slowTowerIdle",
            frames: this.anims.generateFrameNumbers("slowTowerIdle"),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: "slowTower",
            frames: this.anims.generateFrameNumbers("slowTower"),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: "truckBoss",
            frames: this.anims.generateFrameNumbers("truckBoss"),
            frameRate: 5,
            repeat: -1
        });


        this.anims.create({
            key: "cfcBoss",
            frames: this.anims.generateFrameNumbers("cfcBoss"),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: "explosionBaba",
            frames: this.anims.generateFrameNumbers("explosionBaba"),
            frameRate: 15,
            repeat: 0,
            hideOnComplete: true
        });
        this.scene.start(this.startingScene);
    }
}