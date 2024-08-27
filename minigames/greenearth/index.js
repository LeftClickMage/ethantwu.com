var player = {
    username: "Guest",
    mapSpeed: 0.8,
    speed: 120,
    cash: 0,
    uid: "",
    houseLevel: 1,
    highestWave: 20,
}


document.addEventListener("keydown", (event)=>{
    switch (event.code){
        case "ShiftLeft":
            player.speed = 180;
            break;
    }
});


document.addEventListener("keyup", (event)=>{
    switch (event.code){
        case "ShiftLeft":
            player.speed = 120;
            break;
    }
});

var enemy = {
    speed: 200,
    bossSpeed:30,
}
var oxygen = {
    speed: 180

}
var debugValue = false;
if(window.location.hostname == "localhost"){


    debugValue = true;
}
var configNew = {
    width: window.innerWidth,
    height: window.innerHeight,
}
var config = {
        width: window.innerWidth,
        height: window.innerHeight,

        fps: {
            target:60,
            forceSetTimeOut: true
        },
    backgroundColor: 0x000000,
    scene: [loadandanimations, titleScreen, greenearth, minimapBorder, hotbar, resources, health, waveTimer,gameOverScreen, victoryScreen, tutorial],
    pixelArt:true, //prevents pixel art from being blurred when scaled OP!!
    physics: {
        default: "arcade",
        arcade:{
            debug: debugValue,
        }
    },
    input: {
        gamepad: true,
    },
}

var game = new Phaser.Game(config);
window.addEventListener("resize", (event)=>{
    configNew.width = window.innerWidth;
    configNew.height = window.innerHeight;
    game.scale.resize(configNew.width, configNew.height);
    game.scale.refresh();
});




    

