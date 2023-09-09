import './style.css';
import { setupColorButton, randomSceneLightColor, randomMaterialColor } from './colorbutton.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';
import { DecalGeometry } from 'three/addons/geometries/DecalGeometry.js';
import gsap from 'gsap';
import { randFloat } from 'three/src/math/MathUtils';

let fullOrbitControl = false;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let lightMaterials = [];
let lights = [];
let leftLamp, rightLamp, rearLamp;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010101);
scene.fog = new THREE.Fog(0xe0e0e0, 0.5, 1000);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(85);

const renderer = new THREE.WebGLRenderer({canvas: document.querySelector('#bg')});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls( camera, renderer.domElement );
if(!fullOrbitControl){
  controls.minPolarAngle = Math.PI * .1;
  controls.maxPolarAngle = Math.PI * .55;
  controls.maxDistance = 100;
  controls.minDistance = 40;
  controls.enablePan = false;
}
controls.update();


// Loading Manager
const loadingManager = new THREE.LoadingManager();
// add handler for TGA textures
loadingManager.addHandler( /\.tga$/i, new TGALoader() );

// Progress Bar
const progressBar = document.getElementById("progress-bar");
loadingManager.onProgress = function (url, loaded, total){
  progressBar.value = (loaded / total) * 100;
};

// After Loading Finished (Initialise)
const progressBarContainer = document.querySelector(".progress-bar-container");
loadingManager.onLoad = function(){
  progressBarContainer.style.display = 'none';
  
  document.querySelector('#app').innerHTML = `
    <div class="appContainer">
      <h1 id="heading">RaZ Garage</h1>
      <div class="card">
        <button id="colorButton" type="button"></button>
      </div>

    </div>
  `
  setupColorButton(document.querySelector('#colorButton'), lightMaterials, lights);
  animate();
};


//Lights
const leftpointLight = new THREE.PointLight(0xffffff,700,0,2.5);
leftpointLight.position.set(-30,16,-13);
leftpointLight.castShadow = true;

const rightpointLight = new THREE.PointLight(0xffffff,700,0,2.5);
rightpointLight.position.set(30,16,-13);
rightpointLight.castShadow = true;

const pointLight3 = new THREE.PointLight(0xffffff,150,0,2);
pointLight3.position.set(-18,-5,20);

const pointLight4 = new THREE.PointLight(0xffffff,150,0,2);
pointLight4.position.set(18,-5,20);

const rearpointLight = new THREE.PointLight(0xffffff,550,0,2);
rearpointLight.position.set(0,15,-119);
rearpointLight.castShadow = true;

const farRightPointLight = new THREE.PointLight(0xffffff,300,0,2.1);
farRightPointLight.position.set(98,0,0);
farRightPointLight.castShadow = true;

const farLeftPointLight = new THREE.PointLight(0xffffff,300,0,2.1);
farLeftPointLight.position.set(-98,0,0);
farLeftPointLight.castShadow = true;

const pointLightMouse = new THREE.PointLight(0xffffff,100,0,2.5);
pointLightMouse.position.set(0,-5,25);
pointLightMouse.castShadow = true;

const ambientLight = new THREE.AmbientLight(0xffffff,0.01);

lights.push(leftpointLight, rightpointLight, farLeftPointLight, farRightPointLight, rearpointLight);
scene.add(leftpointLight, rightpointLight, pointLight3, pointLight4, rearpointLight, pointLightMouse, ambientLight, farRightPointLight, farLeftPointLight);
//const lightHelp = new THREE.PointLightHelper(farRightPointLight);
//scene.add(lightHelp);


//Materials
const textureLoader = new THREE.TextureLoader(loadingManager);

//For environment map
// const cubeTextureloader = new THREE.CubeTextureLoader();
// const textureCube = cubeTextureloader.load( [ './textures/castle_brick_02_red_diff.jpg'
//   , './textures/castle_brick_02_red_diff.jpg', './textures/castle_brick_02_red_diff.jpg'
//   , './textures/castle_brick_02_red_diff.jpg', './textures/castle_brick_02_red_diff.jpg'
//   , './textures/castle_brick_02_red_diff.jpg' ] );

// textureCube.wrapS = THREE.RepeatWrapping;;
// textureCube.wrapT = THREE.RepeatWrapping;;
// textureCube.repeat.set(16,16);

let cortinaColor = 0xFFFF00;
let f100Color = 0xFF0000;

const leftSphereMaterial = new THREE.MeshStandardMaterial({ name: "lightSphere", color: 0xffffff, emissive: 0x000000, roughness: 0.1, metalness: .9, fog: true });
const rightSphereMaterial = new THREE.MeshStandardMaterial({ name: "lightSphere", color: 0xffffff, emissive: 0x000000, roughness: 0.1, metalness: .9, fog: true });

const lightGlowMaterial = new THREE.MeshStandardMaterial({ name: "lightGlow", color: 0xffffff, emissive: 0xffffff, roughness: 0.1, metalness: .9, fog: true });
const f100PaintMaterial = new THREE.MeshStandardMaterial({ name: "f100Paint", color: f100Color, emissive: 0x000000, roughness: 0.1, metalness: .7, fog: true });
const cortinaPaintMaterial = new THREE.MeshStandardMaterial({ name: "cortinaPaint", color: cortinaColor, emissive: 0x000000, roughness: 0.1, metalness: .7, fog: true });
const metalBumperMaterial = new THREE.MeshStandardMaterial({ name: "metalBumperMaterial", color: 0xeeeeee, emissive: 0x000000, roughness: 0.1, metalness: .8, fog: true });

const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x55555 });
const wallTexture = textureLoader.load ("./textures/castle_brick_02_red_diff.jpg");
const wallNormal = textureLoader.load ("./textures/castle_brick_02_red_nor.jpg");
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(4,4);
wallNormal.wrapS = THREE.RepeatWrapping;
wallNormal.wrapT = THREE.RepeatWrapping;
wallNormal.repeat.set(4,4);
const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture, shininess: 0, reflectivity: 0.1});
wallMaterial.normalMap = wallNormal;

const decalTexture = textureLoader.load ("./RaZLogo1.png");
const decalMaterial = new THREE.MeshPhongMaterial( {
  specular: 0x444444,
  map: decalTexture,
  normalMap: wallNormal,
  shininess: 30,
  transparent: true,
  depthTest: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: - 8,
  wireframe: false
} );

lightMaterials.push(leftSphereMaterial, rightSphereMaterial);

// Setup Meshes
const sphereGeometry = new THREE.SphereGeometry (4);
const planeGeomtry = new THREE.PlaneGeometry(220,220);
const carplaneGeomtry = new THREE.PlaneGeometry(52.2,19.7);
const leftsphere = new THREE.Mesh (sphereGeometry, leftSphereMaterial);
const rightsphere = new THREE.Mesh (sphereGeometry, rightSphereMaterial);
const floor = new THREE.Mesh (planeGeomtry, floorMaterial);
const rearWall = new THREE.Mesh(planeGeomtry, wallMaterial);
const leftWall = new THREE.Mesh(planeGeomtry, wallMaterial);
const rightWall = new THREE.Mesh(planeGeomtry, wallMaterial);
const cortinaPlane = new THREE.Mesh(carplaneGeomtry, floorMaterial);
const f100Plane = new THREE.Mesh(carplaneGeomtry, floorMaterial);

let decalPosition = new THREE.Vector3(0,0,0);
const decal = new THREE.Mesh( new DecalGeometry( rearWall, decalPosition, rearWall.rotation, new THREE.Vector3(125,125,50) ), decalMaterial );
decal.position.set(0,50,-126);

leftsphere.position.set(-30,21,-13);
leftsphere.name = "leftsphere";
rightsphere.position.set(30,21,-13);
rightsphere.name = "rightsphere";
floor.position.set(0,-20.25,-20.25);
floor.rotateX(Math.PI * -.5);
floor.receiveShadow = true;
floor.name = "floor";
rearWall.position.set(0,90,-126);
rearWall.name = "rearwall";
leftWall.rotateY(Math.PI /2);
leftWall.position.set(-110,89,-30);
leftWall.name = "leftwall";
rightWall.rotateY(Math.PI /-2);
rightWall.position.set(110,89,-20);
rightWall.name = "rightwall";
cortinaPlane.rotateX(Math.PI / 2);
cortinaPlane.rotateZ(Math.PI * -.31);
cortinaPlane.position.set(34.75,-15,-10);
cortinaPlane.castShadow = true;
f100Plane.scale.set(.605,1);
f100Plane.rotateX(Math.PI / 2);
f100Plane.rotateZ(Math.PI * .29);
f100Plane.position.set(-27.7,-16.25,0);
f100Plane.castShadow = true;
scene.add(leftsphere, rightsphere, floor, rearWall, leftWall, rightWall, cortinaPlane, f100Plane, decal);


//Load in FBX models
let cortina;
let windowMaterial;
const fbxLoader = new FBXLoader(loadingManager);
fbxLoader.load('./models/cortina/CortinaHIGHPOLY4threejs.fbx', (fbxScene) => {
  fbxScene.name = "cortina";
  fbxScene.children[0].name = "cortina";
  fbxScene.scale.set(2,2,2);
  fbxScene.position.set(35,-20,-10); //0,-20,-20 original pos
  fbxScene.rotation.set(0,-19.5,0);
  fbxScene.traverse( function(child){
    if(child.isMesh){
      child.castShadow = true;
    }
  })

  fbxScene.children[0].material[0] = cortinaPaintMaterial;
  fbxScene.children[0].material[3] = metalBumperMaterial;
  fbxScene.children[0].children[6].material = metalBumperMaterial;
  fbxScene.children[0].children[9].material = metalBumperMaterial;
  //Wheels
  fbxScene.children[0].children[0].material = metalBumperMaterial;
  fbxScene.children[0].children[0].children[1].material = metalBumperMaterial;
  fbxScene.children[0].children[1].material = metalBumperMaterial;
  fbxScene.children[0].children[1].children[1].material = metalBumperMaterial;
  fbxScene.children[0].children[2].material = metalBumperMaterial;
  fbxScene.children[0].children[2].children[0].material = metalBumperMaterial;
  fbxScene.children[0].children[3].material = metalBumperMaterial;
  fbxScene.children[0].children[3].children[1].material = metalBumperMaterial;

  //tireMaterial = fbxScene.children[0].children[1].children[0].material;
  fbxScene.children[0].material[4].shininess = 100;
  windowMaterial = fbxScene.children[0].material[4];
  // windowMaterial.envMap = textureCube;
  // windowMaterial.envMapIntensity = .05;
  cortina = fbxScene;
  scene.add(fbxScene);
});

var f100;
fbxLoader.load('./models/F100HighPolyRigForGame.fbx', (fbxScene) => {
  fbxScene.name = "f100";
  fbxScene.scale.set(3.4,3.4,3.4);
  fbxScene.position.set(-35,-8,-10); //0,-8,-20 same pos as corty
  fbxScene.rotation.set(0,19.5,0);
  fbxScene.traverse( function(child){
    if(child.isMesh){
      child.castShadow = true;
    }
  })

  fbxScene.children[0].scale.set(1,1,1);
  fbxScene.children[0].name = "f100";
  // Set Materials
  fbxScene.children[0].material[1] = metalBumperMaterial;
  fbxScene.children[0].material[2] = windowMaterial;
  fbxScene.children[0].material[3] = f100PaintMaterial;
  
  //Set darker tyres
  let tyreBrightness = 0.001;
  fbxScene.children[0].children[0].material[0].color.r = tyreBrightness;
  fbxScene.children[0].children[0].material[0].color.g = tyreBrightness;
  fbxScene.children[0].children[0].material[0].color.b = tyreBrightness;
  fbxScene.children[0].children[0].material[1] = metalBumperMaterial;
  fbxScene.children[0].children[1].material[0].color.r = tyreBrightness;
  fbxScene.children[0].children[1].material[0].color.g = tyreBrightness;
  fbxScene.children[0].children[1].material[0].color.b = tyreBrightness;
  fbxScene.children[0].children[1].material[1] = metalBumperMaterial;
  fbxScene.children[0].children[2].material[1].color.r = tyreBrightness;
  fbxScene.children[0].children[2].material[1].color.g = tyreBrightness;
  fbxScene.children[0].children[2].material[1].color.b = tyreBrightness;
  fbxScene.children[0].children[2].material[0] = metalBumperMaterial;
  fbxScene.children[0].children[3].material[1].color.r = tyreBrightness;
  fbxScene.children[0].children[3].material[1].color.g = tyreBrightness;
  fbxScene.children[0].children[3].material[1].color.b = tyreBrightness;
  fbxScene.children[0].children[3].material[0] = metalBumperMaterial;

  scene.add(fbxScene);
  f100 = fbxScene;
});


fbxLoader.load('./models/SM_Barrel.FBX', (fbxScene) => {
  fbxScene.scale.set(.17,.17,.17);
  fbxScene.position.set(0,-20,0);
  fbxScene.rotateX(Math.PI / -2);
  fbxScene.traverse(function(child){
    if(child.isMesh){
      child.castShadow = true;
    }
  });
  // Randomly place on both sides of the scene
  let barrel = fbxScene;
  const numBarrels = 5;
  for(let i=0; i<numBarrels; i++){
    let tempBarrel = barrel.clone();
    tempBarrel.position.set(99 - randFloat(-5,5), -20, -90 + (i*20) + randFloat(-5,5));
    scene.add(tempBarrel);
  }
  for(let i=0; i<numBarrels; i++){
    let tempBarrel = barrel.clone();
    tempBarrel.position.set(-99 + randFloat(-5,5), -20, -90 + (i*20) + randFloat(-5,5));
    scene.add(tempBarrel);
  }
});

fbxLoader.load('./models/SM_Table_1.FBX', (fbxScene) => {
  fbxScene.scale.set(.17,.37,.17);
  fbxScene.position.set(50,-20,-115);
  fbxScene.rotateX(Math.PI / -2);
  fbxScene.rotateZ(Math.PI / 2);
  fbxScene.traverse(function(child){
    if(child.isMesh){
      child.castShadow = true;
      child.material.color.setRGB(250,250,250);//(150,75,0);
    }
  });
  let table = fbxScene.clone();
  table.position.set(-50,-20,-115);
  scene.add(fbxScene, table);
});

fbxLoader.load('./models/SM_Lamp_1.FBX', (fbxScene) => {
  fbxScene.scale.set(.17,.17,.17);  
  fbxScene.children[0].material[0] = metalBumperMaterial;
  fbxScene.children[0].material[1] = lightGlowMaterial;
  fbxScene.children[0].name = "leftLamp";  
  
  leftLamp = fbxScene;
  rightLamp = fbxScene.clone();
  rearLamp = fbxScene.clone();

  leftLamp.position.set(-110,0,0);
  leftLamp.rotateZ(Math.PI / 2);
  
  rightLamp.children[0].name = "rightLamp";
  rightLamp.position.set(110,0,0);
  rightLamp.rotateZ(Math.PI / -2);
    
  rearLamp.children[0].name = "rearLamp";
  rearLamp.position.set(0,15,-126);
  rearLamp.rotateY(Math.PI / -2);
  rearLamp.rotateZ(Math.PI / 2);
  
  lightMaterials.push(leftLamp.children[0].material[1], rightLamp.children[0].material[1], rearLamp.children[0].material[1]);

  scene.add(leftLamp, rightLamp, rearLamp);
});

// Events
function onMouseClick(event){
  event.preventDefault();
  // Update mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);
  
  for (let i=0; i < intersects.length; i++){    
    if(intersects[i].object.name == "leftsphere"){
      randomSceneLightColor(intersects[i].object.material, leftpointLight);
    }
    else if(intersects[i].object.name == "rightsphere"){
      randomSceneLightColor(intersects[i].object.material, rightpointLight);
    }
    else if(intersects[i].object.name == "leftLamp"){
      randomSceneLightColor(intersects[i].object.material[1], farLeftPointLight);
    }
    else if(intersects[i].object.name == "rightLamp"){
      randomSceneLightColor(intersects[i].object.material[1], farRightPointLight);
    }
    else if(intersects[i].object.name == "rearLamp"){
      randomSceneLightColor(intersects[i].object.material[1], rearpointLight);
    }
    else if(intersects[i].object.name == "f100"){
      randomMaterialColor(f100PaintMaterial);
    }
    else if(intersects[i].object.name == "cortina"){
      randomMaterialColor(cortinaPaintMaterial);
    }
  }
};

function onMouseMove(event){
  // Update the mouse variable
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
 
  // Make the light follow the mouse
  var vector = new THREE.Vector3(mouse.x, mouse.y, .5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var distance = -camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));
   
  pointLightMouse.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z + 22));
};

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth,window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

window.addEventListener('click', onMouseClick);
window.addEventListener('ontouchstart', onMouseClick);
window.addEventListener('mousemove', onMouseMove);


// Main Loop
function animate(){
  requestAnimationFrame(animate);

  renderer.render(scene,camera);
  controls.update();
}
