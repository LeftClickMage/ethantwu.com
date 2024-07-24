import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from "https://unpkg.com/cannon-es@0.20.0/dist/cannon-es.js";
import CannonDebugger from 'https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

//// VARIABLES ////
var scene = new THREE.Scene();
sceneSetup();
var renderer = new THREE.WebGLRenderer();
rendererSetup();
var physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -35, 0),
});
var velocity;
var forwardVector;
var rightVector;
var timeStep = 1/60;
var originalAngularFactor;
var cannonDebugger = new CannonDebugger(scene, physicsWorld, {color: 0xff0000});
var keys = {
    upArrow: false,
    downArrow: false,
    rightArrow: false,
    leftArrow: false,
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    e: false,
}
var rotationX = 0;
var rotationY = 0;
var yAxis = new CANNON.Vec3(0, 1, 0);















//// GAME CODE ////
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var light = new THREE.DirectionalLight(0xffffff, 10);
light.position.z = 50;
light.position.y = 70;
light.position.x = 30;
increaseLightShadowRange(light, 100, 2048);

var light2 = new THREE.AmbientLight(0xffffff);

scene.add(light, light2);

// var controls = new OrbitControls(camera, renderer.domElement);















//// GAME OBJECTS ////
var platform = [
    {
        // mesh:
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(2, 0.1, 2)),
            material: new CANNON.Material(),
            position: new CANNON.Vec3(20, 7, 0)
        })
    },
    {
        // mesh:
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 0.5)),
            material: new CANNON.Material(),
            position: new CANNON.Vec3(17, 6, 0)
        })
    },
    {
        // mesh:
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 0.5)),
            material: new CANNON.Material(),
            position: new CANNON.Vec3(20, 2, 4)
        })
    },
];
physicsWorld.addBody(platform[0].body);
physicsWorld.addBody(platform[1].body);
physicsWorld.addBody(platform[2].body);


var enemies = [];
addEnemy();
addEnemy();
addEnemy();
addEnemy();
addEnemy();

var player = {
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1), 
        new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
    ),
    body: new CANNON.Body({
        mass: 10,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        material: new CANNON.Material(),
        angularDamping: 0.3,
        position: new CANNON.Vec3(0, 10, 0),
    }),
    jumping: false,
    sprinting: false,
    canSprint: true,
    sprintingTimer: 0,
    speed: 7,
    canJump: false,
    canSuper: true,
    lookSpeed: 0.05,
    canShoot: true,
    fireRate: 400, 
    bulletSpeed: 50,
    gun: "pistol",
    score:0,
}
player.mesh.castShadow = true; //shadow
addToWorld(player);


var ground = {
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(50, 50, 10), 
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    ),
    body: new CANNON.Body({
        type: CANNON.Body.STATIC, 
        shape: new CANNON.Box(new CANNON.Vec3(25, 25, 5)),
        material: new CANNON.Material(),   
        position: new CANNON.Vec3(0, -5, 0)
    }),
}
ground.mesh.receiveShadow = true;
ground.body.quaternion.setFromEuler(-Math.PI/2, 0, 0);
addToWorld(ground);


var walls = [
    {
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(25, 50, 0.5)),
            material: new CANNON.Material(),   
            position: new CANNON.Vec3(0, 0, -25)
        }),
    },
    {
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(25, 50, 0.5)),
            material: new CANNON.Material(),   
            position: new CANNON.Vec3(25, 0, 0)
        }),
    },
    {
        body: new CANNON.Body({
            type: CANNON.Body.STATIC, 
            shape: new CANNON.Box(new CANNON.Vec3(25, 50, 0.5)),
            material: new CANNON.Material(),   
            position: new CANNON.Vec3(0, 0, 25)
        }),
    },
    {
        body: new CANNON.Body({
            type: CANNON.Body.STATIC, 
            shape: new CANNON.Box(new CANNON.Vec3(25, 50, 0.5)),
            material: new CANNON.Material(),  
            position: new CANNON.Vec3(-25, 0, 0)
        }),
    },
];
physicsWorld.addBody(walls[0].body);
walls[1].body.quaternion.setFromAxisAngle(yAxis, Math.PI/2);
physicsWorld.addBody(walls[1].body);
physicsWorld.addBody(walls[2].body);
walls[3].body.quaternion.setFromAxisAngle(yAxis, Math.PI/2);
physicsWorld.addBody(walls[3].body);




var sphere = {
    mesh: new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 64, 64),
        new THREE.MeshStandardMaterial({color: 0xffff00,}),
    ), 
    body: new CANNON.Body({
        mass: 8,
        shape: new CANNON.Sphere(0.5),
        material: new CANNON.Material(),
        position: new CANNON.Vec3(3, 15, 0), 
        linearDamping: 0.3,
        angularDamping: 0.3,
    }),
}
sphere.mesh.castShadow = true; 
addToWorld(sphere);


var crate = {
    mesh: new THREE.Group(),
    body: new CANNON.Body({
        mass: 1,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        position: new CANNON.Vec3(0, 10, 0),
        angularDamping: 0.3,
        position: new CANNON.Vec3(5, 1, 0),
        // angularFactor: new CANNON.Vec3(0, 0, 0),
    }),
}
loadSprite(crate.mesh, "model.gltf", 16);
addToWorld(crate);

loadContactMaterials();















//// TWEENS ////
var cameraOutTween = new TWEEN.Tween(camera)
    .to({ fov: 90 }, 210)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onComplete(() => {
    startSprintDelay();
    // consoleLog("complete" + player.sprinting);
});
var sprintDelay = 1500;
async function startSprintDelay(){
    player.sprinting = false;
HTMLObj("dashUI").style.background = "linear-gradient(to top, red, red)";
     for(let i = 1; i <=20; i++){
        HTMLObj("dashUI").style.height = i*5 + "px";
        await downtime(sprintDelay/20);
    }
HTMLObj("dashUI").style.background = "linear-gradient(to top, green, green)";
        HTMLObj("dashUI").style.height = "100px";
    player.canSprint = true;
}












//// GAME RENDER ////
function renderGame() {
    
    
    physicsWorld.step(timeStep);
    
    cannonDebugger.update();

    originalAngularFactor = player.body.angularFactor.clone();

    
    player.body.quaternion.setFromAxisAngle(yAxis, -rotationX);

    setCameraPosition(5);
    updateEnemyMovement();
    updateMovement();
    updateShooting();
    camera.updateProjectionMatrix();

    ground.mesh.position.copy(ground.body.position);
    ground.mesh.quaternion.copy(ground.body.quaternion);
    player.mesh.position.copy(player.body.position);
    player.mesh.quaternion.copy(player.body.quaternion);
    
    sphere.mesh.position.copy(sphere.body.position);
    sphere.mesh.quaternion.copy(sphere.body.quaternion);
    crate.mesh.position.copy(crate.body.position);
    crate.mesh.quaternion.copy(crate.body.quaternion);
    camera.lookAt(player.mesh.position);

    renderer.render(scene, camera);

    player.body.angularFactor.copy(originalAngularFactor);

    if(!player.canSuper && !runnedSuper){
        runnedSuper = true;
        delaySuper(10000);

    }
    if(!player.canShoot && !runned){
        runned = true;

        delayAndMakeTrue(player.fireRate);

    }
    HTMLObj("score").innerHTML = "Score: " + player.score;


   

}
var runned = false;
var runnedSuper = false;

async function delaySuper(delay){
    HTMLObj("superUI").style.background = "linear-gradient(to top, red, red)";
    for(let i = 1; i <=5; i++){
        HTMLObj("superUI").style.height = i*20 + "px";
        await downtime(delay/5);
    }
HTMLObj("superUI").style.background = "linear-gradient(to top, green, green)";
    HTMLObj("superUI").style.height = "100px";
    player.canSuper = true;
    runnedSuper = false;
}

async function delayAndMakeTrue(delay){

    HTMLObj("shootUI").style.background = "linear-gradient(to top, red, red)";
    for(let i = 1; i <=5; i++){
        HTMLObj("shootUI").style.height = i*20 + "px";
        await downtime(delay/5);
    }
    HTMLObj("shootUI").style.height = "100px";
HTMLObj("shootUI").style.background = 'linear-gradient(to top, green, green)';
    player.canShoot = true;
    runned = false;
}

HTMLObj("fireRateUpgrade").addEventListener("click", (e) => {
   if(player.fireRate > 100){
        player.fireRate -= 50;
    }
    consoleLog("fire rate: " + player.fireRate);
});
HTMLObj("bulletSpeedUpgrade").addEventListener("click", (e) => {
   if(player.bulletSpeed < 120){
        player.bulletSpeed += 10;
    }
    consoleLog("bullet speed: " + player.bulletSpeed);
});
HTMLObj("pistol").addEventListener("click", (e) => {
   player.bulletSpeed = 50;
    player.fireRate = 400;
    consoleLog("Pistol loadout: 400 rate, 50 speed");
    HTMLObj("gunUI").innerHTML = "Pistol";
    player.gun = "pistol";
});
HTMLObj("ar").addEventListener("click", (e) => {
   player.bulletSpeed = 65;
    player.fireRate = 200;
    consoleLog("Assault Rifle loadout: 200 rate, 65 speed");
    HTMLObj("gunUI").innerHTML = "AR";
     player.gun = "ar";
});
HTMLObj("smg").addEventListener("click", (e) => {
   player.bulletSpeed = 50;
    player.fireRate = 100;
    consoleLog("SMG loadout: 100 rate, 50 speed");
    HTMLObj("gunUI").innerHTML = "SMG";
     player.gun = "smg";
});
HTMLObj("sniper").addEventListener("click", (e) => {
   player.bulletSpeed = 120;
    player.fireRate = 700;
    consoleLog("Sniper loadout: 700 rate, 120 speed");
    HTMLObj("gunUI").innerHTML = "Sniper";
     player.gun = "sniper";
});








//// SHOOTING ////
var bullets = [];
async function updateShooting(){
    bullets.forEach((bullet, index)=>{
        bullet.body.addEventListener( "collide", async function (event) {
            if(event.contact.bi == ground.body || event.contact.bj == ground.body){
            // await downtime(500);
                destroy(bullet);            
            }
        });
        bullet.prevVelX = bullet.body.velocity.x;
        bullet.prevVelY = bullet.body.velocity.y;
        bullet.prevVelZ = bullet.body.velocity.z;
        bullet.mesh.position.copy(bullet.body.position);
        bullet.mesh.quaternion.copy(bullet.body.quaternion);
        
    });
    if(keys.q && player.canShoot){
        player.canShoot = false;
        shoot();
    }
    if(keys.e && player.canSuper){
        player.canSuper = false;
        shootSuper();
    }
}
function createBullet(x, z, width, height){
     var bulletScale = 1.8;

    var bullet = {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(width*bulletScale, height*bulletScale, 0.5*bulletScale),
            new THREE.MeshStandardMaterial({ 
                color: 0x000000,
            }),
        ),
        body: new CANNON.Body({
            mass: 10,
            shape: new CANNON.Box(new CANNON.Vec3(width*bulletScale/2, height*bulletScale/2, 0.5*bulletScale/2)),
            // angularDamping: 0.9,
            // linearDamping: 0.9,
            position: new CANNON.Vec3(player.body.position.x + x, player.body.position.y, player.body.position.z + z),
            quaternion: new THREE.Quaternion().copy(player.body.quaternion),
            ccdRadius: 1,
            ccdMotionThreshold: 1,
            material: new CANNON.Material(),
        }),
        prevVelX: x*player.bulletSpeed,
        prevVelY: 0.3,
        prevVelZ: z*player.bulletSpeed,
    }
    bullet.mesh.castShadow = true;
    bullet.mesh.position.copy(bullet.body.position);
    bullet.mesh.quaternion.copy(bullet.body.quaternion);
    bullet.body.material.restitution = 0;
    bullet.body.material.friction = 0;
    addToWorld(bullet);
    bullets.push(bullet);
    bullet.body.velocity.set(bullet.prevVelX, bullet.prevVelY, bullet.prevVelZ);


}

function shootSuper(){

var superBulletSize = 0.25;

createBullet(1, 0.75, superBulletSize, superBulletSize);
createBullet(-1, 0.75, superBulletSize, superBulletSize);
createBullet(-1, -0.75, superBulletSize, superBulletSize);
createBullet(1, -0.75, superBulletSize, superBulletSize);

createBullet(0.75, 1, superBulletSize, superBulletSize);
createBullet(-0.75, 1, superBulletSize, superBulletSize);
createBullet(-0.75, -1, superBulletSize, superBulletSize);
createBullet(0.75, -1, superBulletSize, superBulletSize);

createBullet(1, 1, superBulletSize, superBulletSize);
createBullet(-1, 1, superBulletSize, superBulletSize);
createBullet(-1, -1, superBulletSize, superBulletSize);
createBullet(1, -1, superBulletSize, superBulletSize);
createBullet(1, 0, superBulletSize, superBulletSize);
createBullet(0, 1, superBulletSize, superBulletSize);
createBullet(-1, 0, superBulletSize, superBulletSize);
createBullet(0, -1, superBulletSize, superBulletSize);

}
function shoot(){
    // consoleLog(forwardVector.x)

    var bulletScale = 1.8;
    var bullet = {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(0.15*bulletScale, 0.15*bulletScale, 0.5*bulletScale),
            new THREE.MeshStandardMaterial({ 
                color: 0x000000,
            }),
        ),
        body: new CANNON.Body({
            mass: 10,
            shape: new CANNON.Box(new CANNON.Vec3(0.15*bulletScale/2, 0.15*bulletScale/2, 0.5*bulletScale/2)),
            // angularDamping: 0.9,
            // linearDamping: 0.9,
            position: new CANNON.Vec3(player.body.position.x + forwardVector.x*2, player.body.position.y, player.body.position.z + forwardVector.z*2),
            quaternion: new THREE.Quaternion().copy(player.body.quaternion),
            ccdRadius: 1,
            ccdMotionThreshold: 1,
            material: new CANNON.Material(),
        }),
        prevVelX: forwardVector.x*player.bulletSpeed,
        prevVelY: 0.3,
        prevVelZ: forwardVector.z*player.bulletSpeed,
    }
    bullet.mesh.castShadow = true;
    bullet.mesh.position.copy(bullet.body.position);
    bullet.mesh.quaternion.copy(bullet.body.quaternion);
    bullet.body.material.restitution = 0;
    bullet.body.material.friction = 0;
    addToWorld(bullet);
    // enemies.forEach((enemy)=>{
    //     var enemyBullet = new CANNON.ContactMaterial(
    //         bullet.body.material,
    //         enemy.body.material,
    //         {friction: 0, restitution: 0}
    //     );
    //     physicsWorld.addContactMaterial(enemyBullet);
    // });
    bullets.push(bullet);
    bullet.body.velocity.set(bullet.prevVelX, bullet.prevVelY, bullet.prevVelZ);

}







//// ENEMY MOVEMENT ////
function updateEnemyMovement(){
    enemies.forEach((enemy)=>{
         const direction = new THREE.Vector3();
        direction.subVectors(player.mesh.position, enemy.mesh.position).normalize();

        var enemySpeed = 7;
        enemy.body.velocity.set(direction.x*enemySpeed, enemy.body.velocity.y, direction.z*enemySpeed);

        enemy.mesh.lookAt(player.mesh.position);

        enemy.mesh.position.copy(enemy.body.position);
        enemy.body.quaternion.copy(enemy.mesh.quaternion);
        

        enemy.body.addEventListener("collide", function (e) {
            var contact = e.contact;
            bullets.forEach((bullet)=>{
                if(contact.bi == bullet.body || contact.bj == bullet.body){
                    killEnemy(enemy);          
                    
                    
                    if(player.gun !== "sniper"){
                        destroy(bullet);
                    }
                    bullet.velocity.set(bullet.prevVelX, bullet.prevVelY, bullet.prevVelZ);
                }
            });
            if(contact.bi == player.body || contact.bj == player.body){
                killPlayer();
            }

        }); 
    })
}


//// PLAYER MOVEMENT ////
function updateMovement() {
    checkIfCanJump();
    velocity = new THREE.Vector3();
    // Calculate the forward direction vector based on the object's orientation
    forwardVector = new THREE.Vector3(0, 0, -1);
    const quaternion = new THREE.Quaternion(player.body.quaternion.x, player.body.quaternion.y, player.body.quaternion.z, player.body.quaternion.w);
    forwardVector.applyQuaternion(quaternion);
var normalize = 1;
    if(keys.w && keys.a ||  keys.w && keys.d || keys.s && keys.a || keys.s && keys.d){
        normalize = Math.sqrt(player.speed*player.speed*2);
        normalize = normalize/2;
        normalize = normalize / player.speed;
    }
    if(!player.sprinting){
        if (keys.w || keys.s) {
        if (keys.w) {
            velocity.add(forwardVector.clone().multiplyScalar(player.speed*normalize));
        }
        if (keys.s) {
            velocity.add(forwardVector.clone().multiplyScalar(-player.speed*normalize));
        }
    }

    if (keys.a || keys.d) {
        rightVector = new THREE.Vector3(1, 0, 0);
        rightVector.applyQuaternion(quaternion);
        if (keys.a) {
            velocity.add(rightVector.clone().multiplyScalar(-player.speed*normalize));
        }
        if (keys.d) {
            velocity.add(rightVector.clone().multiplyScalar(player.speed*normalize));
        }
    }
    }

    
    if (player.canJump && player.jumping){
        player.body.velocity.y = 11;
        player.canJump = false;
    }
    if(player.sprinting){
        velocity.add(forwardVector.clone().multiplyScalar(player.speed*5));
    }

    if(keys.upArrow && !player.sprinting && player.canSprint){
        player.canSprint = false;
        player.sprinting = true;
        cameraOutTween.start();

    }else if(camera.fov > 75 && !player.sprinting){
            cameraOutTween.stop();
            camera.fov -= 1.5;
 }
  
    // Set the velocity to the box body
    
    player.body.velocity.set(velocity.x, player.body.velocity.y, velocity.z);
}















//// EXTRA FUNCTIONS ////
function killPlayer(){
    player.score = 0;
    player.body.position.x = 20;
    player.body.position.y = 10;
    player.body.position.z = 0;
}

function killEnemy(enemy){
    player.score += 50;
    enemy.body.position.x = Math.random()*40-20;
    enemy.body.position.y = 5;
    enemy.body.position.z = Math.random()*40-20;
}

function addEnemy(){
    var enemyScale = 1.3;
    var enemy = {
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(1*enemyScale, 1*enemyScale, 1*enemyScale),
        new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
        }),
    ),
    body: new CANNON.Body({
        mass: 10,
        shape: new CANNON.Box(new CANNON.Vec3(0.5*enemyScale, 0.5*enemyScale, 0.5*enemyScale)),
        angularDamping: 0.9,
        linearDamping: 0.9,
        position: new CANNON.Vec3(10, 1, 10),
        material: new CANNON.Material(),
    }),
}
enemy.mesh.castShadow = true;
addToWorld(enemy);
enemies.push(enemy);
}

function destroy(object) {
    // Remove and dispose of the Three.js mesh
    
    if (object.mesh.geometry) object.mesh.geometry.dispose();
    if (object.mesh.material) {
        if (Array.isArray(object.mesh.material)) {
            object.mesh.material.forEach(material => material.dispose());
        } else {
            object.mesh.material.dispose();
        }
    }
    scene.remove(object.mesh);  
    // Remove the Cannon.js body
    physicsWorld.removeBody(object.body);
}

function HTMLObj(id){
    return document.getElementById(id);
}

function checkIfCanJump(){
     var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    var upAxis = new CANNON.Vec3( 0, 1, 0 );
    player.body.addEventListener( "collide", function (e) {
        player.body.angularFactor.set(0, 0, 0);

        var contact = e.contact;

        if (contact.bi == player.body) {
            contact.ni.negate( contactNormal );
        } 
        else {
            contactNormal.copy( contact.ni );
        }
        
        if ( contactNormal.dot( upAxis ) > 0.5) {
            player.canJump = true;
        }
    });
}

function loadSprite(addMesh, path, height){
    var gltfLoader = new GLTFLoader();
    gltfLoader.load(path, (gltfScene)=>{
        gltfScene.scene.traverse(function(node){
            if ( node.isMesh ) {
                node.castShadow = true; 
            }
        })
        gltfScene.scene.position.set(0, -height/32, 0);
        addMesh.add(gltfScene.scene); 
    });
}

function addToWorld(container){
    physicsWorld.addBody(container.body);
    scene.add(container.mesh);
}

function increaseLightShadowRange(light, amount, shadowQuality){
    light.castShadow = true; //shadow
    light.shadow.camera.left = -amount;
    light.shadow.camera.right = amount;
    light.shadow.camera.top = amount;
    light.shadow.camera.bottom = -amount;
    light.shadow.mapSize.width = shadowQuality;
    light.shadow.mapSize.height = shadowQuality;
}

function setCameraPosition(distance){
    if(keys.rightArrow){
        rotationX += player.lookSpeed;
    }
    if(keys.leftArrow){
        rotationX -= player.lookSpeed;
    }
    var offsetX = Math.sin(-rotationX) * distance;
    var offsetY = Math.sin(rotationY) * distance;
    var offsetZ = Math.cos(-rotationX) * distance;
    camera.position.set(player.mesh.position.x + offsetX, player.mesh.position.y + offsetY + 2.5, player.mesh.position.z + offsetZ);
}


function sceneSetup(){
    var axesHelper = new THREE.AxesHelper(8);
    scene.add(axesHelper);
}

function rendererSetup(){
    renderer.shadowMap.enabled = true; //shadow
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function loadContactMaterials(){
    var groundSphereContactMaterial = new CANNON.ContactMaterial(
        ground.body.material,
        sphere.body.material,
        {restitution: 0.6}
    );
    
    var groundBoxContactMaterial = new CANNON.ContactMaterial(
        ground.body.material,
        player.body.material,
        {friction: 0, restitution: 0}
    );
    enemies.forEach((enemy)=>{
        var enemyGround = new CANNON.ContactMaterial(
            ground.body.material,
            enemy.body.material,
            {friction: 0, restitution: 0}
        );
        physicsWorld.addContactMaterial(enemyGround);

    });
    
    walls.forEach((wall)=>{
        var wallContactMaterial = new CANNON.ContactMaterial(
            wall.body.material,
            player.body.material,
            {friction: 0, restitution: 0}
        );
        physicsWorld.addContactMaterial(wallContactMaterial);
    });

    physicsWorld.addContactMaterial(groundBoxContactMaterial);
    physicsWorld.addContactMaterial(groundSphereContactMaterial);
    
}

//// 60FPS RENDER ////
var fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    // await downtime(1000);
    animate();
}

function animate(delta) {
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        TWEEN.update(delta);
        renderGame();
        
    }
}

startAnimating(60);

function consoleLog(text){
    HTMLObj("console").innerHTML = "> " + text + "<br>" + HTMLObj("console").innerHTML;
}



//// EVENT LISTENERS ////
addEventListener('keydown', function(event) {
    // alert(event.key)
    // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    if(event.key == "ArrowRight"){
        keys.rightArrow = true;
    }
    if(event.key == "ArrowLeft"){
        keys.leftArrow = true;
    }
    if(event.key == "ArrowUp"){
        keys.upArrow = true;
    }
    if(event.key == "ArrowDown"){
        keys.downArrow = true;
    }
    if(event.key == "w"){
        // alert('test');
        keys.w = true;
    }
    if(event.key == "a"){
        keys.a = true;
    }
    if(event.key == "s"){
        keys.s = true;
    }
    if(event.key == "d"){
        keys.d = true;
    }
    if(event.key == "q"){
        keys.q = true;
    }
    if(event.key == "e"){
        keys.e = true;
    }
    if(event.key == " "){
        player.jumping = true;
    }
});

addEventListener('keyup', function(event) {
    // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    if(event.key == "ArrowRight"){
        keys.rightArrow = false;
    }
    if(event.key == "ArrowLeft"){
        keys.leftArrow = false;
    }
    if(event.key == "ArrowUp"){
        keys.upArrow = false;
    }
    if(event.key == "ArrowDown"){
        keys.downArrow = false;
    }
    if(event.key == "w"){
        keys.w = false;
    }
    if(event.key == "a"){
        keys.a = false;
    }
    if(event.key == "s"){
        keys.s = false;
    }
    if(event.key == "d"){
        keys.d = false;
    }
    if(event.key == "q"){
        keys.q = false;
    }
    if(event.key == "e"){
        keys.e = false;
    }
    if(event.key == " "){
        player.jumping = false;
    }
});