class titleScreen extends Phaser.Scene {
    constructor(){
        super('titleScreen');
    }
    
    create ()  {    
        endGame();
        this.setUsername = false;
        this.houseLevel1Price = 150;
        this.houseLevel2Price = 600;
        this.houseLevel3Price = 1000;
        this.houseLevel4Price = 1500;
        this.timeLogIn = 0;

        this.goGroupAlpha = 0;
        this.goGroup = this.physics.add.group();

        this.gobox =  this.add.tileSprite(0, 0, config.width, config.height, "titleScreenBG").setScale(2);
        this.goGroup.add(this.gobox);

        this.gotext = this.add.sprite(config.width/2, 75+70, "titleText").setScale(4.8);
        this.goGroup.add(this.gotext);
        this.playAgainButton = new Button(this, config.width/2, 75+70+90, "startGame", 6, "down", ()=>{  
            if(!formOpen()){
                this.scene.start("startGame");
            }
            
        });
        this.goGroup.add(this.playAgainButton);

        this.playerUsername = new FancyText(this, config.width/2, 75, false, "", "40px", "white", "green");


        this.versionText = new FancyText(this, 10, 10, false, "Version 1.2.5: TUTORIAL!! | NEW TOWER, NAME TAG, HEALTH BAR, AND MORE", "25px", "white", "none");
        this.versionText.setInteractive();
        this.versionText.on("pointerdown", ()=>{
            window.open("updateLog.html");
        });
        

        
        this.upgradeRectangleY = config.height-320;
        this.upgradeSlotsY = this.upgradeRectangleY+160;
        this.upgradeSlots1X = config.width/2;
        this.textY = this.upgradeSlotsY-120;

        
        this.upgradesRectangle = this.add.rectangle(0, this.upgradeRectangleY, config.width, config.height-this.upgradeRectangleY, 0x000000).setOrigin(0).setAlpha(0.5);
        this.upgradesRectangle = this.add.rectangle(0, this.upgradeRectangleY, config.width, 15, 0x000000).setOrigin(0).setAlpha(1);
        this.leafAmountTS = this.add.sprite(30, this.upgradeRectangleY + 60, "leaf").setScale(2);
        this.goGroup.add(this.leafAmountTS);
        this.leafAmountText = new FancyText(this, 55, this.upgradeRectangleY+43, false, "", "30px", "white", "black");
        this.goGroup.add(this.leafAmountText);

        this.playerHouse = this.add.sprite(35, this.upgradeRectangleY+140, "thELevel1").setScale(0.4);
        this.goGroup.add(this.playerHouse);
        this.playerHouseText = new FancyText(this, 70, this.upgradeRectangleY+123, false, "", "30px", "white", "black");
this.goGroup.add(this.playerHouseText);


this.highestWave = this.add.sprite(35, this.upgradeRectangleY+180, "highestWave").setScale(1);
        this.goGroup.add(this.highestWave);
this.highestWaveText = new FancyText(this, 75, this.upgradeRectangleY+183, false, "1", "30px", "white", "black");
this.goGroup.add(this.highestWaveText);

        this.houseUpgradeText = new FancyText(this, this.upgradeSlots1X, this.textY, true, "Buy House [LVL 1]" + (player.houseLevel +1), "30px", "white", "black");
        this.goGroup.add(this.houseUpgradeText);
        this.leafCost = this.add.sprite(this.upgradeSlots1X+120, this.upgradeSlotsY+115, "leaf").setScale(1.5);
        this.goGroup.add(this.leafCost);
        this.leafCostText = new FancyText(this, this.upgradeSlots1X+140, this.upgradeSlotsY+115 - 17, false, this.houseLevel1Price, "30px", "white", "black");
        this.goGroup.add(this.leafCostText);
        this.houseLevelUpPlot = this.add.sprite(this.upgradeSlots1X, this.upgradeSlotsY, "plot").setScale(6);
        this.goGroup.add(this.houseLevelUpPlot);
        this.houseLevelUp = this.add.sprite(this.upgradeSlots1X, this.upgradeSlotsY+10, "thELevel1");
        this.goGroup.add(this.houseLevelUp);
        this.houseLevelButton = new Button(this, this.upgradeSlots1X, this.upgradeSlotsY+120, "upgradeButton", 3, "down", ()=>{
            if(player.houseLevel == 0){
                if(player.cash >= this.houseLevel1Price){
                    player.houseLevel += 1;
                    player.cash -= this.houseLevel1Price;
                }
            } else if(player.houseLevel == 1){
                if(player.cash >= this.houseLevel2Price){
                    player.houseLevel += 1;
                    player.cash -= this.houseLevel2Price;
                }
            } else if(player.houseLevel == 2){
                if(player.cash >= this.houseLevel3Price){
                    player.houseLevel += 1;
                    player.cash -= this.houseLevel3Price;
                }
            } else if(player.houseLevel == 3){
                if(player.cash >= this.houseLevel4Price){
                    player.houseLevel += 1;
                    player.cash -= this.houseLevel4Price;
                }
            } 
            updateData();
            
        });
    }

 update(){
        if (this.goGroupAlpha < 1) {
            this.goGroupAlpha += 0.03;
            this.goGroup.setAlpha(this.goGroupAlpha);
        } else {
            this.goGroupAlpha = 1;
            this.goGroup.setAlpha(1);
        }
        this.gobox.tilePositionX += 0.5;
        this.leafAmountText.text = player.cash;
        if(player.houseLevel <= 3){
            this.houseLevelButton.setAlpha(1);
            this.houseUpgradeText.text = "Buy House [LVL " + (player.houseLevel +1) + "]";
            if(player.houseLevel == 0){
                this.leafCostText.text = this.houseLevel1Price;
            } else if(player.houseLevel == 1){
                this.leafCostText.text = this.houseLevel2Price;
            } else if(player.houseLevel == 2){
                this.leafCostText.text = this.houseLevel3Price;
            } else if(player.houseLevel == 3){
                this.leafCostText.text = this.houseLevel4Price;
            } 
        } else {
            this.houseUpgradeText.setAlpha(0);
            this.houseLevelButton.setAlpha(0);
            this.leafCostText.setAlpha(0);
            this.leafCost.setAlpha(0);
        }
        
        this.houseLevelUp.setTexture("thELevel" + (player.houseLevel + 1));
        this.playerHouseText.text = "[LVL " + (player.houseLevel) + "]";
        this.playerHouse.setTexture("thELevel" + (player.houseLevel));
        

        if(player.highestWave == 1 || player.highestWave == 2 || player.highestWave == 3 || player.highestWave == 4){
            this.highestWaveText.text = player.highestWave + " | Start 1";
        } else {
            this.highestWaveText.text = player.highestWave + " | Start " + Math.round(player.highestWave*2/3 + 1);
        }

        if(this.setUsername && player.uid == ""){
            this.playerUsername.text = "";
            this.setUsername = false;
        }
        if(!this.setUsername && player.uid !== "" && this.timeLogIn == 0){
            this.setUsername = true;
            this.timeLogIn += 1;
            this.playerUsername.text = player.username + "'s Quest For A";
            this.playerUsername.x -= this.playerUsername.width/2;
            this.playerUsername.y -= this.playerUsername.height/2;
        } else if(!this.setUsername && player.uid !== "") {
            this.setUsername = true;
            this.timeLogIn += 1;
            this.playerUsername.text = player.username + "'s Quest For A";
        }
    }
}