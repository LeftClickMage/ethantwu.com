import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CANNON from "https://unpkg.com/cannon-es@0.20.0/dist/cannon-es.js";
import CannonDebugger from 'https://cdn.jsdelivr.net/npm/cannon-es-debugger@1.0.0/+esm';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

var physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -20.81, 0),
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

var boxBodyMaterial = new CANNON.Material();
var boxBody = new CANNON.Body({
    mass: 10,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
    material: boxBodyMaterial,
});
boxBody.angularDamping = 0.3;
boxBody.position.set(0, 10, 0);
physicsWorld.addBody(boxBody);

var platformBodyMaterial = new CANNON.Material();
var platformBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 2, 0.5)),
    material: platformBodyMaterial,
});
platformBody.position.set(20, 0, 0);
physicsWorld.addBody(platformBody);




var groundBoxContactMaterial = new CANNON.ContactMaterial(
    groundBodyMaterial,
    boxBodyMaterial,
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
// renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;
camera.position.y = 20;

//LIGHTS
//attributes: color, brightness
var light = new THREE.DirectionalLight(0xffffff, 10);
light.position.z = 10;
light.position.y = 10;
light.castShadow = true; //shadow

const d = 50;

light.shadow.camera.left = - d;
light.shadow.camera.right = d;
light.shadow.camera.top = d;
light.shadow.camera.bottom = - d;
light.shadow.mapSize.width = 2048*8;
light.shadow.mapSize.height = 2048*8;

// light.shadowMapWidth = 1024; // default is 512
// light.shadowMapHeight = 1024; // default is 512
//DirectionalLight, only 1 direction, points at something. 
//PointLight, one point of light that shines in all directions like a light bulb.
//SpotLight, focused directional Light
//AmbientLight, lights up whole scene.


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
var cube = new THREE.Mesh(geometry, material);
cube.castShadow = true; //shadow
 
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
scene.add(cube, ground);

// //ADD LIGHTS
scene.add(light);


var cannonDebugger = new CannonDebugger(scene, physicsWorld, {color: 0xff0000});
//GAME RENDER
function renderGame() {
    
    requestAnimationFrame(animate);

    // let directionVector = new CANNON.Vec3(0, 0, 1);
    // directionVector = boxBody.quaternion.vmult( directionVector );
    
    physicsWorld.step(timeStep);
    
    cannonDebugger.update();





    
    



            var yAxis = new CANNON.Vec3(0, 1, 0);
            boxBody.quaternion.setFromAxisAngle(yAxis, -rotationX);

    const distance = 5; // Distance from the object
            const offsetX = Math.sin(-rotationX) * distance;
            const offsetY = Math.sin(rotationY) * distance;
            const offsetZ = Math.cos(-rotationX) * distance;
            camera.position.set(cube.position.x + offsetX, cube.position.y + offsetY + 5, cube.position.z + offsetZ);
            

        
        if(arrowRightDown){
            rotationX += rotationSpeed;
        }
        if(arrowLeftDown){
            rotationX -= rotationSpeed;
        }
        if(arrowUpDown){
            rotationY -= rotationSpeed;
        }
        if(arrowDownDown){
            rotationY += rotationSpeed;
        }
        // const forwardVector = new CANNON.Vec3(0, 0, -1);
        //     boxBody.quaternion.vmult(forwardVector, forwardVector);

            // Apply forces based on keyboard input
        updateMovement();

        ground.position.copy(groundBody.position);
    ground.quaternion.copy(groundBody.quaternion);
    cube.position.copy(boxBody.position);
    cube.quaternion.copy(boxBody.quaternion);
    sphere.position.copy(sphereBody.position);
    sphere.quaternion.copy(sphereBody.quaternion);

    
    camera.lookAt(cube.position);
    renderer.render(scene, camera);
}
var rotationSpeed = 0.025;
const force = 5;

function updateMovement() {
    // Calculate the forward direction vector based on the object's orientation
    const forwardVector = new THREE.Vector3(0, 0, -1);
    const quaternion = new THREE.Quaternion(boxBody.quaternion.x, boxBody.quaternion.y, boxBody.quaternion.z, boxBody.quaternion.w);
    forwardVector.applyQuaternion(quaternion);

    const velocity = new THREE.Vector3();

    if (forward || back) {
        if (forward) {
            velocity.add(forwardVector.clone().multiplyScalar(force));
        }
        if (back) {
            velocity.add(forwardVector.clone().multiplyScalar(-force));
        }
    }

    if (left || right) {
        const rightVector = new THREE.Vector3(1, 0, 0);
        rightVector.applyQuaternion(quaternion);
        if (left) {
            velocity.add(rightVector.clone().multiplyScalar(-force));
        }
        if (right) {
            velocity.add(rightVector.clone().multiplyScalar(force));
        }
    }
    if (Math.abs(boxBody.velocity.y) < 0.1 && jumping){
        boxBody.velocity.y = 10;
    }

    // Set the velocity to the box body
    boxBody.velocity.set(velocity.x, boxBody.velocity.y, velocity.z);
}

let rotationX = 0, rotationY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = (event.clientY / window.innerHeight) * 2 - 1;
        });


var arrowRightDown = false;
var arrowLeftDown = false;
var arrowUpDown = false;
var arrowDownDown = false;
var jumping = false;

var forward = false;
var back = false;
var left = false;
var right = false;

addEventListener('keydown', function(event) {
    // alert(event.key)
    // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    if(event.key == "ArrowRight"){
        arrowRightDown = true;
    }
    if(event.key == "ArrowLeft"){
        arrowLeftDown = true;
    }
    if(event.key == "ArrowUp"){
        arrowUpDown = true;
    }
    if(event.key == "ArrowDown"){
        arrowDownDown = true;
    }
    if(event.key == "w"){
        // alert('test');
        forward = true;
    }
    if(event.key == "a"){
        left = true;
    }
    if(event.key == "s"){
        back = true;
    }
    if(event.key == "d"){
        right = true;
    }
    if(event.key == " "){
        jumping = true;
    }
});

addEventListener('keyup', function(event) {
    // "ArrowRight", "ArrowLeft", "ArrowUp", or "ArrowDown"
    if(event.key == "ArrowRight"){
        arrowRightDown = false;
    }
    if(event.key == "ArrowLeft"){
        arrowLeftDown = false;
    }
    if(event.key == "ArrowUp"){
        arrowUpDown = false;
    }
    if(event.key == "ArrowDown"){
        arrowDownDown = false;
    }
    if(event.key == "w"){
        forward = false;
    }
    if(event.key == "a"){
        left = false;
    }
    if(event.key == "s"){
        back = false;
    }
    if(event.key == "d"){
        right = false;
    }
    if(event.key == " "){
        jumping = false;
    }
});








//60FPS RENDER
var fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        renderGame();
    }
}
startAnimating(60);