import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.y = 400;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.setClearColor(0x02CCFE, 1);
document.body.appendChild( renderer.domElement );

var light = new THREE.DirectionalLight(0xFFFFFF, 50);
light.position.y = 10;
light.position.z = 10;
scene.add(light);

var light2 = new THREE.AmbientLight(0xFFFFFF);
scene.add(light2);

var floor = {
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(215, 2, 454),
        new THREE.MeshStandardMaterial({
            color: 0x00FF00
        })    
    )
} 

scene.add( floor.mesh );

camera.position.z = 5;


const controls = new OrbitControls( camera, renderer.domElement );

function animate() {


	renderer.render( scene, camera );

    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}