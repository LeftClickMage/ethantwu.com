class greenearth extends Phaser.Scene{
    constructor(){
        super("startGame");
    }

    create(){
        // alert("created");
    
        startGame();
        
 if(player.highestWave == 0){

            this.waveNumber = 0;
            this.startingWave = 0;
 } else if(player.highestWave < 5){
            this.waveNumber = 1;
            this.startingWave = 1;
        } else if(player.highestWave < 10){
            this.waveNumber = 5;
            this.startingWave = 5;
        }  else if(player.highestWave < 15){
            this.waveNumber = 10;
            this.startingWave = 10;
        }  else if(player.highestWave < 20){
            this.waveNumber = 15;
            this.startingWave = 15;
        } else {
            this.waveNumber = Math.round(20 + (player.highestWave-20)/3*2-1);
            this.startingWave = Math.round(20 + (player.highestWave-20)/3*2-1);
        }
        this.errorRequest = "ERROR: ";
        this.mageBootstrap = this.add.group();
        this.creativeMode = false;
        this.prevPlayerSpeed = 0;
        this.victoryScreenActive = false;
        this.maxEnergyStorage = 250;
        this.townHallHealth = 5;
        this.treeHealth = 5;
        this.treePrice = 40;
        this.solarPanelEnergyOutput = 3;
        this.slotID = 0;
        this.movingTutorial = true;
        this.algaeTowerHealth = 3;
        this.algaeTowerPrice = 450;
        this.algaeTowerSpawnRate = 1.5;
        this.slowTowerPrice = 300;
        this.slowTowerRate = 3;
        this.slowTowerHealth = 3;
        this.slowTowerRadius = 350;
        this.forestHealth = 20;
        this.forestPrice = 700;
        this.forestSpawnRate = 0.5;
        this.medbayRate = 0.35;
        this.medbayHealth = 3;
        this.medbayPrice = 250;
        this.removeTowerPrice = 200;

        this.windmillPrice = 300;
        this.windmillEnergyOutput = 15;

        this.batteryPackPrice = 200;
        this.batteryPackStorage = 250;
        //staring wave is 1 less than next wave.(like if you start on wave 9, you actually start on wave 8 and the next wave is 9)
        //switch to case maybe
        if(this.startingWave > 15){
            this.energyValue = 350*(this.startingWave+1);
        } else if(this.startingWave > 13){
            this.energyValue = 300*(this.startingWave+1);
        } else if(this.startingWave > 11){
            this.energyValue = 250*(this.startingWave+1);
        } else if(this.startingWave > 9){
            this.energyValue = 200*(this.startingWave+1); 
        }  else if(this.startingWave > 7){
            this.energyValue = 175*(this.startingWave+1);
        }  else if(this.startingWave > 5){
            this.energyValue = 150*(this.startingWave+1);
        } else if(this.startingWave == 0){
            this.energyValue = 110*(this.startingWave+1);
        } else {
            this.energyValue = 80*(this.startingWave+1);
        }
        if(this.energyValue > this.maxEnergyStorage){
            this.overflow = true;
        }
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

        // alert('1');
        this.plots = this.physics.add.group(); 

        this.plots.add(new Plot(1365, 1800, this)); 
        this.plots.add(new Plot(1500, 1800, this)); 
        this.plots.add(new Plot(1635, 1800, this)); 
        this.plots.add(new Plot(1365, 1935, this)); 
        this.plots.add(new Plot(1500, 1935, this)); 
        this.plots.add(new Plot(1635, 1935, this)); 
        // this.plots.add(new Plot(1365, 2070, this)); 
        // this.plots.add(new Plot(1500, 2070, this)); 
        // this.plots.add(new Plot(1635, 2070, this)); 
        // this.plots.add(new Plot(1365, 2205, this)); 
        // this.plots.add(new Plot(1500, 2205, this)); 
        // this.plots.add(new Plot(1635, 2205, this)); 

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
        // alert('2');

        this.player = this.physics.add.sprite(1500, 1700, "player").setScale(4);
        this.player.play("idle");   
        this.player.setDepth(1);
        

        this.frontObjects = this.physics.add.group();

        this.bossObjects = this.physics.add.group();        
        
        
        this.enemySpawns = this.physics.add.group();

        this.createEnemySpawn(1500, 2500);
        // this.createEnemySpawn(500, 1500);
        

        
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
        this.physics.add.collider(this.player, this.enemySpawns);
        this.physics.add.collider(this.player, this.bossObjects);
        this.healthBars = this.add.group();
        this.healthBarsBack = this.add.group();

        this.cameras.main.setBounds(-175, -175, 3350, 3350);
        // alert("3");

        this.minimap = this.cameras.add(config.width-210, 10, 200, 200).setZoom(0.08).setName("minimap");
        this.minimap.scrollY = 250;
        this.minimap.scrollX = Phaser.Math.Clamp(this.player.x-100, 800, 2000);
        this.minimap.setBackgroundColor("#FEDCBA");
        this.minimap.startFollow(this.player);
        // this.mageBootstrap.add(this.minimap);
        // this.minimap.idRequirements = "stickToRight";
        

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
        this.oxygen = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.physics.add.overlap(this.oxygen, this.enemySpawns, this.destroy, null, this);
        this.physics.add.overlap(this.enemies, this.frontBuildings, this.dealDamage, null, this);
        this.physics.add.overlap(this.enemies, this.backBuildings, this.dealDamage, null, this);
        this.physics.add.overlap(this.bossObjects, this.frontBuildings, this.destroyTH, null, this);
        this.physics.add.overlap(this.bossObjects, this.backBuildings, this.destroyTH, null, this);
        this.physics.add.overlap(this.enemies, this.backObjects, this.dealObjDamage, null, this);

        this.physics.add.overlap(this.backObjects, this.bossObjects, this.dealObjDamage, null, this);

        this.physics.add.overlap(this.enemies, this.oxygen, this.dealOxygenDamage, null, this);
    
        this.physics.add.overlap(this.oxygen, this.bossObjects, this.oxygenBossCollider, null, this);
        // alert("4");
        if(player.highestWave == 0){
            
            this.scene.launch("tutorial");
            this.tutorialScene = this.scene.get("tutorial");
            this.startTutorial();
        } else {
            this.lockCamOn(this.player);
            this.movingTutorial = false;
        }

        this.nameText = new FancyText(this, 200, 200, true, "username", "20px", "white", "black");

        // this.anotherSp
        // alert('5');
    } 

destroyTH(boss, building){
        this.townHallHealth=0;
    }


    lockCamOn(object){
        this.cameras.main.startFollow(object);
    }
  startTutorial(){
     
        this.cameras.main.pan(1500, 1520, 1000);
        this.tutorialScene.createBox(0, config.height-200, "Welcome " + player.username + "! You are tasked with protecting this house from dangerous Greenhouse Gases.", "enemySpawn");


        



    
    }

    tutorialHotbar(){
        this.tutorialScene.destroyBox();
        this.cameras.main.pan(1500, 1700, 1000);
        this.tutorialScene.createBox(0, config.height-310, "What you see below is your hotbar. You can hover over the towers for a brief explanation!", "placeSolarPanel");
    }

    anotherSpawner(x, y){
        // this.tutorialScene.destroyBox();
        this.scene.launch("tutorial");
        this.tutorialScene = this.scene.get("tutorial");    
        this.cameras.main.pan(x, y, 1000);
        this.lockCamOn(this.enemySpawns.getChildren()[this.enemySpawns.getChildren().length-1]);
        this.tutorialScene.createBox(0, config.height-200, "Uh Oh! There seems to be another spawner!!", "closeTutorial");
    }

    async tutorialPlaceSolarPanel(){
        this.tutorialScene.destroyBox();
        this.cameras.main.pan(1500, 1700, 1000);
        this.hotbarScene.tutorialActiveSP = false;
        this.secondSpawnCreated = false;
        this.tutorialScene.createBox(0, config.height-390, "Go ahead and place a solar panel on one of the side plots.", "none");
        var value = 0;
        while(value == 0){
            this.plots.getChildren().forEach(function(plot){
                if(plot.occupiedWith == "solarPanel"){
                    value = 1;
                    this.tutorialSPGJ();
                }
            }, this);
            await downtime(100);
        }
    }

    
    async tutorialSPGJ(){
        this.tutorialScene.destroyBox();
        // this.cameras.main.pan(1500, 1700, 1000);
        this.hotbarScene.tutorialActiveTree = false;
        this.hotbarScene.tutorialActiveSP = true;
        this.tutorialScene.createBox(0, 70, "Good Job! Now you can see your energy increasing. Use this energy to place down 2 Trees in front of the house!", "none");
        var value = 0;
        while(value < 2){
            value = 0;
            this.plots.getChildren().forEach(function(plot){
                if(plot.occupiedWith == "tree"){
                    value += 1;
                }
            }, this);
            await downtime(100);
        }
        this.tutorialMove();
        
    }
    tutorialMove(){
        this.movingTutorial = false;

                this.hotbarScene.tutorialActiveTree = true;
        this.energyValue = 0;
            this.lockCamOn(this.player);
        this.tutorialScene.destroyBox();
        this.tutorialScene.createBox(0, config.height-310, "You can also move using the w, a, s, and d keys, and sprint by pressing shift!", "startWave");
    }
    tutorialStartWave(){
        this.tutorialScene.destroyBox();
        // this.cameras.main.pan(1500, 1700, 1000);
        // this.hotbarScene.tutorialActiveTree = false;
        this.tutorialScene.createBox(0, config.height-200, "That's it! Press the Start Wave Button! Good luck " + player.username + " and farewell!", "none");
        this.hotbarScene.startWaveButton.alpha = 1;
        
    }

    tutorialMap(){
        this.cameras.main.setZoom(0.45);
    }

     tutorialEnemySpawn(){
        this.tutorialScene.destroyBox();
this.cameras.main.pan(1500, 2500, 1000);
this.tutorialScene.createBox(0, config.height-200, "Greenhouse Gases will appear from the CO2 factory!", "hotbar");
        // this.cameras.main.startFollow(this.player);

    }

   




    destroy(oxygen, spawn){
        oxygen.destroy();
    }
    checkIfEnemiesAlive(){
        if(this.enemies.getChildren().length == 0){
            return false;
        }
        return true;
    }
    startWave(){
        try{
        this.waveTimerScene.finishedSpawning = false;
        this.hotbarScene.startWaveButton.setAlpha(0);
        this.hotbarScene.minusWaveButton.setAlpha(0);
        this.hotbarScene.plusWaveButton.setAlpha(0);
        this.enemiesAlive = true;
        this.wave();
            

        this.waveTimerScene.haventStarted = true;
        this.waveTimerScene.timeLeft = 25;
        } catch (error) {
            alert(error);
        }
        
        
    }

    async spawnAlgaeTowerOxygen(){
        while(true){
            if(this.enemiesAlive){
                this.backObjects.getChildren().forEach(function(tower){
                    var randomX = Math.random()*60-30;
                    var randomY = Math.random()*60-30;

                    if(tower.texture.key == "algaeTower"){
                        var oxygen = this.physics.add.sprite(tower.x + randomX, tower.y + randomY, "O2WalkDown").setScale(2.5);
                        oxygen.setSize(10, 10);
                        oxygen.setOffset(5, 5);
                        this.oxygen.add(oxygen);

                    }
                }, this);
            } else {
                return;
            }
            await downtime(1000/this.algaeTowerSpawnRate);
        }
    }

    async spawnForestOxygen(){
        while(true){
            if(this.enemiesAlive){
                this.backObjects.getChildren().forEach(function(tower){
                    var randomX = Math.random()*60-30;
                    var randomY = Math.random()*60-30;

                    if(tower.texture.key == "forest"){
                        var oxygen = this.physics.add.sprite(tower.x + randomX, tower.y + randomY, "O2WalkDown").setScale(2.5);
                        oxygen.setSize(10, 10);
                        oxygen.setOffset(5, 5);
                        this.oxygen.add(oxygen);

                    }
                }, this);
            } else {
                return;
            }
            await downtime(1000/this.forestSpawnRate);
        }
    }

    startTowerAnims(){
        this.spawnAlgaeTowerOxygen();
        this.spawnForestOxygen();
        this.backObjects.getChildren().forEach(function(tower){
            switch(tower.texture.key){
                case "algaeTowerIdle":
                    tower.play("algaeTower");
                    break;
                case "slowTowerIdle":
                    tower.play("slowTower");
                    break;
            }
        }, this);
        this.frontObjects.getChildren().forEach(function(tower){
            switch(tower.texture.key){
                case "algaeTowerIdle":
                    tower.play("algaeTower");
                    break;
                case "slowTowerIdle":
                    tower.play("slowTower");
                    break;
            }
        }, this);

    }
    playAnimations(){
        this.startTowerAnims();
        this.enemySpawns.getChildren().forEach((spawner)=>{
            spawner.play("factoryActive");
        }, this);
    }
    stopAnimations(){
        
        this.enemySpawns.getChildren().forEach((spawner)=>{
            spawner.play("factoryIdle");
        }, this);
    }
    async wave(){
        // alert(this.waveNumber);
        var amount;
        if(this.waveNumber == 1){

            this.playAnimations();
            this.spawnEnemies(10);
        } else if (this.waveNumber == 10){

            this.startTowerAnims();
            this.truckBoss();
            this.enemyBossSpam();
        } else if (this.waveNumber == 20){
            // alert("stated");
            this.startTowerAnims();
            this.cfcBoss();
            this.enemyBossSpam();
        } else {

            this.playAnimations();
             this.spawnEnemies(Math.round(15*this.waveNumber/2));
        }
         

        
        
    }
    
    truckBoss(){
        
        var truckBoss = this.physics.add.sprite(2750, 1500, "truckBoss").setScale(3);

        this.bossObjects.add(truckBoss);
        truckBoss.body.setSize(96, 50, true);
        truckBoss.body.setOffset(0, 20);
        truckBoss.setImmovable(true);
        truckBoss.play("truckBoss");
        truckBoss.health = 150;



        this.createHealthBar({
            x: truckBoss.x,
            y: truckBoss.y-90,
            width: truckBoss.width*3,
            id: -69,
            health: truckBoss.health,
        });


        this.waveTimerScene.inProgress = true;


    }

    cfcBoss(){
        // alert("test");
        var cfcBoss = this.physics.add.sprite(2750, 1500, "cfcBoss").setScale(15);
        this.bossObjects.add(cfcBoss);
        cfcBoss.body.setSize(32, 32, true);
        // this.cfcBoss.body.setOffset(0, 20);
        cfcBoss.setImmovable(true);
        cfcBoss.play("cfcBoss");
        cfcBoss.health = 350/100;



        this.createHealthBar({
            x: cfcBoss.x,
            y: cfcBoss.y-100,
            width: cfcBoss.width*12,
            id: -420,
            health: cfcBoss.health,
        });


        this.waveTimerScene.inProgress = true;
    }

    async enemyBossSpam(){
        var speed = 0;
        if(this.waveNumber > 15){
            speed = 12000;
        } else {
            speed = 160;
        }
        while(this.bossObjects.getChildren().length > 0){
            this.bossObjects.getChildren().forEach((boss)=>{
                var randNumbX = Math.random()*(-50)-150;
                var randNumbY = (Math.random()-0.5)*250;
                var enemy = this.physics.add.sprite(boss.x + randNumbX, boss.y+randNumbY, "CO2WalkDown").setScale(3);
                this.enemies.add(enemy);
            });
            await downtime(speed);
        }

        this.waveTimerScene.finishedSpawning = true;
        this.stopAnimations();
    }

    async spawnEnemies(amount){
        var spawningDuration;
        if(this.waveNumber >= 10){
            spawningDuration = 20000;
        } else {
            spawningDuration = 15000;
        }
           for(let i = 0; i < amount; i++){
                this.enemySpawns.getChildren().forEach((enemySpawner)=>{
                    var randX = Math.random()*600-300;
                    var randY = Math.random()*600-300;    
                    var enemy = this.physics.add.sprite(enemySpawner.x + randX, enemySpawner.y + randY, "CO2WalkDown").setScale(3);
                    this.enemies.add(enemy);

                    this.waveTimerScene.inProgress = true;
                }, this);

         await downtime(spawningDuration/amount);
        }

        this.waveTimerScene.finishedSpawning = true;
        this.stopAnimations();
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
        this.explosion = this.add.sprite(enemy.x, enemy.y, "explosionBaba").setScale(3).setDepth(99);
        this.explosion.play("explosionBaba");
        
        if(enemy.health){
            object.health -= enemy.health;
            enemy.health = 0;
            this.updateObjectHealth();
        } else {
            object.health -= 1;
            enemy.destroy();
        }

        
    }
    oxygenBossCollider(oxygen, boss){
        boss.health -= 1;

        this.explosion = this.add.sprite(oxygen.x, oxygen.y, "explosionBaba").setScale(3).setDepth(99);
        this.explosion.play("explosionBaba");
        oxygen.destroy();
    }
    dealOxygenDamage(enemy, oxygen){
        this.explosion = this.add.sprite(enemy.x, enemy.y, "explosionBaba").setScale(3).setDepth(99);
        this.explosion.play("explosionBaba");
        enemy.destroy();
        this.explosion = this.add.sprite(oxygen.x, oxygen.y, "explosionBaba").setScale(3).setDepth(99);
        this.explosion.play("explosionBaba");
        oxygen.destroy();
    }
    dealDamage(enemy, building){
        if(this.townHall.texture.key != "blueHouseBroken"){
            enemy.destroy();
            this.townHallHealth-=1;
            this.explosion = this.add.sprite(enemy.x, enemy.y, "explosionBaba").setScale(3).setDepth(99);
            this.explosion.play("explosionBaba");
        }
    }
    showUnoccupiedPlots(){
        this.plots.getChildren().forEach(function(plot){
            if(!plot.occupied){
                plot.alpha = 0.7;
            } else {
                plot.alpha = 0.00000000000000000000000001;
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
        this.target.setDepth(100);
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
                if(this.target.texture.key == "removeTower"){
                    for(let tower of this.backObjects.getChildren()){
                        if(tower.x == placeSlot.x && tower.y == placeSlot.y){
                            tower.health = 0;
                            this.updateObjectHealth();
                            this.energyValue -= this.removeTowerPrice;
                        }
                    }
                }
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
                } else if(this.target.texture.key == "slowTower"){
                    scale = 1;
                    this.energyValue -= this.slowTowerPrice;
                    sizeScaleX = 2;
                    sizeScaleY = 3;
                    offsetY = 7;
                    play = "slowTowerIdle";
                    health = this.slowTowerHealth;
                } else if(this.target.texture.key == "algaeTower"){
                    scale = 1;
                    this.energyValue -= this.algaeTowerPrice;
                    sizeScaleX = 2;
                    sizeScaleY = 100;
                    offsetY = 19;
                    play = "algaeTowerIdle";
                    health = this.algaeTowerHealth;
                } else if(this.target.texture.key == "medbay"){
                    scale = 1;
                    this.energyValue -= this.medbayPrice;
                    sizeScaleX = 2;
                    sizeScaleY = 2;
                    offsetY = 8;
                    play = "medbay";
                    health = this.medbayHealth;
                }  else if(this.target.texture.key == "forest"){
                    scale = 0.85;
                    this.energyValue -= this.forestPrice;
                    sizeScaleX = 10;
                    sizeScaleY = 30;
                    offsetY = 19;
                    play = "forest";
                    health = this.forestHealth;
                } else if(this.target.texture.key == "batteryPack"){
                    scale = 1;
                    this.energyValue -= this.batteryPackPrice;
                    sizeScaleX = 2;
                    sizeScaleY = 100;
                    offsetY = 19;
                    play = "batteryPack";
                    health = 1;
                    this.maxEnergyStorage += this.batteryPackStorage;
                } else if(this.target.texture.key == "windmill"){
                    scale = 3/4;
                    this.energyValue -= this.windmillPrice;
                    sizeScaleX = 2;
                    sizeScaleY = 100;
                    offsetY = 19;
                    play = "windmill";
                    health = 5;
                    // this.maxEnergyStorage += this.batteryPackStorage;
                } 
                if(this.target.texture.key !=="removeTower"){
                    this.slotID += 1;
                    this.targetClone = this.physics.add.sprite(placeSlot.x, placeSlot.y, this.target.texture.key).setScale(3/scale);
                    this.backObjects.add(this.targetClone);
                    this.targetClone.setSize(this.targetClone.width/sizeScaleX, this.targetClone.height/sizeScaleY, true);
                    this.targetClone.setOffset(this.targetClone.width/2 - this.targetClone.width/sizeScaleX/2, offsetY);
                    this.targetClone.play(play);
                    this.targetClone.id = this.slotID;
                    this.targetClone.health = health;
                    this.targetClone.maxHealth = health;
                    this.targetClone.setImmovable(true);
            
                    this.targetClone2 = this.physics.add.sprite(placeSlot.x, placeSlot.y, this.target.texture.key).setScale(3/scale);
                    this.frontObjects.add(this.targetClone2);
                    this.targetClone2.setSize(this.targetClone2.width/sizeScaleX, this.targetClone2.height/sizeScaleY, true);
                    this.targetClone2.setOffset(this.targetClone.width/2 - this.targetClone.width/sizeScaleX/2, offsetY);
                    this.targetClone2.play(play);
                    this.targetClone2.health = health;
                    this.targetClone2.setImmovable(true)
                    this.targetClone2.id = this.slotID;
                    placeSlot.occupiedWith = this.target.texture.key;
                    placeSlot.occupied = true;
                    
                    this.createHealthBar({
                        x: placeSlot.x,
                        y: placeSlot.y,
                        width: 100,
                        id: this.slotID,
                        health: health,
                    });
                } 
            }
        }
    
    }
    
    createHealthBar({x, y, width, id, health}){

        this.healthbarBack = this.add.rectangle(x, y-60, width+4, 10, 0x000000);
        this.healthBarsBack.add(this.healthbarBack);
        this.healthbar = this.add.rectangle(x, y-60, width, 6, 0xff0000);
        this.healthbar.id = id;
        this.healthbar.maxHealth = health;
        this.healthbar.maxWidth = width;
        this.healthBars.add(this.healthbar);
    }

    calcCash(wave){
        var amount = 0;
        if(!this.creativeMode){
            for(let i = this.startingWave+1; i <= wave; i++){
                amount += i * 20;
            }
            player.cash += amount;
            if(playerWithAccount){
                updateData();
            }
        }
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
    victoryPlayAgain(){
        this.waveTimerScene.gameEnded = true;
        this.waveTimerScene.timeLeft = -1;
        this.hotbarScene.scene.stop();
        this.healthScene.scene.stop();
        this.minimapBorderScene.scene.stop();
        this.waveTimerScene.scene.stop();
        this.resources.scene.stop();
        this.scene.get("victoryScreen").scene.stop();
        this.scene.start("titleScreen");
        // this.scene.stop();
        // alert("tesdfsdfst");
    }
    victoryContinue(){
        this.scene.get("victoryScreen").scene.stop();
        
        this.waveTimerScene.timeLeft = 35;
        this.victoryScreenActive = false;
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
    checkSpeedRate(){
        try {
            if(player.speed == 120){
                this.player.anims.timeScale = 1;
            } else if(this.player.anims){
                this.player.anims.timeScale = 1.5;
            }
        } catch (error) {
            alert(error);
        }
    }
    playerMovement(){
        // if(this.prevPlayerSpeed !== player.speed){
            this.checkSpeedRate();
        // }
        this.prevPlayerSpeed = player.speed;
        
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


    updateBuildings(){
        if(this.overflow && this.energyValue <= this.maxEnergyStorage){
            this.overflow = false;
        }
        if(this.energyValue>this.maxEnergyStorage && !this.overflow){
            this.energyValue = this.maxEnergyStorage;
        } else if (!this.overflow && this.energyValue < this.maxEnergyStorage && !this.hotbarScene.tutorialActiveTree && !this.victoryScreenActive){
// alert(this.hotbarScene.tutorialActiveTree);
        this.plots.getChildren().forEach(function(plot){
            if(plot.occupiedWith == "solarPanel"){
                this.energyValue += this.solarPanelEnergyOutput/60;
            } else if (plot.occupiedWith == "windmill"){
                this.energyValue += this.windmillEnergyOutput/60;
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

        this.backObjects.getChildren().forEach((tower)=>{
            if(tower.texture.key == "medbay"){
                this.backObjects.getChildren().forEach((tower)=>{
                    if(tower.health < tower.maxHealth){
                        tower.health += this.medbayRate/60;
                    } else {
                        tower.health = tower.maxHealth;
                    }
                });
            }
        });
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
        var slowRate = 1;
        if(Math.abs(this.nearestObj.x - this.enemy.x)< 4){
            this.enemy.x = this.nearestObj.x;
        }
        if(Math.abs(this.nearestObj.y - this.enemy.y)< 4){
            this.enemy.y = this.nearestObj.y;
        }
        this.backObjects.getChildren().forEach((tower)=>{
            if(tower.texture.key == "slowTower"){
                if(this.enemy.x>tower.x-this.slowTowerRadius && this.enemy.x<tower.x+this.slowTowerRadius && this.enemy.y < tower.y+this.slowTowerRadius && this.enemy.y > tower.y-this.slowTowerRadius){
                    slowRate = this.slowTowerRate;
                }
            }
        });
        if(slowRate != 1){
            this.enemy.setTint(0x87CEFA);
        } else {
            this.enemy.clearTint();
        }
        if(this.nearestObj.x < this.enemy.x){
                this.enemy.setVelocityX(-enemy.speed/slowRate);
            } else if(this.nearestObj.x > this.enemy.x){
                this.enemy.setVelocityX(enemy.speed/slowRate);
            } else {
                this.enemy.setVelocityX(0);
            }
            if(this.nearestObj.y < this.enemy.y){
                this.enemy.setVelocityY(-enemy.speed/slowRate);
            } else if(this.nearestObj.y > this.enemy.y){
                this.enemy.setVelocityY(enemy.speed/slowRate);
            } else {
                this.enemy.setVelocityY(0);
            }
        
        this.enemy.body.velocity.normalize().scale(enemy.speed/slowRate);

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

 findNearestCO2(oxygenObj){
        var prevDistance = 10000;
        this.enemies.getChildren().forEach(function(enemy){
            if(Math.sqrt(Math.pow(enemy.x - oxygenObj.x, 2) + Math.pow(enemy.y - oxygenObj.y, 2)) <= prevDistance){
                prevDistance = Math.sqrt(Math.pow(enemy.x - oxygenObj.x, 2) + Math.pow(enemy.y - oxygenObj.y, 2));
                this.nearestEnemy = enemy;
            }
            
        }, this);
        this.bossObjects.getChildren().forEach((boss)=>{
            if(Math.sqrt(Math.pow(boss.x - oxygenObj.x, 2) + Math.pow(boss.y - oxygenObj.y, 2)) <= prevDistance){
                prevDistance = Math.sqrt(Math.pow(boss.x - boss.x, 2) + Math.pow(boss.y - oxygenObj.y, 2));
                this.nearestEnemy = boss;
            }
        });
    }

    oxygenMovement(object){
        this.findNearestCO2(object);
        this.oxygenObj = object;
        this.oxygenObj.setVelocity(0);
        if(Math.abs(this.nearestEnemy.x - this.oxygenObj.x)< 4){
            this.oxygenObj.x = this.nearestEnemy.x;
        }
        if(Math.abs(this.nearestEnemy.y - this.oxygenObj.y)< 4){
            this.oxygenObj.y = this.nearestEnemy.y;
        }

        if(this.nearestEnemy.x < this.oxygenObj.x){
                this.oxygenObj.setVelocityX(-oxygen.speed);
            } else if(this.nearestEnemy.x > this.oxygenObj.x){
                this.oxygenObj.setVelocityX(oxygen.speed);
            } else {
                this.oxygenObj.setVelocityX(0);
            }
            if(this.nearestEnemy.y < this.oxygenObj.y){
                this.oxygenObj.setVelocityY(-oxygen.speed);
            } else if(this.nearestEnemy.y > this.oxygenObj.y){
                this.oxygenObj.setVelocityY(oxygen.speed);
            } else {
                this.oxygenObj.setVelocityY(0);
            }
        
        this.oxygenObj.body.velocity.normalize().scale(oxygen.speed);
        if(this.nearestEnemy.x < this.oxygenObj.x){
            this.oxygenObj.play("O2WalkLeft", true);
        } else if (this.nearestEnemy.x > this.oxygenObj.x){
            this.oxygenObj.play("O2WalkRight", true);
        } else if (this.nearestEnemy.y < this.oxygenObj.y){
            this.oxygenObj.play("O2WalkUp", true);
        } else if (this.nearestEnemy.y > this.oxygenObj.y){
            this.oxygenObj.play("O2WalkDown", true);
        }  else {
            this.oxygenObj.play("O2WalkDown", true);
        }
    }
    updateObjectHealth(){
        this.backObjects.getChildren().forEach((object)=>{
            if(object.health <= 0 ){
                this.plots.getChildren().forEach(function(plot){
                    if(plot.x == object.x && plot.y == object.y){
                        plot.occupied = false;
                        plot.occupiedWith = "";
                    }
                }, this);
                if(object.texture.key == "batteryPack"){
                    this.maxEnergyStorage -= this.batteryPackStorage;
                }
                this.frontObjects.getChildren().forEach((frontObject)=>{
                    if(object.id == frontObject.id){
                        frontObject.destroy();
                    }
                });
                this.healthBars.getChildren().forEach((healthbar, index)=>{
                    if(object.id == healthbar.id){
                        healthbar.destroy();    
                        this.healthBarsBack.getChildren()[index].destroy();
                    }
                });
                object.destroy();

            }
        });
               
            

            this.bossObjects.getChildren().forEach((boss, index)=>{
                if(boss.health <= 0){
                    if(boss.texture.key == "truckBoss"){
                        boss.destroy();
                        // this.bossObjects.getChildren().pop(index);
                        this.healthBars.getChildren().forEach((healthbar, index)=>{
                            if(healthbar.id == -69){
                                healthbar.destroy();
                                this.healthBarsBack.getChildren()[index].destroy();
                            }
                        });
                    } else if(boss.texture.key == "cfcBoss"){
                        boss.destroy();
                        // this.bossObjects.getChildren().pop(index);
                        this.healthBars.getChildren().forEach((healthbar, index)=>{
                            if(healthbar.id == -420){
                                healthbar.destroy();
                                this.healthBarsBack.getChildren()[index].destroy();
                            }
                        });
                    }
                }
            });
    }
    
    updatePlayerNametag(username, x, y){
        this.nameText.text = username;
        this.nameText.x = x-this.nameText.width/2;
        this.nameText.y = y-this.player.height*3-this.nameText.height/2;
    }
    updateHealthBars(){
        var currentHealth;
        var id;
        this.backObjects.getChildren().forEach((tower)=>{
            id = tower.id;
            currentHealth = tower.health;
            this.healthBars.getChildren().forEach((healthbar)=>{
                if(healthbar.id == id){
                    healthbar.width = healthbar.maxWidth*currentHealth/healthbar.maxHealth;
                }
            });
            
        });

        this.bossObjects.getChildren().forEach((boss)=>{
            if(boss.texture.key == "truckBoss"){
                id = -69;
                currentHealth = boss.health;
            }
            if(boss.texture.key == "cfcBoss"){
                id = -420;
                currentHealth = boss.health;
            }
            this.healthBars.getChildren().forEach((healthbar)=>{
                if(healthbar.id == id){
                    healthbar.width = healthbar.maxWidth*currentHealth/healthbar.maxHealth;
                }
            });
            
        });
        
        
    }

    createEnemySpawn(x, y){
        var enemySpawn = this.physics.add.sprite(x, y, "factoryIdle").setScale(5);
        this.enemySpawns.add(enemySpawn);
        enemySpawn.setSize(enemySpawn.width, enemySpawn.height/1.4);
        enemySpawn.setOffset(0, enemySpawn.height/3);
        enemySpawn.setImmovable();
        enemySpawn.play("factoryIdle");
    }

    removeEnemySpawn(x, y, number){
        for(let enemySpawn of this.enemySpawns.getChildren()){
            if(enemySpawn.x == x && enemySpawn.y == y){
                enemySpawn.destroy();
                switch (number){
                    case 2:
                        this.waveTimerScene.secondSpawnCreated = false;
                        break;
                    case 3:
                        this.waveTimerScene.thirdSpawnCreated = false;
                        break;
                }

            }
        }    
    }


    mageBootstrapUpdate(){
        
        if(configNew.height !== config.height || configNew.width !== config.width){
            for(let object of this.mageBootstrap.getChildren()){
                try{
                // alert('tes');
                var requirements = [""];
                if(object.idRequirements !== undefined){
                    requirements = [object.idRequirements];
                    for(let letter of object.idRequirements){
                        if (letter == " "){
                            requirements = object.idRequirements.split(" ");
                            break;
                        }
                    }
                }
                } catch (error) {
                    alert(this.errorRequest + error);
                }
                for(let requirement of requirements){
                    switch(requirement) {
                        case "stickToBottom": 
                            object.y += configNew.height-config.height;
                            break;
                        case "scaleToFitX":
                            object.width = configNew.width;
                            break;
                        case "centerX":
                            object.x += (configNew.width-config.width)/2;
                            break;
                        case "stickToRight":
                            object.x += configNew.width-config.width;
                            break;
                        case "scaleToFitTextX":
                            object.setWordWrapWidth(configNew.width -200);
                            break;
                    }
                }
            }
            this.minimap.x += configNew.width-config.width;
            config.height = configNew.height;
            config.width = configNew.width;
        }
    }
    bossMovement(){
        this.bossObjects.getChildren().forEach((boss)=>{
            boss.setVelocityX(-enemy.bossSpeed);
            if(boss.texture.key == "truckBoss"){
                this.healthBars.getChildren().forEach((healthBar, index)=>{
                    if(healthBar.id == -69){
                        healthBar.x = boss.x;
                        this.healthBarsBack.getChildren()[index].x = boss.x;
                    }
                });
            }

            if(boss.texture.key == "cfcBoss"){
                this.healthBars.getChildren().forEach((healthBar, index)=>{
                    if(healthBar.id == -420){
                        healthBar.x = boss.x;
                        this.healthBarsBack.getChildren()[index].x = boss.x;
                    }
                });
            }
        });
    
    }

    update(){

        try{
        this.player.setVelocity(0);
        if(!this.movingTutorial && !this.victoryScreenActive){
            this.playerMovement();
        } else {
            this.player.play("idle", true);
        }
        this.updatePlayerNametag(player.username, this.player.x, this.player.y);
        this.enemies.getChildren().forEach(function(enemy){
            this.enemyMovement(enemy);
        }, this);
        this.oxygen.getChildren().forEach(function(oxygen){
            this.oxygenMovement(oxygen);
        }, this);
        this.updateBuildingIndex();
        this.updateBuildings();
        this.updateObjectHealth();
        this.bossMovement();
        if(this.targetAcquired){
            if(!this.waveTimerScene.inProgress){
                this.moveObj();
            } else {
                this.plots.setAlpha(0);
                this.hotbarScene.cancelPopup.setAlpha(0);
                this.target.destroy();
                this.input.off("pointerdown", this.putDownObj, this);
                this.targetAcquired = false;
                this.hotbarScene.canPlaceOBJ = true;
        
            }
        }
        this.mageBootstrapUpdate(this.mageBootstrap);
        this.backObjects.setDepth(0);
        this.backBuildings.setDepth(1);
        this.player.setDepth(2);
        this.nameText.setDepth(3);
        this.frontObjects.setDepth(4);
        this.frontBuildings.setDepth(5);
        this.enemies.setDepth(6);
        this.oxygen.setDepth(7);
        this.enemySpawns.setDepth(8);
        this.healthBarsBack.setDepth(9);
        this.healthBars.setDepth(10);
        // alert(playerWithAccount);
        if (this.creativeMode) {
            this.energyValue = 9999;
        } 
        // alert(this.creativeMode);
        this.updateHealthBars();
        if(player.highestWave-1 > 0 && !this.victoryScreenActive){
            // alert("swap" + this.victoryScreenActive);
            if(this.hotbarScene.tutorialActive){
                this.hotbarScene.tutorialActive = false;
            }
            if(this.hotbarScene.tutorialActiveSP){
                this.hotbarScene.tutorialActiveSP = false;
            }
            if(this.hotbarScene.tutorialActiveTree){
                this.hotbarScene.tutorialActiveTree = false;
            }
        }
        }catch(error){
            alert(error);
        }
        
    }
}


