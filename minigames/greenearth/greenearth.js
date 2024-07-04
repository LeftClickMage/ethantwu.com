class greenearth extends Phaser.Scene{
    constructor(){
        super("startGame");
    }
    create(){
        startGame();
        if(player.highestWave == 1 || player.highestWave == 2 || player.highestWave == 3 || player.highestWave == 4){
            this.waveNumber = 0;
            this.startingWave = 0;
        } else {
            this.waveNumber = Math.round(player.highestWave*2/3);
            this.startingWave = Math.round(player.highestWave*2/3);
        }
        
        this.townHallHealth = 5;
        this.treeHealth = 4;
        this.treePrice = 40;
        this.solarPanelEnergyOutput = 2;

        this.energyValue = 100;
        this.targetAcquired = false;
        this.canMoveDown = true;
        this.canMoveRight = true;
        this.canMoveLeft = true;
        this.canMoveUp = true;
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, false);
        this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, false);
        this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, false);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, false);
        this.keyshiftLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT, false);
        this.keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P, false);
        this.keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O, false);
        

        this.leftBorder = this.add.tileSprite(0, 1500, 200, 1000, "treeBorder").setScale(3);
        this.RightBorder = this.add.tileSprite(3000, 1500, 200, 1000, "treeBorder").setScale(3);
        this.TopBorder = this.add.tileSprite(1500, 0, 1200, 200, "treeBorder").setScale(3);
        this.TopBorder = this.add.tileSprite(1500, 3000, 1200, 200, "treeBorder").setScale(3);
        this.background = this.add.tileSprite(0, 0, 1000, 1000, "background").setScale(3);
        this.background.setOrigin(0, 0);


        this.plots = this.physics.add.group(); 

        this.plots.add(new Plot(1365, 1800, this)); 
        this.plots.add(new Plot(1500, 1800, this)); 
        this.plots.add(new Plot(1635, 1800, this)); 
        this.plots.add(new Plot(1365, 1935, this)); 
        this.plots.add(new Plot(1500, 1935, this)); 
        this.plots.add(new Plot(1635, 1935, this)); 
        this.plots.add(new Plot(1365, 2070, this)); 
        this.plots.add(new Plot(1500, 2070, this)); 
        this.plots.add(new Plot(1635, 2070, this)); 
        this.plots.add(new Plot(1365, 2205, this)); 
        this.plots.add(new Plot(1500, 2205, this)); 
        this.plots.add(new Plot(1635, 2205, this)); 

        this.plots.add(new Plot(1800, 1365, this)); 
        this.plots.add(new Plot(1800, 1500, this)); 
        this.plots.add(new Plot(1800, 1635, this)); 
        this.plots.add(new Plot(1935, 1365, this)); 
        this.plots.add(new Plot(1935, 1500, this)); 
        this.plots.add(new Plot(1935, 1635, this)); 

        this.plots.add(new Plot(1365, 1200, this)); 
        this.plots.add(new Plot(1500, 1200, this)); 
        this.plots.add(new Plot(1635, 1200, this)); 
        this.plots.add(new Plot(1365, 1065, this)); 
        this.plots.add(new Plot(1500, 1065, this)); 
        this.plots.add(new Plot(1635, 1065, this)); 

        this.plots.add(new Plot(1200, 1365, this)); 
        this.plots.add(new Plot(1200, 1500, this)); 
        this.plots.add(new Plot(1200, 1635, this)); 
        this.plots.add(new Plot(1065, 1365, this)); 
        this.plots.add(new Plot(1065, 1500, this)); 
        this.plots.add(new Plot(1065, 1635, this)); 

        this.plots.add(new Plot(1800, 1800, this)); 
        this.plots.add(new Plot(1200, 1200, this)); 
        this.plots.add(new Plot(1800, 1200, this)); 
        this.plots.add(new Plot(1200, 1800, this)); 

        this.plots.setAlpha(0);



        this.townHallX = 1500;
        this.townHallY = 1500;
        

        
        this.backObjects = this.physics.add.group();
        

        this.backBuildings = this.physics.add.group();

        // var testHouse = this.physics.add.sprite(200, 300, "house").setScale(6);
        // this.backBuildings.add(testHouse);
        // testHouse.body.setSize(32, 8, true);
        // testHouse.body.setOffset(0, 17);
        // testHouse.setImmovable(true);

        this.townHall = this.physics.add.sprite(this.townHallX, this.townHallY, "thELevel" + player.houseLevel).setScale(3);
        this.backBuildings.add(this.townHall);
        this.townHall.body.setSize(125, 97, true);
        this.townHall.body.setOffset(17.5, 32.5);
        this.townHall.setImmovable(true);


        this.player = this.physics.add.sprite(1500, 1700, "player").setScale(4);
        this.player.play("idle");   
        this.player.setDepth(1);
        

        this.frontObjects = this.physics.add.group();
        this.enemySpawn = this.physics.add.sprite(1500,2500, "factoryIdle").setScale(5);
        this.enemySpawn.setImmovable();
        this.enemySpawn.play("factoryIdle");
        
        this.frontBuildings = this.physics.add.group();
        
        
        // testHouse = this.physics.add.sprite(200, 300, "house").setScale(6);
        // this.frontBuildings.add(testHouse);
        // testHouse.body.setSize(32, 8, true);
        // testHouse.body.setOffset(0, 17);
        // testHouse.setImmovable(true);

        this.townHall1 = this.physics.add.sprite(this.townHallX, this.townHallY, "thELevel" + player.houseLevel).setScale(3);
        this.frontBuildings.add(this.townHall1);
        this.townHall1.body.setSize(125, 97, true);
        this.townHall1.body.setOffset(17.5, 32.5);
        this.townHall1.setImmovable(true);
        this.physics.add.collider(this.player, this.backBuildings);
        this.physics.add.collider(this.player, this.frontBuildings);
        this.physics.add.collider(this.player, this.backObjects);
        this.physics.add.collider(this.player, this.frontObjects);
        this.physics.add.collider(this.player, this.enemySpawn);

        this.cameras.main.setBounds(-175, -175, 3350, 3350);
        this.cameras.main.startFollow(this.player);     
          

        this.minimap = this.cameras.add(config.width-210, 10, 200, 200).setZoom(0.08).setName("minimap");
        this.minimap.scrollY = 250;
        this.minimap.scrollX = Phaser.Math.Clamp(this.player.x-100, 800, 2000);
        this.minimap.setBackgroundColor("#FEDCBA");
        this.minimap.startFollow(this.player);
        

        this.scene.launch("minimapBorder");
        this.minimapBorderScene = this.scene.get("minimapBorder");
        this.scene.launch("hotbar");
        this.hotbarScene = this.scene.get("hotbar");
        this.scene.launch("resources");
        this.resources = this.scene.get("resources");
        
        this.scene.launch("health");
        this.healthScene = this.scene.get("health");
        this.scene.launch("waveTimer");
        this.waveTimerScene = this.scene.get("waveTimer");
        // updateData();

        this.enemies = this.physics.add.group();
        this.physics.add.overlap(this.enemies, this.frontBuildings, this.dealDamage, null, this);
        this.physics.add.overlap(this.enemies, this.backBuildings, this.dealDamage, null, this);
        this.physics.add.overlap(this.enemies, this.backObjects, this.dealObjDamage, null, this);
        
        
    }
    checkIfEnemiesAlive(){
        if(this.enemies.getChildren().length == 0){
            return false;
        }
        return true;
    }
    startWave(){
        this.waveTimerScene.finishedSpawning = false;
        
        this.hotbarScene.startWaveButton.setAlpha(0);
        this.hotbarScene.startWaveButton.setInteractive(false);
        this.waveTimerScene.inProgress = true;
        
        this.wave();
            

        this.waveTimerScene.haventStarted = true;
        this.waveTimerScene.timeLeft = 25;
        this.waveTimerScene.finishedSpawning = true;
        
    }
    async wave(){
        this.enemySpawn.play("factoryActive");
        if(this.waveNumber == 1){
            var amount = 10;
          for(let i = 0; i < amount; i++){
            var enemy = this.physics.add.sprite(this.enemySpawn.x, this.enemySpawn.y, "CO2WalkDown").setScale(3);
            this.enemies.add(enemy);
         await downtime(1000);
            }
            this.enemySpawn.play("factoryIdle");
        } else {
            var amount = Math.round(15*this.waveNumber/2);
            for(let i = 0; i < amount; i++){
            var enemy = this.physics.add.sprite(this.enemySpawn.x, this.enemySpawn.y, "CO2WalkDown").setScale(3);
            this.enemies.add(enemy);
         await downtime(1000);
        }
        this.enemySpawn.play("factoryIdle");
        }
        
    }
    spawnRandomEnemies(amount) {
        for(let i = 0; i < amount; i+=1){
            var randNum1 = Math.floor(Math.random()* (3000-2000 + 1) + 1000);
            var randNum2 = Math.floor(Math.random()* (3000-2000 + 1) + 1000);
            var neg1;
            var neg2;
            var randTemp = Math.random();
            if(randTemp > 0.75){
                neg1 = -1;
                neg2 = -1;
            }else if(randTemp > 0.5){
                neg1 = -1;
                neg2 = 1;
            }else if(randTemp > 0.25){
                neg1 = 1;
                neg2 = -1;
            }else if(randTemp > 0){
                neg1 = 1;
                neg2 = 1;
            }
            // alert(randNum1 * neg1);
            // alert(randNum2 * neg2);
            var enemy = this.physics.add.sprite(randNum1 * neg1, randNum2*neg2, "CO2WalkDown").setScale(3);
            this.enemies.add(enemy);
        }
    }
    dealObjDamage(enemy, object){
        this.explosion = this.add.sprite(enemy.x, enemy.y, "explosionBaba").setScale(4);
        this.explosion.play("explosionBaba");
        enemy.destroy();
        object.health -= 1;
    }
    dealDamage(enemy, building){
        this.explosion = this.add.sprite(enemy.x, enemy.y, "explosionBaba").setScale(4);
        this.explosion.play("explosionBaba");
        enemy.destroy();
        this.townHallHealth-=1;
    }
    showUnoccupiedPlots(){
        this.plots.getChildren().forEach(function(plot){
            if(!plot.occupied){
            plot.alpha = 0.7;
        } 
        }, this);
    }
    createObject(object){
        this.showUnoccupiedPlots();
        this.hotbarScene.cancelPopup.setAlpha(1);
        this.target = new ObjectCreator(this, object); 
        this.targetAcquired = true;
        this.input.on("pointerdown", this.putDownObj, this);
        // testing.body.setImmovable(true);
        
    }
moveObj(){
        
        this.target.x = game.input.mousePointer.x + this.player.x - config.width/2;
        this.target.y = game.input.mousePointer.y + this.player.y - config.height/2;
    }
    putDownObj(pointer, targets){
        this.plots.setAlpha(0);
        this.hotbarScene.cancelPopup.setAlpha(0);
        this.target.destroy();
        this.input.off("pointerdown", this.putDownObj, this);
        this.targetAcquired = false;
        this.hotbarScene.canPlaceOBJ = true;
        var placeSlot = targets[0];
        var targetName = placeSlot.texture.key;
        // alert(targetName); //keep here for debug
        if(targetName == "plot"){
            if (placeSlot.occupied) {
                // alert("occupied"); //keep here for debug
            } else {
                var scale = 1;
                var sizeScaleY = 1;
                var sizeScaleX = 1;
                var offsetY = 0;
                var play = "";
                var health = 0;
                if(this.target.texture.key == "solarPanel"){
                    scale = 2;
                    this.energyValue -= 50;
                    sizeScaleY = 3.0;
                    sizeScaleX = 2;
                    offsetY = this.target.height/2 - this.target.height/sizeScaleY/2;
                    health = 1;
                } else if(this.target.texture.key == "tree"){
                    scale = 1;
                    this.energyValue -= this.treePrice;
                    sizeScaleX = 4;
                    sizeScaleY = 100;
                    offsetY = 23;
                    play = "tree";
                    health = this.treeHealth;
                } 
                this.targetClone = this.physics.add.sprite(placeSlot.x, placeSlot.y, this.target.texture.key).setScale(3/scale);
                this.backObjects.add(this.targetClone);
                this.targetClone.setSize(this.targetClone.width/sizeScaleX, this.targetClone.height/sizeScaleY, true);
                this.targetClone.setOffset(this.targetClone.width/2 - this.targetClone.width/sizeScaleX/2, offsetY);
                this.targetClone.play(play);
                this.targetClone.health = health;
                this.targetClone.setImmovable(true);
        
                this.targetClone2 = this.physics.add.sprite(placeSlot.x, placeSlot.y, this.target.texture.key).setScale(3/scale);
                this.frontObjects.add(this.targetClone2);
                this.targetClone2.setSize(this.targetClone2.width/sizeScaleX, this.targetClone2.height/sizeScaleY, true);
                this.targetClone2.setOffset(this.targetClone.width/2 - this.targetClone.width/sizeScaleX/2, offsetY);
                this.targetClone2.play(play);
                this.targetClone2.health = health;
                this.targetClone2.setImmovable(true);
                placeSlot.occupiedWith = this.target.texture.key;
                placeSlot.occupied = true;
            }
        }
    
    }
    
    calcCash(wave){
        var amount = 0;
        for(let i = this.startingWave+1; i <= wave; i++){
            amount += i * 20;
        }
        player.cash += amount;
        updateData();
    }

    gameOver(){
        this.waveTimerScene.gameEnded = true;
        this.waveTimerScene.timeLeft = -1;
        this.hotbarScene.scene.stop();
        this.healthScene.scene.stop();
        this.minimapBorderScene.scene.stop();
        this.waveTimerScene.scene.stop();
        this.resources.scene.stop();
        this.scene.start("gameOverScreen");
    }
    toTitleScreen(){
        this.waveTimerScene.gameEnded = true;
        this.waveTimerScene.timeLeft = -1;
        this.calcCash(this.waveNumber-1);
        this.hotbarScene.scene.stop();
        this.healthScene.scene.stop();
        this.minimapBorderScene.scene.stop();
        this.waveTimerScene.scene.stop();
        this.resources.scene.stop();
        this.scene.start("titleScreen");
    }
    
    
    playerMovement(){
        this.player.setVelocity(0);
        var moveLeft = false;
        var moveRight = false;
        var moveUp = false;
        var moveDown = false;

        //controller
        if(this.input.gamepad.total !== 0){
            this.pad = this.input.gamepad.getPad(0);
            if (this.pad.axes.length){
                var axisH = Math.round(this.pad.axes[0].getValue());
                var axisV = Math.round(this.pad.axes[1].getValue());
                if(axisH == -1){
                    moveLeft = true;
                } else if (axisH == 1) {
                    moveRight = true;
                }
               if(axisV == -1){
                    moveUp =true;
            } else if(axisV == 1){
                    moveDown =true;
            }
            }
        }

        //Keyboard
        if(this.keyA.isDown && this.canMoveLeft){
            moveLeft = true;
        } else if (this.keyD.isDown && this.canMoveRight){
            moveRight = true;
        }
        if(this.keyW.isDown && this.canMoveUp){
            moveUp = true;
        } else if(this.keyS.isDown && this.canMoveDown){
            moveDown = true;
        } 
            
        //general movement

            if(moveLeft){
                this.player.setVelocityX(-player.speed);
            } else if(moveRight){
                this.player.setVelocityX(player.speed);
            } 
            if(moveUp){
                this.player.setVelocityY(-player.speed);
            } else if(moveDown){
                this.player.setVelocityY(player.speed);
            } 

        if(this.player.x < 0){
            this.canMoveLeft = false;
            this.player.x+=1;
        } else {
            this.canMoveLeft = true;
        }

        if(this.player.x > 3000){
            this.canMoveRight = false;
            this.player.x-=1;
        } else {
            this.canMoveRight = true;
        }

        if(this.player.y < 0){
            this.canMoveUp = false;
            this.player.y+=1;
        } else {
            this.canMoveUp = true;
        }
        if(this.player.y > 3000){
            this.canMoveDown = false;
            this.player.y-=1;
        } else {
            this.canMoveDown = true;
        }
        this.player.body.velocity.normalize().scale(player.speed);
        if(moveLeft){
            this.player.play("walkLeft", true);
        } else if (moveRight){
            this.player.play("walkRight", true);
        } else if (moveUp){
            this.player.play("walkUp", true);
        } else if (moveDown){
            this.player.play("walkDown", true);
        } else {
            this.player.play("idle", true);
        }
        // if(this.keyshiftLeft.isDown && this.keyP.isDown) {
        //     player.speed = 600;
        //     alert("Dev Speed On");
        // } else if(this.keyshiftLeft.isDown && this.keyO.isDown) {
        //     player.speed = 120;
        //     alert("Dev Speed Off");
        // } 
    }
    updateBuildingIndex(){
        this.backBuildings.getChildren().forEach(function(house){
            if(house.y>this.player.y){
            house.visible = false;
        } else if (house.y <= this.player.y){
            house.visible = true;
        }
        }, this);
        this.frontBuildings.getChildren().forEach(function(house){
            if(house.y+50>this.player.y){
            house.visible = true;
        } else if (house.y <= this.player.y){
            house.visible = false;
        }
        }, this);

        this.backObjects.getChildren().forEach(function(object){
            if(object.y>this.player.y){
            object.visible = false;
        } else if (object.y <= this.player.y){
            object.visible = true;
        }
        }, this);
        this.frontObjects.getChildren().forEach(function(object){
            if(object.y>this.player.y){
            object.visible = true;
        } else if (object.y <= this.player.y){
            object.visible = false;
        }
        }, this);
    }


    updateEnergy(){
        this.plots.getChildren().forEach(function(plot){
            if(plot.occupiedWith == "solarPanel"){
                this.energyValue += this.solarPanelEnergyOutput/60;
            }
        }, this);
        if(this.townHall.texture.key == "thELevel1"){
            this.energyValue += 1/60;
        }
        if(this.townHall.texture.key == "thELevel2"){
            this.energyValue += 2/60;
        }
        if(this.townHall.texture.key == "thELevel3"){
            this.energyValue += 3/60;
        }
        if(this.townHall.texture.key == "thELevel4"){
            this.energyValue += 4/60;
        }
        
    }


    findNearestObject(enemyObj){
        var prevDistance = Math.sqrt(Math.pow(this.townHallX - enemyObj.x, 2) + Math.pow(this.townHallY - enemyObj.y, 2));
        this.nearestObj = this.townHall;
        this.backObjects.getChildren().forEach(function(object){
            if(Math.sqrt(Math.pow(object.x - enemyObj.x, 2) + Math.pow(object.y - enemyObj.y, 2)) <= prevDistance){
                prevDistance = Math.sqrt(Math.pow(object.x - enemyObj.x, 2) + Math.pow(object.y - enemyObj.y, 2));
                this.nearestObj = object;
            }
            
        }, this);
    }

    
    enemyMovement(object){
        this.findNearestObject(object);
        this.enemy = object;
        this.enemy.setVelocity(0);
        if(Math.abs(this.nearestObj.x - this.enemy.x)< 4){
            this.enemy.x = this.nearestObj.x;
        }
        if(Math.abs(this.nearestObj.y - this.enemy.y)< 4){
            this.enemy.y = this.nearestObj.y;
        }

        if(this.nearestObj.x < this.enemy.x){
                this.enemy.setVelocityX(-enemy.speed);
            } else if(this.nearestObj.x > this.enemy.x){
                this.enemy.setVelocityX(enemy.speed);
            } else {
                this.enemy.setVelocityX(0);
            }
            if(this.nearestObj.y < this.enemy.y){
                this.enemy.setVelocityY(-enemy.speed);
            } else if(this.nearestObj.y > this.enemy.y){
                this.enemy.setVelocityY(enemy.speed);
            } else {
                this.enemy.setVelocityY(0);
            }
        
        this.enemy.body.velocity.normalize().scale(enemy.speed);
        if(this.nearestObj.x < this.enemy.x){
            this.enemy.play("CO2WalkLeft", true);
        } else if (this.nearestObj.x > this.enemy.x){
            this.enemy.play("CO2WalkRight", true);
        } else if (this.nearestObj.y < this.enemy.y){
            this.enemy.play("CO2WalkUp", true);
        } else if (this.nearestObj.y > this.enemy.y){
            this.enemy.play("CO2WalkDown", true);
        }  else {
            this.enemy.play("CO2WalkDown", true);
        }
    }
    updateObjectHealth(){
            for(let i = 0; i < this.backObjects.getChildren().length; i+=1){
                var object = this.backObjects.getChildren()[i];
                if(object.health <= 0 ){
                    this.plots.getChildren().forEach(function(plot){
                        if(plot.x == object.x && plot.y == object.y){
                            plot.occupied = false;
                            plot.occupiedWith = "";
                        }
                    }, this);
                    if(this.targetAcquired){
                    this.showUnoccupiedPlots();
                    }
                    object.destroy();
                    this.frontObjects.getChildren()[i].destroy();
                }
            }
    }
    
    update(){
        this.playerMovement();
        this.enemies.getChildren().forEach(function(enemy){
            this.enemyMovement(enemy);
        }, this);
        this.updateBuildingIndex();
        this.updateEnergy();
        this.updateObjectHealth();
        if(this.targetAcquired){
            this.moveObj();
        }
        this.backObjects.setDepth(0);
        this.backBuildings.setDepth(1);
        this.enemies.setDepth(2);
        this.player.setDepth(3);
        this.frontObjects.setDepth(4);
        this.frontBuildings.setDepth(5);
        this.enemySpawn.setDepth(6);

    
      }
}


