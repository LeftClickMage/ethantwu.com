import * as THREE from 'three';
import {RenderPass} from "three/addons/postprocessing/RenderPass";
import {EffectComposer} from "three/addons/postprocessing/EffectComposer";
import {UnrealBloomPass} from "three/addons/postprocessing/UnrealBloomPass";

var scene = new THREE.Scene();
var config = {
    width: window.innerWidth,
    height: window.innerHeight,
}
var loader = new THREE.TextureLoader();
var texture = loader.load(penguinPath + "public/backgrounds/testStar.png");

const geometry = new THREE.SphereGeometry( 3, 64, 64); 

const particles = new THREE.BufferGeometry;
const particlesRed = new THREE.BufferGeometry;
const particlesBlue = new THREE.BufferGeometry;
var particleCount = 5000;
var particleCountRed = 800;
var posArray = new Float32Array(particleCount*3);
var posArrayRed = new Float32Array(particleCountRed*3);
var posArrayBlue = new Float32Array(particleCountRed*3);

for(let i =0; i<particleCount * 3; i++){
  posArray[i] = (Math.random() - 0.5)*20;
}
for(let i =0; i<particleCountRed * 3; i++){
  posArrayRed[i] = (Math.random() - 0.5)*20;
  posArrayBlue[i] = (Math.random() - 0.5)*20;
}

particles.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
particlesRed.setAttribute("position", new THREE.BufferAttribute(posArrayRed, 3));
particlesBlue.setAttribute("position", new THREE.BufferAttribute(posArrayBlue, 3));

const material = new THREE.PointsMaterial({ 
    size: 0.1,
}); 

const particleMaterial = new THREE.PointsMaterial({ 
    size: 0.1,
    map: texture,
    transparent: true,
    color: "white",
}); 
const particleMaterialRed = new THREE.PointsMaterial({ 
    size: 0.1,
    map: texture,
    transparent: true,
    color: "#39FF14",
}); 
const particleMaterialBlue = new THREE.PointsMaterial({ 
    size: 0.1,
    map: texture,
    transparent: true,
    color: "#04D9FF",
}); 
const sphere = new THREE.Points( geometry, material );  
sphere.position.z = -20;

var particlesMesh = new THREE.Points(particles, particleMaterial);
var particlesMeshRed = new THREE.Points(particlesRed, particleMaterialRed);
var particlesMeshBlue = new THREE.Points(particlesBlue, particleMaterialBlue);


scene.add(particlesMesh, particlesMeshRed, particlesMeshBlue);



var camera = new THREE.PerspectiveCamera(30, config.width / config.height);

// camera.rotation.x = -0.5;
scene.add(camera);


// const controls = new OrbitControls(camera, render.domElement);

var light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(5, 5, 5);
scene.add(light);

var light2 = new THREE.PointLight(0xffffff, 1, 100);
light2.position.set(0, 40, -50);
scene.add(light2);

var canvas = document.getElementById("overallBackground");
var render = new THREE.WebGLRenderer({canvas});
render.setSize(config.width, config.height);
render.render(scene, camera);
render.setClearColor(new THREE.Color('#010b19'), 1);


var renderScene = new RenderPass(scene, camera);
var composer = new EffectComposer(render);
composer.addPass(renderScene);

var bloomPass = new UnrealBloomPass(new THREE.Vector2(config.width, config.height), 1.6, 0.5, 0.1);
composer.addPass(bloomPass);
render.toneMapping = THREE.CineonToneMapping;
render.toneMappingExposer = 3;


var mouseXPrev = 0;

var clock = new THREE.Clock();
window.addEventListener("mousemove", animateParticles);
var mouseX = 0;
var mouseY = 0;
function animateParticles(event){
  mouseY = event.clientY;
  mouseX = event.clientX;
}

var stop = false;
var fps, fpsInterval, startTime, now, then, elapsed;


// initialize the timer variables and start the animation

function startAnimating(fps) {
    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}


function animate() {

    // request another frame

    requestAnimationFrame(animate);

    // calc elapsed time since last loop

    now = Date.now();
    elapsed = now - then;

    // if enough time has elapsed, draw the next frame

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but also adjust for your
        // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
        then = now - (elapsed % fpsInterval);

       camera.position.z = 20;
  // sphere.position.z += 0.5;
  // alert('test');
  var elapsedTime = clock.getElapsedTime();
    config.width = window.innerWidth;
    config.height = window.innerHeight;

    // render.render(scene, camera);
    composer.render();


particlesMesh.rotation.y += -.1/200;
particlesMeshRed.rotation.y +=  -.02/100;
particlesMeshBlue.rotation.y +=  -.25/300;
particlesMesh.rotation.x += -.1/200;
particlesMeshRed.rotation.x +=  -.02/100;
particlesMeshBlue.rotation.x +=  -.25/300;
// particlesMesh.rotation.x =  (elapsedTime * -.1/2);
// particlesMeshRed.rotation.x =  (elapsedTime * -.02);
// particlesMeshBlue.rotation.x =  (elapsedTime * -.25/3);

//     if(mouseX>0){
//       particlesMesh.rotation.x = -(mouseY);
//       particlesMesh.rotation.y = -(mouseX);
//       particlesMeshRed.rotation.x = -(mouseY);
//       particlesMeshRed.rotation.y = -(mouseX);
//       particlesMeshBlue.rotation.x = -(mouseY);
//       particlesMeshBlue.rotation.y = -(mouseX);
//     } 
// //       // particlesMesh.rotation.y += 0.01;
    
      
      
    camera.aspect = config.width/config.height;
    camera.updateProjectionMatrix();
    render.setSize(config.width, config.height);
    
    }
}
startAnimating(60);