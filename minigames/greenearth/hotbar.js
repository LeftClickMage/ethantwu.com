class hotbar extends Phaser.Scene {
    constructor(){
        super('hotbar');
    }
    
    create () {
        this.startWaveButton = this.physics.add.image(config.width-140-210, 123, "startWave").setScale(3.5);
        this.startWaveButton.setInteractive();
        this.waveTimerScene = this.scene.get("waveTimer");

        this.cancelPopup = this.add.group();
        this.cancelBox =  this.add.rectangle(config.width - 210, 220, 200, 30, 0x000000).setOrigin(0);
        this.cancelPopup.add(this.cancelBox);
        this.cancelText = this.add.text(config.width-204, 225, "Put Anywhere to Cancel", {font: '16px Minecraft'}).setOrigin(0);
        this.cancelPopup.add(this.cancelText);
        this.cancelPopup.setAlpha(0);

        this.overObject = false;
        this.canPlace = true;
        this.canPlaceOBJ = true;

        this.slot1X = config.width/2-35;
        this.slot2X = config.width/2+35;
        this.slotsY = config.height-32*1.5;


        this.mainGame = this.scene.get("startGame");
        this.add.image(this.slot1X, this.slotsY, "hotbarSlot").setScale(2);
        this.solarPanel = this.add.image(this.slot1X, this.slotsY, "solarPanel").setScale(1.5/2);
        this.solarPanel.setInteractive();
        this.add.image(this.slot2X, this.slotsY, "supportSlot").setScale(2);
        this.tree = this.add.image(this.slot2X, this.slotsY, "tree").setScale(1.5);
        this.tree.setInteractive();


        this.input.on("pointerdown", this.checkObject, this);
        this.color = 0x000000;
        this.blue = 0x000080;
        this.red = 0x800000;
        this.toolTipBlue =  this.add.rectangle( 0, 0, 0, 39, this.blue).setOrigin(0);
        this.toolTipRed =  this.add.rectangle( 0, 0, 0, 39, this.red).setOrigin(0);
        this.toolTipText = this.add.text( 0, 0, "", {font: '24px Minecraft'}).setOrigin(0);
        this.energyText = "Solar Panel | 50 Energy | "+this.mainGame.solarPanelEnergyOutput+" E/s";
        this.energyWidth = 390;
        this.treeText = "Tree | "+this.mainGame.treePrice+" Energy | "+this.mainGame.treeHealth+" HP";
        this.treeWidth = 295;
        this.toolTipBlue.alpha = 0;
        this.toolTipRed.alpha = 0;
        this.toolTipText.alpha = 0;
    // this.input.on('pointermove', this.moveToolTip, this);
    // this.input.setPollOnMove();
        this.input.on('gameobjectover', function (pointer, targets) {
        
        
        this.overObject = true;
        this.input.on('pointermove', this.defineTarget, this);
    }, this);

    // this.input.on('gameobjectout', function (pointer, targets) {
    //     this.toolTip.alpha = 0;
    //     this.toolTipText.alpha = 0;
    // }, this);
    }
defineTarget(pointer, targets){
    this.target = targets[0];
    if(this.target == undefined){
        this.overObject = false;
        this.toolTipBlue.alpha = 0;
        this.toolTipRed.alpha = 0;
        this.toolTipText.alpha = 0;
        this.input.off('pointermove', this.defineTarget, this);
    }
}
    moveToolTip(){
        this.toolTipBlue.alpha = 0;
        this.toolTipRed.alpha = 0;
        this.toolTipText.alpha = 0;
        var textureName = this.target.texture.key;
        
        if(textureName == "solarPanel"){
            if(this.mainGame.energyValue >= 50){
                this.toolTipText.text = this.energyText;
                this.toolTipBlue.width = this.energyWidth;

                this.toolTipBlue.alpha = 0.7;
                this.toolTipText.alpha = 1;
                this.toolTipBlue.x = game.input.mousePointer.x;
                this.toolTipBlue.y = game.input.mousePointer.y- 40;
                this.toolTipText.x = game.input.mousePointer.x +7;
                this.toolTipText.y = game.input.mousePointer.y -35;
            } 
           else {
                this.toolTipText.text = this.energyText;
                this.toolTipRed.width = this.energyWidth;

                this.toolTipRed.alpha = 0.7;
                this.toolTipText.alpha = 1;
                this.toolTipRed.x = game.input.mousePointer.x;
                this.toolTipRed.y = game.input.mousePointer.y- 40;
                this.toolTipText.x = game.input.mousePointer.x +7;
                this.toolTipText.y = game.input.mousePointer.y -35;
            }

           
        } else if(textureName == "tree"){
            if(this.mainGame.energyValue >= this.mainGame.treePrice){
                this.toolTipText.text = this.treeText;
                this.toolTipBlue.width = this.treeWidth;

                this.toolTipBlue.alpha = 0.7;
                this.toolTipText.alpha = 1;
                this.toolTipBlue.x = game.input.mousePointer.x;
                this.toolTipBlue.y = game.input.mousePointer.y- 40;
                this.toolTipText.x = game.input.mousePointer.x +7;
                this.toolTipText.y = game.input.mousePointer.y -35;
            } 
           else {
                this.toolTipText.text = this.treeText;
                this.toolTipRed.width = this.treeWidth;

                this.toolTipRed.alpha = 0.7;
                this.toolTipText.alpha = 1;
                this.toolTipRed.x = game.input.mousePointer.x;
                this.toolTipRed.y = game.input.mousePointer.y- 40;
                this.toolTipText.x = game.input.mousePointer.x +7;
                this.toolTipText.y = game.input.mousePointer.y -35;
            }

           
        } 

    }
   checkObject(pointer, targets){
    this.target = targets[0];
    if(this.target == undefined){
        
    } else {
        if(this.canPlace && this.canPlaceOBJ){
            this.targetName = this.target.texture.key;
             if(this.target.texture.key == "startWave"){
            this.waveTimerScene.timeLeft = 0;
        } 
            if(this.target.texture.key == "solarPanel" && this.mainGame.energyValue >= 50){
                this.mainGame.createObject(this.targetName);
                this.canPlaceOBJ = false;
            } else if(this.target.texture.key == "tree" && this.mainGame.energyValue >= this.mainGame.treePrice){
                this.mainGame.createObject(this.targetName);
                this.canPlaceOBJ = false;
            }
        }
        

    }
    
   }
   setCanPlace(value){
    this.canPlaceOBJ = value;
   }
    
    update(){
        if(this.overObject){
        this.moveToolTip();
        // this.input.on('pointermove', this.moveToolTip, this);
        }
    
    }
}