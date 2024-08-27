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
        this.towerGroup = this.add.group();

        this.mageBootstrap = this.mainGame.mageBootstrap;
        this.canPlace = true;
        this.canPlaceOBJ = true;

        this.slot1X = config.width/2-280;
        this.slot2X = config.width/2-210;
        this.slot3X = config.width/2-140;
        this.slot4X = config.width/2 - 70;
        this.slot5X = config.width/2;
        this.slot6X = config.width/2 + 70;
        this.slot7X = config.width/2 +140;
        this.slot8X = config.width/2 + 210;
        this.slot9X = config.width/2 + 280;
        this.slotsY = config.height-32*1.5;

        this.cancelPopup = this.add.group();
        this.cancelBox =  this.add.rectangle(config.width - 210, 220, 200, 30, 0x000000).setOrigin(0);
        this.mageBootstrap.add(this.cancelBox);
        this.cancelBox.idRequirements="stickToRight";
        this.cancelPopup.add(this.cancelBox);
        this.cancelText = new FancyText(this, config.width-204, 225, false, "Put Anywhere to Cancel", "16px", "white", "none");
        this.cancelPopup.add(this.cancelText);
        this.cancelPopup.setAlpha(0);
        this.mageBootstrap.add(this.cancelText);
        this.cancelText.idRequirements = "stickToRight";

        this.startWaveButton = new Button(this, config.width-140-210, 125, "startWave", 3.5, "down", ()=>{  
            if(this.tutorialActive){
                this.tutorialActive = false;
                this.tutorialActiveSP = false;
                this.tutorialActiveTree = false;
                this.tutorialScene.scene.stop();
                this.waveTimerScene.timeLeft = 0;
            } else {
                if(this.canPlace && this.canPlaceOBJ){
                    this.waveTimerScene.pressed = true;
                    this.waveTimerScene.timeLeft = 0;
                } 
            }
        });

        this.mageBootstrap.add(this.startWaveButton);
        this.startWaveButton.idRequirements = "stickToRight";
        this.startWaveButton.alpha = 0;
        // if(true){
            this.minusWaveButton = new Button(this, config.width-140-210-68, 165, "minusWave", 3, "down", ()=>{
                if(this.mainGame.waveNumber > 1) {
                    this.mainGame.waveNumber--;
                }
            });
            this.minusWaveButton.alpha = 0;

        this.mageBootstrap.add(this.minusWaveButton);
        this.minusWaveButton.idRequirements = "stickToRight";
            this.plusWaveButton = new Button(this, config.width-140-210+68, 165, "plusWave", 3, "down", ()=>{  
                if(this.mainGame.waveNumber < 99){
                    this.mainGame.waveNumber++;
                }
            });
            this.plusWaveButton.alpha = 0;

        this.mageBootstrap.add(this.plusWaveButton);
        this.plusWaveButton.idRequirements = "stickToRight";
        // }
        
        this.backButton = new Button(this, 85, 100, "back", 3.5, "down", ()=>{
            this.mainGame.toTitleScreen();
        });

        

        //ALGAE TOWER
        this.slot1 = this.add.image(this.slot1X, this.slotsY, "attackSlot").setScale(2);
        this.mageBootstrap.add(this.slot1);
        this.slot1.idRequirements = "stickToBottom centerX";
        this.algaeTower = new Button(this, this.slot1X, this.slotsY, "algaeTower", 1.5, "up", ()=>{
            if(!this.tutorialActive && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.algaeTowerPrice){
                this.mainGame.createObject("algaeTower");
                this.canPlaceOBJ = false;
            }
        });
        this.towerGroup.add(this.algaeTower);
        this.mageBootstrap.add(this.algaeTower);
        this.algaeTower.idRequirements = "stickToBottom centerX";
        this.algaeTowerText = "Algae Tower | "+this.mainGame.algaeTowerPrice+" Energy | "+this.mainGame.algaeTowerSpawnRate+" O2/s";
        this.algaeTowerWidth = 450;
        this.algaeTower.cost = this.mainGame.algaeTowerPrice;

        //FOREST
        this.slot2 = this.add.image(this.slot2X, this.slotsY, "attackSlot").setScale(2);

        this.mageBootstrap.add(this.slot2);
        this.slot2.idRequirements = "stickToBottom centerX";
        this.forest = new Button(this, this.slot2X, this.slotsY, "forest", 1.5/0.85, "up", ()=>{
            if(!this.tutorialActive && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.forestPrice){
                this.mainGame.createObject("forest");
                this.canPlaceOBJ = false;
            }
        });

        this.towerGroup.add(this.forest);
        this.mageBootstrap.add(this.forest);
        this.forest.idRequirements = "stickToBottom centerX";
        this.forestText = "Forest | "+this.mainGame.forestPrice+" Energy | "+this.mainGame.forestHealth +" HP | " + this.mainGame.forestSpawnRate + " O2/s";
        this.forestWidth = 480;
        this.forest.cost = this.mainGame.forestPrice;

        //BATTERY PACK
        this.slot3 = this.add.image(this.slot3X, this.slotsY, "hotbarSlot").setScale(2);

        this.mageBootstrap.add(this.slot3);
        this.slot3.idRequirements = "stickToBottom centerX";
        this.batteryPack = new Button(this, this.slot3X, this.slotsY, "batteryPack", 1.5, "up", ()=>{
            if(!this.tutorialActive && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.batteryPackPrice){
                this.mainGame.createObject("batteryPack");
                this.canPlaceOBJ = false;
            }
        });
        this.towerGroup.add(this.batteryPack);
        this.batteryPack.cost = 200;
        this.mageBootstrap.add(this.batteryPack);
        this.batteryPack.idRequirements = "stickToBottom centerX";
        this.batteryText = "Battery Pack | 200 Energy | +"+ this.mainGame.batteryPackStorage + " Storage";
        this.batteryWidth = 520;

        //SOLAR PANEL
        this.slot4 = this.add.image(this.slot4X, this.slotsY, "hotbarSlot").setScale(2);

        this.mageBootstrap.add(this.slot4);
        this.slot4.idRequirements = "stickToBottom centerX";
        this.solarPanel = new Button(this, this.slot4X, this.slotsY, "solarPanel", 1.5/2, "up", ()=>{
            if(!this.tutorialActiveSP && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= 50){
                this.mainGame.createObject("solarPanel");
                this.canPlaceOBJ = false;
            }
        });
        this.solarPanel.cost = 50;

        this.towerGroup.add(this.solarPanel);
        this.mageBootstrap.add(this.solarPanel);
        this.solarPanel.idRequirements = "stickToBottom centerX";
        this.energyText = "Solar Panel | 50 Energy | "+this.mainGame.solarPanelEnergyOutput+" E/s";
        this.energyWidth = 390;
        

        //WINDMILL
        this.slot5 = this.add.image(this.slot5X, this.slotsY, "hotbarSlot").setScale(2);

        this.mageBootstrap.add(this.slot5);
        this.slot5.idRequirements = "stickToBottom centerX";
        this.windmill = new Button(this, this.slot5X, this.slotsY, "windmill", 1.5, "up", ()=>{
            if(!this.tutorialActive && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.windmillPrice){
                this.mainGame.createObject("windmill");
                this.canPlaceOBJ = false;
            }
        });
        this.windmill.cost = this.mainGame.windmillPrice;
        this.towerGroup.add(this.windmill);
        this.mageBootstrap.add(this.windmill);
        this.windmill.idRequirements = "stickToBottom centerX";
        this.windmillText = "Windmill | " + this.mainGame.windmillPrice + " Energy | "+this.mainGame.windmillEnergyOutput+" E/s";
        this.windmillWidth = 365;


        //SLO TOWER
        this.slot6 = this.add.image(this.slot6X, this.slotsY, "supportSlot").setScale(2);

        this.mageBootstrap.add(this.slot6);
        this.slot6.idRequirements = "stickToBottom centerX";
        this.slowTower = new Button(this, this.slot6X, this.slotsY, "slowTower", 1.5, "up", ()=>{
            if(!this.tutorialActive && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.slowTowerPrice){
                this.mainGame.createObject("slowTower");
                this.canPlaceOBJ = false;
            }
        });
        this.slowTower.cost = this.mainGame.slowTowerPrice;
        this.towerGroup.add(this.slowTower);
        this.mageBootstrap.add(this.slowTower);
        this.slowTower.idRequirements = "stickToBottom centerX";
        this.slowTowerText = "Slo Box | "+this.mainGame.slowTowerPrice+" Energy | "+this.mainGame.slowTowerRate+"x Slo-er";
        this.slowTowerWidth = 410;
        
        //TREE
        this.slot7 = this.add.image(this.slot7X, this.slotsY, "supportSlot").setScale(2);

        this.mageBootstrap.add(this.slot7);
        this.slot7.idRequirements = "stickToBottom centerX";
        this.tree = new Button(this, this.slot7X, this.slotsY, "tree", 1.5, "up", ()=>{
            if(!this.tutorialActiveTree && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.treePrice){
                this.mainGame.createObject("tree");
                this.canPlaceOBJ = false;
            }
        });

        this.tree.cost = this.mainGame.treePrice;
        this.towerGroup.add(this.tree);
        this.mageBootstrap.add(this.tree);
        this.tree.idRequirements = "stickToBottom centerX";
        this.treeText = "Tree | "+this.mainGame.treePrice+" Energy | "+this.mainGame.treeHealth+" HP";
        this.treeWidth = 295;

        //MEDBAY
        
        this.slot8 = this.add.image(this.slot8X, this.slotsY, "supportSlot").setScale(2);

        this.mageBootstrap.add(this.slot8);
        this.slot8.idRequirements = "stickToBottom centerX";
        this.medbay = new Button(this, this.slot8X, this.slotsY, "medbay", 1.5, "up", ()=>{
            if(!this.tutorialActive && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.medbayPrice){
                this.mainGame.createObject("medbay");
                this.canPlaceOBJ = false;
            }
        });
        this.medbay.cost = this.mainGame.medbayPrice
        this.towerGroup.add(this.medbay);
        this.mageBootstrap.add(this.medbay);
        this.medbay.idRequirements = "stickToBottom centerX";
        this.medbayText = "Medbay | "+this.mainGame.medbayPrice+" Energy | +"+this.mainGame.medbayRate+" HP/s";
        this.medbayWidth = 425;

        //REMOVE TOWER
        this.slot9 = this.add.image(this.slot9X, this.slotsY, "removeSlot").setScale(2);

        this.mageBootstrap.add(this.slot9);
        this.slot9.idRequirements = "stickToBottom centerX";
        this.removeTower = new Button(this, this.slot9X, this.slotsY, "removeTower", 1.5, "up", ()=>{
            if(!this.tutorialActive && this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.removeTowerPrice){
                this.mainGame.createObject("removeTower");
                this.canPlaceOBJ = false;
            }
        });
        this.removeTower.cost = this.mainGame.removeTowerPrice;
        this.towerGroup.add(this.removeTower);
        this.mageBootstrap.add(this.removeTower);
        this.removeTower.idRequirements = "stickToBottom centerX";
        this.removeTowerText = "Place to Remove a Tower | "+this.mainGame.removeTowerPrice+" Energy";
        this.removeTowerWidth = 475;


        
        

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
    
        this.medbay.on("pointermove", ()=>{
            this.toolTipManager(this.medbayText, this.medbayWidth, this.mainGame.medbayPrice);
            this.input.on('pointermove', this.defineTarget, this);
        });

        this.slowTower.on("pointermove", ()=>{
            this.toolTipManager(this.slowTowerText, this.slowTowerWidth, this.mainGame.slowTowerPrice);
            this.input.on('pointermove', this.defineTarget, this);
        });

        this.algaeTower.on("pointermove", ()=>{
            this.toolTipManager(this.algaeTowerText, this.algaeTowerWidth, this.mainGame.algaeTowerPrice);
            this.input.on('pointermove', this.defineTarget, this);
        });

        this.forest.on("pointermove", ()=>{
            this.toolTipManager(this.forestText, this.forestWidth, this.mainGame.forestPrice);
            this.input.on('pointermove', this.defineTarget, this);
        });

        this.batteryPack.on("pointermove", ()=>{
            this.toolTipManager(this.batteryText, this.batteryWidth, this.mainGame.batteryPackPrice);
            this.input.on('pointermove', this.defineTarget, this);
        });

        this.removeTower.on("pointermove", ()=>{
            this.toolTipManager(this.removeTowerText, this.removeTowerWidth, this.mainGame.removeTowerPrice);
            this.input.on('pointermove', this.defineTarget, this);
        });

    }
    toolTipManager(text, width, cost){
        if(this.mainGame.energyValue >= cost){
            this.toolTipText.text = text;
            this.toolTipBlue.width = width;

            this.toolTipBlue.alpha = 0.7;
            this.toolTipText.alpha = 1;
            if(game.input.mousePointer.x > config.width - width){
                this.toolTipBlue.x = game.input.mousePointer.x - width;
                this.toolTipText.x = game.input.mousePointer.x +7 - width;
            } else {
                this.toolTipBlue.x = game.input.mousePointer.x;
                this.toolTipText.x = game.input.mousePointer.x +7;
            }

            this.toolTipText.y = game.input.mousePointer.y -35;
            this.toolTipBlue.y = game.input.mousePointer.y- 40;
        } else {
            this.toolTipText.text = text;
            this.toolTipRed.width = width;
            this.toolTipRed.alpha = 0.7;
            this.toolTipText.alpha = 1;
            if(game.input.mousePointer.x > config.width - width){
                this.toolTipRed.x = game.input.mousePointer.x - width;
                this.toolTipText.x = game.input.mousePointer.x +7 - width;
            } else {
                this.toolTipRed.x = game.input.mousePointer.x;
                this.toolTipText.x = game.input.mousePointer.x +7;
            }

            this.toolTipText.y = game.input.mousePointer.y -35;
            this.toolTipRed.y = game.input.mousePointer.y- 40;
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

    update(){
        for(let tower of this.towerGroup.getChildren()){
            if(this.mainGame.energyValue < tower.cost){
                tower.setTint(0x666666);
            } else {
                tower.clearTint();
            }
        }
        // alert("test");
        if(this.mainGame.creativeMode && this.startWaveButton.alpha != 0){
            this.plusWaveButton.alpha = 1;
            this.minusWaveButton.alpha = 1;
        } else {
            this.plusWaveButton.alpha = 0;
            this.minusWaveButton.alpha = 0;

        
        }
        // alert(this.tutorialActive)
        if(this.tutorialActive){
            this.backButton.alpha = 0;
        } else {
            this.backButton.alpha = 1;
        }
        // this.mainGame.mageBootstrapUpdate(this.mageBootstrap);
   }
}
