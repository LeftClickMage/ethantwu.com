import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

camera.position.y = 150;
camera.position.z = 400;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
renderer.setClearColor(0x02CCFE, 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );

var light = new THREE.DirectionalLight(0xFFFFFF, 50);
light.position.y = 175;
light.position.z = 175;
light.position.x = 50;
light.castShadow = true;
scene.add(light);

increaseLightShadowRange(light, 2048);

var light2 = new THREE.AmbientLight(0xFFFFFF);
scene.add(light2);

var floor = {
    mesh: new THREE.Mesh(
        new THREE.BoxGeometry(215, 2, 454),
        new THREE.MeshStandardMaterial({
            color: 0x00430A,
        })    
    ),
    width: 215,
    height: 454,
} 

floor.mesh.receiveShadow = true;
scene.add( floor.mesh );


const controls = new OrbitControls( camera, renderer.domElement );


//Grass from CubePVP :D
var leavesMaterial = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    color: 0x00bc29,
    // map: texture,
});


const instanceNumber = 1000000;
const dummy = new THREE.Object3D();

const geometry = new THREE.PlaneGeometry(0.1, 0.2);
geometry.translate( 0, 0.1, 0 ); // move grass blade geometry lowest point at 0.


const grass = new THREE.InstancedMesh( geometry, leavesMaterial, instanceNumber );
grass.frustumCulled = true;
grass.castShadow = true;
grass.receiveShadow = true;

scene.add( grass );


for (let i = 0; i < instanceNumber; i++) {
  const x = Math.random()*215-215/2;
  const z = Math.random()*454-454/2;
  const height = 1;
  const rotationY = Math.random() * Math.PI;

  dummy.position.set(x, 0.9, z);
  dummy.scale.setScalar(height);
  dummy.rotation.y = rotationY;
  dummy.updateMatrix();
  
  grass.setMatrixAt(i, dummy.matrix);
}

//Water, Lake, Pond
createLakeSquare(134, 0);
createLakeSquare(133, 10);
createLakeSquare(130, 20);
createLakeSquare(129, 30);
createLakeSquare(128, 40);
createLakeSquare(126, 50);
createLakeSquare(125, 60);
createLakeSquare(124, 70);
createLakeSquare(122, 80);
createLakeSquare(121, 90);
createLakeSquare(120, 100);





function animate() {
	renderer.render( scene, camera );
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

//From CubePVP :D
function increaseLightShadowRange(light, shadowQuality){
    light.castShadow = true;
    light.shadow.camera.left = -216;
    light.shadow.camera.right = 216;
    light.shadow.camera.top = 200*3; //lol hehe
    light.shadow.camera.bottom = -200*3;
    light.shadow.mapSize.width = shadowQuality;
    light.shadow.mapSize.height = shadowQuality;
}
//From CubePVP 
document.onreadystatechange = async function () {
    if (document.readyState === 'complete') {
        if(window.location.hostname !== "localhost"){
            await downtime(1500);
        }
        document.getElementById("loadingPage").style.visibility = 'hidden';
        document.getElementById("loadingPage").style.display = 'none';
    } else {
        document.getElementById("loadingPage").style.visibility = 'visibile';
        document.getElementById("loadingPage").style.display = 'flex';
    }
}

//From CubePVP
var gltfLoader = new GLTFLoader();
function loadSprite(addMesh, path, height){
    var gltfLoader = new GLTFLoader();
    gltfLoader.load(path, (gltfScene)=>{
        gltfScene.scene.traverse(function(node){
            if ( node.isMesh ) {
                node.castShadow = true; 
                node.receiveShadow = true; 
            }
        })
        gltfScene.scene.scale.set(10, 10, 10);
        addMesh.add(gltfScene.scene); 
    });
}

function createLakeSquare(x, z){
    var lake = {
        mesh: new THREE.Group(),
    } 

    lake.mesh.position.set(floor.width/2-5-x, 1, floor.height/2-5-z)
    loadSprite(lake.mesh, "taylorParkWater.gltf", 0.1);
    scene.add(lake.mesh);
}