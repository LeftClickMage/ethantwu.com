class hotbar extends Phaser.Scene {
    constructor(){
        super('hotbar');
    }
    
    create () {
        
        this.waveTimerScene = this.scene.get("waveTimer");
        this.mainGame = this.scene.get("startGame");
        this.canPlace = true;
        this.canPlaceOBJ = true;

        this.slot1X = config.width/2-35;
        this.slot2X = config.width/2+35;
        this.slotsY = config.height-32*1.5;

        this.cancelPopup = this.add.group();
        this.cancelBox =  this.add.rectangle(config.width - 210, 220, 200, 30, 0x000000).setOrigin(0);
        this.cancelPopup.add(this.cancelBox);
        this.cancelText = new FancyText(this, config.width-204, 225, false, "Put Anywhere to Cancel", "16px", "white", "none");
        this.cancelPopup.add(this.cancelText);
        this.cancelPopup.setAlpha(0);

        this.startWaveButton = new Button(this, config.width-140-210, 123, "startWave", 3.5, "down", ()=>{  
            if(this.canPlace && this.canPlaceOBJ){
                this.waveTimerScene.timeLeft = 0;
            } 
        });

        this.backButton = new Button(this, 85, 100, "back", 3.5, "down", ()=>{
            this.mainGame.toTitleScreen();
        });

        //SOLAR PANEL
        this.add.image(this.slot1X, this.slotsY, "hotbarSlot").setScale(2);
        this.solarPanel = new Button(this, this.slot1X, this.slotsY, "solarPanel", 1.5/2, "up", ()=>{
            if(this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= 50){
                this.mainGame.createObject("solarPanel");
                this.canPlaceOBJ = false;
            }
        });
        this.energyText = "Solar Panel | 50 Energy | "+this.mainGame.solarPanelEnergyOutput+" E/s";
        this.energyWidth = 390;
        
        //TREE
        this.add.image(this.slot2X, this.slotsY, "supportSlot").setScale(2);
        this.tree = new Button(this, this.slot2X, this.slotsY, "tree", 1.5, "up", ()=>{
            if(this.canPlace && this.canPlaceOBJ && this.mainGame.energyValue >= this.mainGame.treePrice){
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
        this.tree.on("pointermove", ()=>{
            this.toolTipManager(this.treeText, this.treeWidth, this.mainGame.treePrice);
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