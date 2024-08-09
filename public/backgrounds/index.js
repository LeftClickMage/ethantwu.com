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

const particleMaterial = new THREE.PointsMaterial({ 
    size: 0.12,
    map: texture,
    transparent: true,
    color: "white",
}); 
const particleMaterialRed = new THREE.PointsMaterial({ 
    size: 0.12,
    map: texture,
    transparent: true,
    color: "#39FF14",
}); 
const particleMaterialBlue = new THREE.PointsMaterial({ 
    size: 0.12,
    map: texture,
    transparent: true,
    color: "#04D9FF",
}); 

var particlesMesh = new THREE.Points(particles, particleMaterial);
var particlesMeshRed = new THREE.Points(particlesRed, particleMaterialRed);
var particlesMeshBlue = new THREE.Points(particlesBlue, particleMaterialBlue);

scene.add(particlesMesh, particlesMeshRed, particlesMeshBlue);

var camera = new THREE.PerspectiveCamera(30, config.width / config.height);
scene.add(camera);
camera.position.z = 20;

var canvas = document.getElementById("overallBackground");
var render = new THREE.WebGLRenderer({canvas});
render.setSize(config.width, config.height);
render.render(scene, camera);
render.setClearColor(new THREE.Color('#000007'), 1);

var renderScene = new RenderPass(scene, camera);
var composer = new EffectComposer(render);
composer.addPass(renderScene);

var bloomPass = new UnrealBloomPass(new THREE.Vector2(config.width, config.height), 4, 0.3, 0.1);
composer.addPass(bloomPass);
render.toneMapping = THREE.CineonToneMapping;
render.toneMappingExposer = 3;

var clock = new THREE.Clock();

var stop = false;
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
        var elapsedTime = clock.getElapsedTime();
        
        composer.render();
        particlesMesh.rotation.y += -.1/200;
        particlesMeshRed.rotation.y +=  -.02/100;
        particlesMeshBlue.rotation.y +=  -.25/300;
        particlesMesh.rotation.x += -.1/200;
        particlesMeshRed.rotation.x +=  -.02/100;
        particlesMeshBlue.rotation.x +=  -.25/300; 

            config.width = window.innerWidth;
    config.height = window.innerHeight;

    camera.aspect = config.width / config.height;
    camera.updateProjectionMatrix();
    render.setSize(config.width, config.height);
    composer.setSize(config.width, config.height); 
    }
}
startAnimating(60);
