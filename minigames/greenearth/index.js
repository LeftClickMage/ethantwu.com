var player = {
    username: "Guest",
    mapSpeed: 0.8,
    speed: 120,
    cash: 0,
    uid: "",
    houseLevel: 0,
    highestWave: 0,
}
var enemy = {
    speed: 200
}
var config = {

        width: window.innerWidth,
        height: window.innerHeight,
    
        fps: {
            target:60,
            forceSetTimeOut: true
        },
    backgroundColor: 0x000000,
    scene: [loadandanimations, titleScreen, greenearth, minimapBorder, hotbar, resources, health, waveTimer,gameOverScreen],
    pixelArt:true, //prevents pixel art from being blurred when scaled OP!!
    physics: {
        default: "arcade",
        arcade:{
            debug: false
        }
    },
    input: {
        gamepad: true,
    },
}

var game = new Phaser.Game(config);
