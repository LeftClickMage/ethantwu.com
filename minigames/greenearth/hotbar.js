class hotbar extends Phaser.Scene {
    constructor(){
        super('hotbar');
    }
    
    create () {
        this.tutorialActive = true;
        this.tutorialActiveSP = true;
        this.tutorialActiveTree = true;
        this.waveTimerScene = this.scene.get("waveTimer");
        this.tutorialScene = this.scene.get("tutorial");
        this.mainGame = this.scene.get("startGame");
        this.canPlace = true;
        this.canPlaceOBJ = true;

        this.slot1X = config.width/2-140;
        this.slot2X = config.width/2-70;
        this.slot3X = config.width/2;
        this.slot4X = config.width/2+70;
        this.slot5X = config.width/2+140;
        this.slotsY = config.height-32*1.5;

        this.cancelPopup = this.add.group();
        this.cancelBox =  this.add.rectangle(config.width - 210, 220, 200, 30, 0x000000).setOrigin(0);
        this.cancelPopup.add(this.cancelBox);
        this.cancelText = new FancyText(this, config.width-204, 225, false, "Put Anywhere to Cancel", "16px", "white", "none");
        this.cancelPopup.add(this.cancelText);
        this.cancelPopup.setAlpha(0);

        this.startWaveButton = new Button(this, config.width-140-210, 123, "startWave", 3.5, "down", ()=>{  
            if(this.tutorialActive){
                this.tutorialActive = false;
                this.tutorialActiveSP = false;
                this.tutorialActiveTree = false;
                this.tutorialScene.scene.stop();
                this.waveTimerScene.timeLeft = 0;
            } else {
                if(this.canPlace && this.canPlaceOBJ){
                    this.waveTimerScene.timeLeft = 0;
                } 
            }
        });

        this.backButton = new Button(this, 85, 100, "back", 3.5, "down", ()=>{
            this.mainGame.toTitleScreen();
        });

        

        //ALGAE TOWER
        this.add.image(this.slot1X, this.slotsY, "attackSlot").setScale(2);
        this.algaeTower = new Button(this, this.slot1X, this.slotsY, "algaeTower", 1.5, "up", ()=>{
            if(!this.tutorialActive && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.algaeTowerPrice){
                this.mainGame.createObject("algaeTower");
                this.canPlaceOBJ = false;
            }
        });
        this.algaeTowerText = "Algae Tower | "+this.mainGame.algaeTowerPrice+" Energy | "+this.mainGame.algaeTowerSpawnRate+" O2/s";
        this.algaeTowerWidth = 425;

        //BATTERY PACK
        this.add.image(this.slot2X, this.slotsY, "hotbarSlot").setScale(2);
        this.batteryPack = new Button(this, this.slot2X, this.slotsY, "batteryPack", 1.5, "up", ()=>{
            if(!this.tutorialActive && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.batteryPackPrice){
                this.mainGame.createObject("batteryPack");
                this.canPlaceOBJ = false;
            }
        });
        this.batteryText = "Battery Pack | 200 Energy | +"+ this.mainGame.batteryPackStorage + " Storage";
        this.batteryWidth = 520;

        //SOLAR PANEL
        this.add.image(this.slot3X, this.slotsY, "hotbarSlot").setScale(2);
        this.solarPanel = new Button(this, this.slot3X, this.slotsY, "solarPanel", 1.5/2, "up", ()=>{
            if(!this.tutorialActiveSP && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= 50){
                this.mainGame.createObject("solarPanel");
                this.canPlaceOBJ = false;
            }
        });
        this.energyText = "Solar Panel | 50 Energy | "+this.mainGame.solarPanelEnergyOutput+" E/s";
        this.energyWidth = 390;
        

        //WINDMILL
        this.add.image(this.slot4X, this.slotsY, "hotbarSlot").setScale(2);
        this.windmill = new Button(this, this.slot4X, this.slotsY, "windmill", 1.5, "up", ()=>{
            if(!this.tutorialActive && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.windmillPrice){
                this.mainGame.createObject("windmill");
                this.canPlaceOBJ = false;
            }
        });
        this.windmillText = "Windmill | " + this.mainGame.windmillPrice + " Energy | "+this.mainGame.windmillEnergyOutput+" E/s";
        this.windmillWidth = 365;
        
        //TREE
        this.add.image(this.slot5X, this.slotsY, "supportSlot").setScale(2);
        this.tree = new Button(this, this.slot5X, this.slotsY, "tree", 1.5, "up", ()=>{
            if(!this.tutorialActiveTree && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.treePrice){
                this.mainGame.createObject("tree");
                this.canPlaceOBJ = false;
            }
        });
        this.treeText = "Tree | "+this.mainGame.treePrice+" Energy | "+this.mainGame.treeHealth+" HP";
        this.treeWidth = 295;

        
        

        //TOOLTIP
        this.toolTipBlue = new ToolTip(this, 0, 0, 0, 39, 0x000080);
        this.toolTipRed = new ToolTip(this, 0, 0, 0, 39, 0x800000);
        this.toolTipText = new FancyText(this, 0, 0, false, "", "24px", "white", "none");

        //TOOLTIPMOVE
        this.solarPanel.on("pointermove", ()=>{
            this.toolTipManager(this.energyText, this.energyWidth, 50);
            this.input.on('pointermove', this.defineTarget, this);
        });
        this.windmill.on("pointermove", ()=>{
            this.toolTipManager(this.windmillText, this.windmillWidth, this.mainGame.windmillPrice);
            this.input.on('pointermove', this.defineTarget, this);
        });

        this.tree.on("pointermove", ()=>{
            this.toolTipManager(this.treeText, this.treeWidth, this.mainGame.treePrice);
            this.input.on('pointermove', this.defineTarget, this);
        });

        this.algaeTower.on("pointermove", ()=>{
            this.toolTipManager(this.algaeTowerText, this.algaeTowerWidth, this.mainGame.algaeTowerPrice);
            this.input.on('pointermove', this.defineTarget, this);
        });

        this.batteryPack.on("pointermove", ()=>{
            this.toolTipManager(this.batteryText, this.batteryWidth, this.mainGame.batteryPackPrice);
            this.input.on('pointermove', this.defineTarget, this);
        });

    }
    toolTipManager(text, width, cost){
        if(this.mainGame.energyValue >= cost){
            this.toolTipText.text = text;
            this.toolTipBlue.width = width;

            this.toolTipBlue.alpha = 0.7;
            this.toolTipText.alpha = 1;
            this.toolTipBlue.x = game.input.mousePointer.x;
            this.toolTipBlue.y = game.input.mousePointer.y- 40;
            this.toolTipText.x = game.input.mousePointer.x +7;
            this.toolTipText.y = game.input.mousePointer.y -35;
        } else {
            this.toolTipText.text = text;
            this.toolTipRed.width = width;
            this.toolTipRed.alpha = 0.7;
            this.toolTipText.alpha = 1;
            this.toolTipRed.x = game.input.mousePointer.x;
            this.toolTipRed.y = game.input.mousePointer.y- 40;
            this.toolTipText.x = game.input.mousePointer.x +7;
            this.toolTipText.y = game.input.mousePointer.y -35;
        }
    }

    defineTarget(pointer, targets){
        if(targets[0] == undefined){
            this.toolTipBlue.alpha = 0;
            this.toolTipRed.alpha = 0;
            this.toolTipText.alpha = 0;
            this.input.off('pointermove', this.defineTarget, this);
        }
    }
}