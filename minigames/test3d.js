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
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 0.5)),
            material: new CANNON.Material(),
            position: new CANNON.Vec3(20, 1.5, 0)
        })
    },
    {
        // mesh:
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 0.5)),
            material: new CANNON.Material(),
            position: new CANNON.Vec3(17, 3, 0)
        })
    },
];
physicsWorld.addBody(platform[0].body);
physicsWorld.addBody(platform[1].body);

var enemy = {
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ 
            color: 0xff0000,
        }),
    ),
    body: new CANNON.Body({
        mass: 10,
        shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        angularDamping: 0.9,
        linearDamping: 0.9,
        position: new CANNON.Vec3(10, 1, 10),
    }),
}
enemy.mesh.castShadow = true;
addToWorld(enemy);


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
    sprintingTimer: 0,
    speed: 7,
    canJump: false,
    lookSpeed: 0.05,
}
player.mesh.castShadow = true; //shadow
addToWorld(player);


var ground = {
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(50, 50, .1), 
        new THREE.MeshStandardMaterial({ color: 0xffffff })
    ),
    body: new CANNON.Body({
        type: CANNON.Body.STATIC, 
        shape: new CANNON.Box(new CANNON.Vec3(25, 25, 0.05)),
        material: new CANNON.Material(),   
    }),
}
ground.mesh.receiveShadow = true;
ground.body.quaternion.setFromEuler(-Math.PI/2, 0, 0);
addToWorld(ground);


var walls = [
    {
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(25, 5, 0.5)),
            material: new CANNON.Material(),   
            position: new CANNON.Vec3(0, 0, -25)
        }),
    },
    {
        body: new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Box(new CANNON.Vec3(25, 5, 0.5)),
            material: new CANNON.Material(),   
            position: new CANNON.Vec3(25, 0, 0)
        }),
    },
    {
        body: new CANNON.Body({
            type: CANNON.Body.STATIC, 
            shape: new CANNON.Box(new CANNON.Vec3(25, 5, 0.5)),
            material: new CANNON.Material(),   
            position: new CANNON.Vec3(0, 0, 25)
        }),
    },
    {
        body: new CANNON.Body({
            type: CANNON.Body.STATIC, 
            shape: new CANNON.Box(new CANNON.Vec3(25, 5, 0.5)),
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
    player.sprinting = false;
    // consoleLog("complete" + player.sprinting);
});















//// GAME RENDER ////
function renderGame() {
    
    
    physicsWorld.step(timeStep);
    
    cannonDebugger.update();

    originalAngularFactor = player.body.angularFactor.clone();

    
    player.body.quaternion.setFromAxisAngle(yAxis, -rotationX);

    setCameraPosition(5);
    updateMovement();
    camera.updateProjectionMatrix();

    ground.mesh.position.copy(ground.body.position);
    ground.mesh.quaternion.copy(ground.body.quaternion);
    player.mesh.position.copy(player.body.position);
    player.mesh.quaternion.copy(player.body.quaternion);
    enemy.mesh.position.copy(enemy.body.position);
    enemy.mesh.quaternion.copy(enemy.body.quaternion);
    sphere.mesh.position.copy(sphere.body.position);
    sphere.mesh.quaternion.copy(sphere.body.quaternion);
    crate.mesh.position.copy(crate.body.position);
    crate.mesh.quaternion.copy(crate.body.quaternion);
    camera.lookAt(player.mesh.position);
    
    renderer.render(scene, camera);

    player.body.angularFactor.copy(originalAngularFactor);
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
        const rightVector = new THREE.Vector3(1, 0, 0);
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
        velocity.add(forwardVector.clone().multiplyScalar(player.speed*6));
    }
    // alert(keys.upArrow);
    if(keys.upArrow && !player.sprinting){
        player.sprinting = true;
        cameraOutTween.start();
        // // consoleLog("sprinted");
        //  if(camera.fov < 100) {
        //     cameraOutTween.start();
        // }
    }else if(camera.fov > 75 && !player.sprinting){
            cameraOutTween.stop();
            camera.fov -= 1.5;
 }
  
    // Set the velocity to the box body
    
    player.body.velocity.set(velocity.x, player.body.velocity.y, velocity.z);
}















//// EXTRA FUNCTIONS ////
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
        if(contact.bi == enemy.body || contact.bj == enemy.body){
            player.body.position.x = 0;
            player.body.position.y = 1;
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
    document.getElementById("console").innerHTML = "> " + text + "<br>" + document.getElementById("console").innerHTML;
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
    if(event.key == " "){
        player.jumping = false;
    }
});