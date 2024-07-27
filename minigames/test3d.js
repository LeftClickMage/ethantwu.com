import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from "https://unpkg.com/cannon-es@0.20.0/dist/cannon-es.js";
import CannonDebugger from 'https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import Stats from 'https://cdnjs.cloudflare.com/ajax/libs/stats.js/r17/Stats.min.js';
// import {RenderPass} from "three/addons/postprocessing/RenderPass";
// import {EffectComposer} from "three/addons/postprocessing/EffectComposer";


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
var rotationX = -Math.PI/2;
var rotationY = 0;
var yAxis = new CANNON.Vec3(0, 1, 0);
var anim = true;
var noFrictionMaterial = new CANNON.Material();
var shadowsOn = true;












//// GAME CODE ////
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var light = new THREE.DirectionalLight(0xfff7e0, 10);
light.position.set(50, 40, 10);

increaseLightShadowRange(light, 100, 2048);

var light2 = new THREE.AmbientLight(0xF0F0F0);

scene.add(light, light2);

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: memory
document.body.appendChild(stats.dom);

// var controls = new OrbitControls(camera, renderer.domElement);


// const composer = new EffectComposer(renderer);
//         const renderPass = new RenderPass(scene, camera);
//         composer.addPass(renderPass);


//// GAME OBJECTS ////
const vertexShader = `

    varying vec2 vUv;
    uniform float time;
    const int numOfObjects = 8;
    uniform vec3 positions[numOfObjects]; 
    uniform vec3 ballPosition;
    uniform bool anim;
    void main() {
        vUv = uv;
        vec4 grassPosition = instanceMatrix * vec4(position, 1);      
        if(anim){
            vec4 prevGrassPos = grassPosition;
        float bendFactor = grassPosition.y * grassPosition.y * 2.0;
        for(int i = 0; i<numOfObjects; i++){
            vec3 toObject = grassPosition.xyz - positions[i];
            float distanceToObject = length(toObject);

            if(distanceToObject < 1.1){
                if(positions[i].x > grassPosition.x){
                    grassPosition.x -= bendFactor;
                } else if(positions[i].x < grassPosition.x){
                    grassPosition.x += bendFactor;
                }
                if(positions[i].z > grassPosition.z){
                    grassPosition.z -= bendFactor;
                } else if(positions[i].z < grassPosition.z){
                    grassPosition.z += bendFactor;
                }
            } 
        }
        

      if (prevGrassPos == grassPosition && grassPosition.y > 0.1){
          grassPosition.x += sin(grassPosition.y*grassPosition.y + time*7.0)/7.0;
       } 
        }
        
       
        gl_Position = projectionMatrix * modelViewMatrix * grassPosition;
    }
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
  	vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
    float clarity = vUv.y * vUv.y * 0.4 + 0.35;
    gl_FragColor = vec4( baseColor * clarity, 1);
  }
`;

const leavesMaterial = new THREE.ShaderMaterial({
	vertexShader,
  fragmentShader,
  uniforms: {
    time: {
        value: 0,
    },
    positions: { 
        value: [
            new THREE.Vector3(), //player [0]
            new THREE.Vector3(), //sphere [1]
            new THREE.Vector3(), //crate [2]
            new THREE.Vector3(), //enemy [3] 
            new THREE.Vector3(), //enemy [4]
            new THREE.Vector3(), //enemy [5]
            new THREE.Vector3(), //enemy [6]
            new THREE.Vector3(), //enemy [7]
        ]
    },
    anim: {value: true},
  },
  side: THREE.DoubleSide
});


const instanceNumber = 80000;
const dummy = new THREE.Object3D();

const geometry = new THREE.PlaneGeometry(0.1, 0.2);
geometry.translate( 0, 0.1, 0 ); // move grass blade geometry lowest point at 0.


const grass = new THREE.InstancedMesh( geometry, leavesMaterial, instanceNumber );
grass.frustumCulled = true;

scene.add( grass );



// Position and scale the grass blade instances randomly.
for (let i = 0; i < instanceNumber; i++) {
  const x = Math.random()*50-25;
  const z = Math.random()*50-25;
  const height = 1;
  const rotationY = Math.random() * Math.PI;

  dummy.position.set(x, 0, z);
  dummy.scale.setScalar(height);
  dummy.rotation.y = rotationY;
  dummy.updateMatrix();
  
  grass.setMatrixAt(i, dummy.matrix);
}




var platform = [
    {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(20, 0.2, 20), 
            new THREE.MeshStandardMaterial({ color: 0x000000})
        ),
        body: new CANNON.Body({//starting platform
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(10, 0.1, 10)),
            material: noFrictionMaterial,
            position: new CANNON.Vec3(24+10, 7, 0)
        })
    },
    {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(4, 0.6, 4), 
            new THREE.MeshPhongMaterial({ color: 0x00F000, shininess: 100})
        ),
        body: new CANNON.Body({//respawn platform
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(2, 0.3, 2)),
            material: noFrictionMaterial,
            position: new CANNON.Vec3(0, 8, 0)
        })
    },
    {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.2, 1), 
            new THREE.MeshStandardMaterial({ color: 0x000000})
        ),
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 0.5)),
            material: noFrictionMaterial,
            position: new CANNON.Vec3(20, 2, 4)
        })
    },

    {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.2, 1), 
            new THREE.MeshStandardMaterial({ color: 0x000000})
        ),
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 0.5)),
            material: noFrictionMaterial,
            position: new CANNON.Vec3(20, 4, 6)
        })
    },
    {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.2, 1), 
            new THREE.MeshStandardMaterial({ color: 0x000000})
        ),
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 0.5)),
            material: noFrictionMaterial,
            position: new CANNON.Vec3(20, 6, 8)
        })
    },
];
platform.forEach((platform)=>{
    addToWorld(platform);
    platform.mesh.position.copy(platform.body.position);
})



var enemies = [];
addEnemy();
addEnemy();
addEnemy();
addEnemy();
addEnemy();

var player = {
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1), 
        new THREE.MeshStandardMaterial({ 
            color: 0xEEEEEE, // Base color of the metal (e.g., light gray)
            metalness: 0.7,   // Fully metallic
            roughness: 0.2,
        }),
    ),
    body: new CANNON.Body({
        mass: 10,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        material: new CANNON.Material(),
        angularDamping: 0.3,
        position: new CANNON.Vec3(30, 10, 0),
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
    highScore: 0,
}
addToWorld(player);


var ground = {
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(50, 50, 10), 
        new THREE.MeshStandardMaterial({ color: 0x005000 })
    ),
    body: new CANNON.Body({
        type: CANNON.Body.STATIC, 
        shape: new CANNON.Box(new CANNON.Vec3(25, 25, 5)),
        material: noFrictionMaterial,
        position: new CANNON.Vec3(0, -5, 0)
    }),
}
ground.body.quaternion.setFromEuler(-Math.PI/2, 0, 0);
addToWorld(ground);


var walls = [
    {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(50, 50, 4), 
            new THREE.MeshStandardMaterial({ color: 0x555555})
        ),
        body: new CANNON.Body({//Right wall
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(25, 25, 2)),
            material: noFrictionMaterial,
            position: new CANNON.Vec3(0, 25, -25 - 1)
        }),
    },
    {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(50, 7, 4), 
            new THREE.MeshStandardMaterial({ color: 0x555555})
        ),
        body: new CANNON.Body({//back wall
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(25, 3.5, 2)),
            material: noFrictionMaterial,  
            position: new CANNON.Vec3(25+1, 3.5, 0)
        }),
    },
    {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(50, 50, 4), 
            new THREE.MeshStandardMaterial({ color: 0x555555})
        ),
        body: new CANNON.Body({//left wall
            type: CANNON.Body.STATIC, 
            shape: new CANNON.Box(new CANNON.Vec3(25, 25, 2)),
            material: noFrictionMaterial,  
            position: new CANNON.Vec3(0, 25, 25+1)
        }),
    },
    {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(50, 50, 4), 
            new THREE.MeshStandardMaterial({ color: 0x555555})
        ),
        body: new CANNON.Body({//front wall
            type: CANNON.Body.STATIC, 
            shape: new CANNON.Box(new CANNON.Vec3(25, 25, 2)),
            material: noFrictionMaterial, 
            position: new CANNON.Vec3(-25 - 1, 25, 0)
        }),
    },
];
walls.forEach((wall)=>{
    addToWorld(wall);
    wall.mesh.position.copy(wall.body.position);
});
walls[1].body.quaternion.setFromAxisAngle(yAxis, Math.PI/2);
walls[3].body.quaternion.setFromAxisAngle(yAxis, Math.PI/2);

walls[1].mesh.quaternion.copy(walls[1].body.quaternion);
walls[3].mesh.quaternion.copy(walls[3].body.quaternion);



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











var grassUpdateVal = 0;
//// GAME RENDER ////
function renderGame() {
    


    physicsWorld.step(timeStep);
    
    if(window.location.hostname == "localhost"){
        cannonDebugger.update();
    }

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
    // composer.render();
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
    HTMLObj("highScore").innerHTML = "HS: " + player.highScore;
    HTMLObj("score").innerHTML = "Score: " + player.score;
// consoleLog(bulletPool.length);
    HTMLObj("bulletPoolCount").innerHTML = "BulletPool: " + bulletPool.length;
   
    if(!runOnce){
        runOnce = true;
        populatePool();
        
    }
}
var runOnce = false;
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
   player.bulletSpeed = 75;
    player.fireRate = 200;
    consoleLog("Assault Rifle loadout: 200 rate, 75 speed");
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
HTMLObj("shotgun").addEventListener("click", (e) => {
   player.bulletSpeed = 40;
    player.fireRate = 500;
    consoleLog("Shotgun loadout: 500 rate, 40 speed");
    HTMLObj("gunUI").innerHTML = "Shotgun";
     player.gun = "shotgun";
});

HTMLObj("switchShadow").addEventListener("click", (e) => {
    shadowsOn = !shadowsOn;
    shadows(shadowsOn);
    if(shadowsOn){
        HTMLObj("switchShadow").innerHTML = "Shadows ON";
    } else if(!shadowsOn){
        HTMLObj("switchShadow").innerHTML = "Shadows OFF";
    }
  
});
HTMLObj("switchAnim").addEventListener("click", (e) => {
    anim = !anim;
    if(anim){
        HTMLObj("switchAnim").innerHTML = "Anims ON";
    } else if(!anim){
        HTMLObj("switchAnim").innerHTML = "Anims OFF";
    }
});




//// SHOOTING ////
var bullets = new Set();
var bulletPool = [];
async function updateShooting(){
    bullets.forEach((bullet, index)=>{
        if(bullet.body.position.y < -10 || bullet.body.velocity.length()< 0.25){
            destroy(bullet);  
        }
        ;
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
    var bullet;
    if(bulletPool.length > 0){
        bullet = bulletPool.pop();
        bullet.body.wakeUp();
    } else {
        bullet = createSmallBullet();
    }

    bullet.body.position.set(player.body.position.x + x, player.body.position.y, player.body.position.z + z);
    bullet.body.quaternion.copy(player.body.quaternion),
    bullet.mesh.position.copy(bullet.body.position);
    bullet.mesh.quaternion.copy(bullet.body.quaternion);
    bullet.body.angularVelocity.set(0, 0, 0);
    bullet.body.angularFactor.set(0, 0, 0);
    addToWorld(bullet);
    bullets.add(bullet);
    bullet.prevVelX = x*player.bulletSpeed;
    bullet.prevVelY = 0.3;
    bullet.prevVelZ = z*player.bulletSpeed;
    bullet.body.velocity.set(bullet.prevVelX, bullet.prevVelY, bullet.prevVelZ);

}

function shootSuper(){

var superBulletSize = 0.05;

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

function populatePool(){
    for(let i = 0; i < 30; i++){
        bulletPool.push(createSmallBullet());
    }
}


function shoot(){
    if(player.gun == "shotgun"){
        for(let i = 0; i<3; i++){
            var shellFactor;
            var bulletRotationVal = Math.PI/2;
            var shellRotation = Math.PI;

            var bullet;
            if(bulletPool.length > 0){
                bullet = bulletPool.pop();
                bullet.body.wakeUp();
            } else {
                bullet = createSmallBullet();
            }
            if(i == 1){
                shellRotation /= 25;
                bulletRotationVal *= 2/1.9;
            }
            if(i == 2){
                shellRotation /= -25;
                bulletRotationVal *= 2/2.1;
            }
            const additionalRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), shellRotation);
        bullet.body.position.set(player.body.position.x+ forwardVector.x*2, player.body.position.y, player.body.position.z +forwardVector.z*2);

            const resultQuaternion = new THREE.Quaternion().copy(player.body.quaternion).multiply(additionalRotation);

            bullet.body.quaternion.copy(resultQuaternion)
            
            addToWorld(bullet);
            bullets.add(bullet);
            var bulletVector = new THREE.Vector3(1, 0 ,0);
            bulletVector.applyQuaternion(player.body.quaternion);
            const bulletRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), bulletRotationVal);
            bulletVector.applyQuaternion(bulletRotation);
            bullet.prevVelX = bulletVector.x*player.bulletSpeed;
            bullet.prevVelY = 0.3;
            bullet.prevVelZ = bulletVector.z*player.bulletSpeed;
            bullet.body.velocity.set(bullet.prevVelX, bullet.prevVelY, bullet.prevVelZ);
            bullet.body.angularVelocity.set(0, 0, 0);
            bullet.body.angularFactor.set(0, 0, 0);
        }
    } else {
        var bullet;
            if(bulletPool.length > 0){
                bullet = bulletPool.pop();
                bullet.body.wakeUp();
            } else {
                bullet = createSmallBullet();
            }

        bullet.body.position.set(player.body.position.x+ forwardVector.x*2, player.body.position.y, player.body.position.z +forwardVector.z*2);

            bullet.body.quaternion.copy(player.body.quaternion)
            
            addToWorld(bullet);
            bullets.add(bullet);

            bullet.prevVelX = forwardVector.x*player.bulletSpeed;
            bullet.prevVelY = 0.3;
            bullet.prevVelZ = forwardVector.z*player.bulletSpeed;
            bullet.body.velocity.set(bullet.prevVelX, bullet.prevVelY, bullet.prevVelZ);
            bullet.body.angularVelocity.set(0, 0, 0);
            bullet.body.angularFactor.set(0, 0, 0);
    }

    
    
    // addToWorld(bullet);
    // bullets.add(bullet);
    
    // bullet.body.velocity.set(bullet.prevVelX, bullet.prevVelY, bullet.prevVelZ);
}



function createSmallBullet(){
    var bulletScale = 1.8;
    var bullet = {
        mesh: new THREE.Mesh(
            new THREE.BoxGeometry(0.05*bulletScale, 0.05*bulletScale, 0.5*bulletScale),
            new THREE.MeshStandardMaterial({ 
                color: 0x000000,
            }),
        ),
        body: new CANNON.Body({
            mass: 10,
            shape: new CANNON.Box(new CANNON.Vec3(0.05*bulletScale/2, 0.05*bulletScale/2, 0.5*bulletScale/2)),
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
    bullet.body.material.restitution = 0;
    bullet.body.material.friction = 0;
    return bullet;
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
    if(player.body.position.y < -10){
        killPlayer();
    }
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
        player.body.velocity.y = 13;
        player.canJump = false;
        touchingGround = false;
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
function shadows(value) {
    renderer.shadowMap.enabled = value;
    
    scene.traverse(function(object) {
        if (object.isMesh && object !== grass) {
            object.castShadow = value;
            object.receiveShadow = value;
        }
    });

    scene.children.forEach(function(child) {
        if (child.isLight) {
            child.castShadow = value;
        }
    });
}

function killPlayer(){
    player.body.velocity.set(0, 0, 0);
    if(player.highScore < player.score){
        player.highScore = player.score;
    }
    player.score = 0;
    player.body.position.set(0, 11, 0);
    rotationX = -Math.PI/2;
}

async function killEnemy(enemy){
    enemy.body.sleep();
    player.score += 50;
    enemy.body.position.set(Math.random() * 40 - 20, 5, Math.random() * 40 - 20);
    await downtime(1000);
    enemy.body.wakeUp();
}

function addEnemy(){
    var enemyScale = 1.2;
    var enemy = {
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(1*enemyScale, 1*enemyScale, 1*enemyScale),
        new THREE.MeshPhongMaterial({ 
            color: 0xff0000,
        }),
    ),
    body: new CANNON.Body({
        mass: 10,
        shape: new CANNON.Box(new CANNON.Vec3(0.5*enemyScale, 0.5*enemyScale, 0.5*enemyScale)),
        angularDamping: 0.9,
        linearDamping: 0.9,
        position: new CANNON.Vec3(Math.random()*40-20, 3, Math.random()*40-20),
        material: new CANNON.Material(),
    }),
}
addToWorld(enemy);
enemies.push(enemy);
}

function destroy(object) {
    if(bullets.has(object)){
        bullets.delete(object);
        // object.body.velocity.set(0, 0, 0);
        object.body.sleep();
        object.body.position.set(-40, 5, -40);
        object.mesh.position.copy(object.body.position);

        // scene.remove(object.mesh);  
        // physicsWorld.removeBody(object.body);
        
        bulletPool.push(object);
    }
}

function HTMLObj(id){
    return document.getElementById(id);
}
var touchingGround = false;
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
            touchingGround = true;
        }
    });
    
    if(Math.abs(player.body.velocity.y)>3){
        player.canJump = false;
    } else if (touchingGround){
        player.canJump = true;
    }
}

function loadSprite(addMesh, path, height){
    var gltfLoader = new GLTFLoader();
    gltfLoader.load(path, (gltfScene)=>{
        gltfScene.scene.traverse(function(node){
            if ( node.isMesh ) {
                node.castShadow = true; 
                node.receiveShadow = true; 
            }
        })
        gltfScene.scene.position.set(0, -height/32, 0);
        addMesh.add(gltfScene.scene); 
    });
}

function addToWorld(container){
    physicsWorld.addBody(container.body);
    scene.add(container.mesh);
    container.mesh.receiveShadow = true;
    container.mesh.castShadow = true;
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
var inWall = false;
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
    // if(camera.position.z < 23 && camera.position.z >= -23 && !inWall){
    // camera.position.set(camera.position.x, player.mesh.position.y + offsetY + 2.5, player.mesh.position.z + offsetZ);
    // } else {
    //     inWall = true;
    //     camera.position.z = -23;
    // }
    // if(player.body.position.z > -18){
    //     inWall = false;
    // }
    //  if(camera.position.x > -24){
    // camera.position.set(player.mesh.position.x + offsetX, player.mesh.position.y + offsetY + 2.5, camera.position.z);
    // }
camera.position.set(player.mesh.position.x + offsetX, player.mesh.position.y + offsetY + 2.5, player.mesh.position.z + offsetZ);
    
}


function sceneSetup(){
    if(window.location.hostname == "localhost"){
        var axesHelper = new THREE.AxesHelper(8);
        scene.add(axesHelper);
    }
    scene.background = new THREE.Color(0x87CEEB);
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
        noFrictionMaterial,
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
    stats.begin()
    
    grassUpdateVal += 1/240;
    leavesMaterial.uniforms.anim.value = anim;

    leavesMaterial.uniforms.time.value = grassUpdateVal;
    leavesMaterial.uniformsNeedUpdate = true;

    leavesMaterial.uniforms.positions.value[0].copy(player.mesh.position);
    leavesMaterial.uniforms.positions.value[1].copy(sphere.mesh.position);
    leavesMaterial.uniforms.positions.value[2].copy(crate.mesh.position);
    enemies.forEach((enemy, index)=>{
        leavesMaterial.uniforms.positions.value[index+3].copy(enemy.mesh.position);
    })
    
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        TWEEN.update(delta);
        renderGame();
        
    }
    stats.end();
}

startAnimating(60);

function consoleLog(text){
    HTMLObj("console").innerHTML = "> " + text + "<br>" + HTMLObj("console").innerHTML;
}



//// EVENT LISTENERS ////
addEventListener('keydown', function(event) {
    // alert(event.key)
    // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    var key = event.key.toLowerCase();
    if(key == "arrowright"){
        keys.rightArrow = true;
    }
    if(key == "arrowleft"){
        keys.leftArrow = true;
    }
    if(key == "arrowup"){
        keys.upArrow = true;
    }
    if(key == "arrowdown"){
        keys.downArrow = true;
    }
    if(key == "w"){
        // alert('test');
        keys.w = true;
    }
    if(key == "a"){
        keys.a = true;
    }
    if(key == "s"){
        keys.s = true;
    }
    if(key == "d"){
        keys.d = true;
    }
    if(key == "q"){
        keys.q = true;
    }
    if(key == "e"){
        keys.e = true;
    }
    if(key == " "){
        player.jumping = true;
    }
});

addEventListener('keyup', function(event) {
    var key = event.key.toLowerCase();
    // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    if(key == "arrowright"){
        keys.rightArrow = false;
    }
    if(key == "arrowleft"){
        keys.leftArrow = false;
    }
    if(key == "arrowup"){
        keys.upArrow = false;
    }
    if(key == "arrowdown"){
        keys.downArrow = false;
    }
    if(key == "w"){
        keys.w = false;
    }
    if(key == "a"){
        keys.a = false;
    }
    if(key == "s"){
        keys.s = false;
    }
    if(key == "d"){
        keys.d = false;
    }
    if(key == "q"){
        keys.q = false;
    }
    if(key == "e"){
        keys.e = false;
    }
    if(key == " "){
        player.jumping = false;
    }
});