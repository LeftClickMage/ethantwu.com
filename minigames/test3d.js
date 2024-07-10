import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from "https://unpkg.com/cannon-es@0.20.0/dist/cannon-es.js";
import CannonDebugger from 'https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";


var keys = {
    upArrow: false,
    downArrow: false,
    rightArrow: false,
    leftArrow: false,
    w: false,
    a: false,
    s: false,
    d: false,
}
var playerStats = {
    jumping: false,
    sprinting: false,
    // speed: 7,
}

var physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -35, 0),
});

var timeStep = 1/60;
var groundBodyMaterial = new CANNON.Material();
var groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC, //and other types like kinematic or dynamic
    shape: new CANNON.Box(new CANNON.Vec3(25, 25, 0.05)),
    // mass: 2,
    material: groundBodyMaterial,
});

groundBody.quaternion.setFromEuler(-Math.PI/2, 0, 0);
physicsWorld.addBody(groundBody);


var sphereBodyMaterial = new CANNON.Material();
var sphereBody = new CANNON.Body({
    mass: 8,
    shape: new CANNON.Sphere(0.5),
    material: sphereBodyMaterial,
});
sphereBody.position.set(3, 15, 0);
sphereBody.linearDamping = 0.3;
physicsWorld.addBody(sphereBody);

var playerBodyMaterial = new CANNON.Material();
var playerBody = new CANNON.Body({
    mass: 10,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    material: playerBodyMaterial,
});
playerBody.fixedRotation = true;
playerBody.angularFactor.set(0, 0, 0);
playerBody.angularDamping = 0.3;
playerBody.position.set(0, 10, 0);
physicsWorld.addBody(playerBody);

var enemyBody = new CANNON.Body({
    mass: 10,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
});
enemyBody.angularDamping = 0.9;
enemyBody.linearDamping = 0.9;
enemyBody.position.set(10, 1, 10);
physicsWorld.addBody(enemyBody)


var crateBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    position: new CANNON.Vec3(0, 10, 0),
});
crateBody.angularDamping = 0.3;
crateBody.position.set(5, 1, 0);
crateBody.angularFactor.set(0, 0, 0);

crateBody.fixedRotation = true;
physicsWorld.addBody(crateBody);

var platformBodyMaterial = new CANNON.Material();
var platformBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 0.5)),
    material: platformBodyMaterial,
});
platformBody.position.set(20, 2, 0);
physicsWorld.addBody(platformBody);

var platformBody2 = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 0.5)),
    material: platformBodyMaterial,
});
platformBody2.position.set(17, 4, 0);
physicsWorld.addBody(platformBody2);



var groundBoxContactMaterial = new CANNON.ContactMaterial(
    groundBodyMaterial,
    playerBodyMaterial,
    {friction: 0, restitution: 0}
);
var groundSphereContactMaterial = new CANNON.ContactMaterial(
    groundBodyMaterial,
    sphereBodyMaterial,
    {restitution: 0.6}
);


physicsWorld.addContactMaterial(groundBoxContactMaterial);
physicsWorld.addContactMaterial(groundSphereContactMaterial);

var scene = new THREE.Scene();
var axesHelper = new THREE.AxesHelper(8);
scene.add(axesHelper);

var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true; //shadow
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


//LIGHTS
//attributes: color, brightness
var light = new THREE.DirectionalLight(0xffffff, 10);

light.position.z = 50;
light.position.y = 70;
light.position.x = 30;
light.castShadow = true; //shadow

var light2 = new THREE.AmbientLight(0xffffff);


light.shadow.camera.left = -100;
light.shadow.camera.right = 100;
light.shadow.camera.top = 100;
light.shadow.camera.bottom = -100;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;



// var controls = new OrbitControls(camera, renderer.domElement);


// //GEOMETRY
var geometry = new THREE.BoxGeometry(1, 1, 1);

// //MATERIALS
var material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

// // MeshBasicMaterial, no shadows work without light.
// // MeshPhongMaterial, shiny with shadows.
// // MeshLambertMaterial, matte material, no shiny.
// // MeshStandardMaterial, combination of shiny and matte. 

//MESH

var enemy = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
    }),
); 
enemy.castShadow = true;

var player = new THREE.Mesh(geometry, material);
player.castShadow = true; //shadow
 
var ground = new THREE.Mesh(
    new THREE.BoxGeometry(50, 50, .1), 
    new THREE.MeshStandardMaterial({ color: 0xffffff })
);
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    new THREE.MeshStandardMaterial({ 
        color: 0xffff00,
    }),
); 
sphere.castShadow = true; 
scene.add(sphere);

// ground.position.y = -0.5;
ground.receiveShadow = true; //shadow

// //ADD MESH
scene.add(player, ground, enemy);

// //ADD LIGHTS
scene.add(light, light2);


var cannonDebugger = new CannonDebugger(scene, physicsWorld, {color: 0xff0000});

var box;
var pivot = new THREE.Group();
var halfExtents = new CANNON.Vec3(1, 1, 1);
var gltfLoader = new GLTFLoader();
gltfLoader.load("model.gltf", (gltfScene)=>{
    box = gltfScene;
   gltfScene.scene.traverse(function(node){
    if ( node.isMesh ) {
         node.castShadow = true; 
    }
   })
    
    pivot.position.copy(playerBody.position);

    // Adjust the model's position relative to the pivot
    gltfScene.scene.position.set(0, -0.5, 0);

    // Add the model to the pivot group
    pivot.add(gltfScene.scene); 
    // Add the pivot group to the scene
    scene.add(pivot);
  
});

var originalAngularFactor;
var cameraOutTween = new TWEEN.Tween(camera).to({fov:100}, 200).easing(TWEEN.Easing.Quadratic.Out);

var delta;
//GAME RENDER
function renderGame() {
    
    // requestAnimationFrame(animate);

    cameraOutTween.update();
    // let directionVector = new CANNON.Vec3(0, 0, 1);
    // directionVector = playerBody.quaternion.vmult( directionVector );
    
    physicsWorld.step(timeStep);
    
    cannonDebugger.update();
    camera.updateProjectionMatrix();
    originalAngularFactor = playerBody.angularFactor.clone();

    var yAxis = new CANNON.Vec3(0, 1, 0);
    playerBody.quaternion.setFromAxisAngle(yAxis, -rotationX);

    const distance = 5; // Distance from the object
    const offsetX = Math.sin(-rotationX) * distance;
    const offsetY = Math.sin(rotationY) * distance;
    const offsetZ = Math.cos(-rotationX) * distance;
    camera.position.set(player.position.x + offsetX, player.position.y + offsetY + 2.5, player.position.z + offsetZ);
            
        
        if(keys.rightArrow){
            rotationX += rotationSpeed;
        }
        if(keys.leftArrow){
            rotationX -= rotationSpeed;
        }
        
        // if(keys.downArrow){
        //     //keys.s dash?
        // }
        // const keys.wVector = new CANNON.Vec3(0, 0, -1);
        //     playerBody.quaternion.vmult(keys.wVector, keys.wVector);

            // Apply forces based on keyboard input
        updateMovement();

        


        playerBody.fixedRotation = true;

        ground.position.copy(groundBody.position);
    ground.quaternion.copy(groundBody.quaternion);
    player.position.copy(playerBody.position);
    player.quaternion.copy(playerBody.quaternion);
    enemy.position.copy(enemyBody.position);
    enemy.quaternion.copy(enemyBody.quaternion);
    sphere.position.copy(sphereBody.position);
    sphere.quaternion.copy(sphereBody.quaternion);
    pivot.position.copy(crateBody.position);
    pivot.quaternion.copy(crateBody.quaternion);
    camera.lookAt(player.position);

    renderer.render(scene, camera);
    checkIfCanJump();
    playerBody.angularFactor.copy(originalAngularFactor);
}

var canJump = false;
function checkIfCanJump(){
     var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
  var upAxis = new CANNON.Vec3( 0, 1, 0 );
  playerBody.addEventListener( "collide", function (e) {
    playerBody.angularFactor.set(0, 0, 0);
   

    var contact = e.contact;

    // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
    // We do not yet know which one is which! Let's check.

    if ( contact.bi.id == playerBody.id ) {
      contact.ni.negate( contactNormal );
    } // bi is the player body, flip the contact normal
    else {
      contactNormal.copy( contact.ni ); // bi is something else. Keep the normal as it is
      
    }
// alert(contact.bi.id);
// alert(enemyBody.id)
if(contact.bi == enemyBody || contact.bj == enemyBody){
    playerBody.position.x = 0;
    playerBody.position.y = 1;
}
// if(left){
//     alert(contact.bi.id);
// alert(enemyBody.id);
// left = false;
// }
    // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
    if ( contactNormal.dot( upAxis ) > 0.5) {
      
      // Use a "good" threshold value between 0 and 1 here!
      canJump = true;
      
    }
    
    
  });
}
var rotationSpeed = 0.05;
const playerSpeed = 7;
var velocity;
var forwardVector;

async function updateMovement() {
    velocity = new THREE.Vector3();
    // Calculate the forward direction vector based on the object's orientation
    forwardVector = new THREE.Vector3(0, 0, -1);
    const quaternion = new THREE.Quaternion(playerBody.quaternion.x, playerBody.quaternion.y, playerBody.quaternion.z, playerBody.quaternion.w);
    forwardVector.applyQuaternion(quaternion);
var normalize = 1;
    if(keys.w && keys.a ||  keys.w && keys.d || keys.s && keys.a || keys.s && keys.d){
        normalize = Math.sqrt(playerSpeed*playerSpeed*2);
        normalize = normalize/2;
        normalize = normalize / playerSpeed;
    }
// consoleLog(playerStats.sprinting);
    if(!playerStats.sprinting){
        if (keys.w || keys.s) {
        if (keys.w) {
            velocity.add(forwardVector.clone().multiplyScalar(playerSpeed*normalize));
        }
        if (keys.s) {
            velocity.add(forwardVector.clone().multiplyScalar(-playerSpeed*normalize));
        }
    }

    if (keys.a || keys.d) {
        const rightVector = new THREE.Vector3(1, 0, 0);
        rightVector.applyQuaternion(quaternion);
        if (keys.a) {
            velocity.add(rightVector.clone().multiplyScalar(-playerSpeed*normalize));
        }
        if (keys.d) {
            velocity.add(rightVector.clone().multiplyScalar(playerSpeed*normalize));
        }
    }
    }

    
    if (canJump && playerStats.jumping){
        playerBody.velocity.y = 11;
        canJump = false;
    }
    if(playerStats.sprinting){
        velocity.add(forwardVector.clone().multiplyScalar(playerSpeed*6));
    }
    // alert(keys.upArrow);
    if(keys.upArrow && !playerStats.sprinting){
        playerStats.sprinting = true;
        // consoleLog("sprinted");
         if(camera.fov < 100) {
            cameraOutTween.start();
        }
        await downtime(210);
        playerStats.sprinting = false;
    }else if(camera.fov > 75 && !playerStats.sprinting && sprintNum > 0){
            cameraOutTween.stop();
            camera.fov -= 1.5;
            
 }
  
    // Set the velocity to the box body
    
    playerBody.velocity.set(velocity.x, playerBody.velocity.y, velocity.z);
}

let rotationX = 0, rotationY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        });



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
    if(event.key == " "){
        playerStats.jumping = true;
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
    if(event.key == " "){
        playerStats.jumping = false;
    }
});








//60FPS RENDER
var fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    // await downtime(1000);
    animate();
}

function animate(time) {
    requestAnimationFrame(animate);
    delta = time;
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        renderGame();
    }
}

startAnimating(60);

function consoleLog(text){
    document.getElementById("console").innerHTML = "> " + text + "<br>" + document.getElementById("console").innerHTML;
}