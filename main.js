import './style.css';
import { setupColorButton, randomSceneLightColor, randomMaterialColor, 
  setupHelpButton, setupLightSphereToggleButton, setupResetCarColorsButton } from './colorbutton.js';
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
let cortinaColor = new THREE.Color(0xFFFF00);
let f100Color = new THREE.Color(0xFF0000);

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
renderer.shadowMap.autoUpdate = false;

const controls = new OrbitControls( camera, document.body );
if(!fullOrbitControl){
  controls.minPolarAngle = Math.PI * .1;
  controls.maxPolarAngle = Math.PI * .55;
  controls.maxDistance = 105;
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
        <button id="lightSphereToggleButton" type="button">LIGHT SPHERE TOGGLE</button>
        <button id="resetCarColorButton" type="button">RESET CAR COLORS</button>
        <button id="helpButton" type="button">HELP</button>
        <div id="helpContainer">
          <p>Hold Left Mouse Button and move Mouse or Swipe on Mobile to move camera around the scene.</p>
          <p>Mouse scroll wheel or 2-Finger pinch to zooms in/out.</p>
          <p>Click on individual lights or cars to change their color, or click CHANGE ALL LIGHTS button to change all lights to random colors</p>
        </div>
      </div>
    </div>
  `
  setupColorButton(document.querySelector('#colorButton'), lightMaterials, lights);
  setupHelpButton(document.querySelector('#helpButton'));
  setupLightSphereToggleButton(document.querySelector("#lightSphereToggleButton"), leftsphere, rightsphere);
  setupResetCarColorsButton(document.querySelector('#resetCarColorButton'), cortinaPaintMaterial, cortinaColor, f100PaintMaterial, f100Color);
  animate();
  renderer.shadowMap.needsUpdate = true;
  gsap.from(camera.position, {z: 45, duration: 1});
  gsap.from("#heading", {opacity: 0, duration: 1});
  gsap.from("#colorButton", {opacity: 0, duration: 1});
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

const rearpointLight = new THREE.PointLight(0xffffff,600,0,2);
rearpointLight.position.set(0,15,-119);
rearpointLight.castShadow = true;

const farRightPointLight = new THREE.PointLight(0xffffff,350,0,2.1);
farRightPointLight.position.set(98,0,0);
farRightPointLight.castShadow = true;

const farLeftPointLight = new THREE.PointLight(0xffffff,350,0,2.1);
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

const leftSphereMaterial = new THREE.MeshStandardMaterial({ name: "lightSphere", color: 0xffffff, emissive: 0x000000, roughness: 0.1, metalness: .9, fog: true });
const rightSphereMaterial = new THREE.MeshStandardMaterial({ name: "lightSphere", color: 0xffffff, emissive: 0x000000, roughness: 0.1, metalness: .9, fog: true });

const lightGlowMaterial = new THREE.MeshStandardMaterial({ name: "lightGlow", color: 0xffffff, emissive: 0xffffff, roughness: 0.1, metalness: .9, fog: true });
const f100PaintMaterial = new THREE.MeshStandardMaterial({ name: "f100Paint", color: f100Color, emissive: 0x000000, roughness: 0.1, metalness: .7, fog: true });
const cortinaPaintMaterial = new THREE.MeshStandardMaterial({ name: "cortinaPaint", color: cortinaColor, emissive: 0x000000, roughness: 0.1, metalness: .7, fog: true });
const metalBumperMaterial = new THREE.MeshStandardMaterial({ name: "metalBumperMaterial", color: 0xeeeeee, emissive: 0x000000, roughness: 0.1, metalness: .8, fog: true });
let windowMaterial = new THREE.MeshPhongMaterial({ name: "windowMaterial", opacity: 0.863, reflectivity: 1, shininess: 100 });
windowMaterial.color.r = 0.023;
windowMaterial.color.g = 0.023;
windowMaterial.color.b = 0.023;
const floorTexture = textureLoader.load ("./textures/Asphalt009_2K_Color.jpg");
const floorNormal = textureLoader.load ("./textures/Asphalt009_2K_Normal.jpg");
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(4,4);
floorNormal.wrapS = THREE.RepeatWrapping;
floorNormal.wrapT = THREE.RepeatWrapping;
floorNormal.repeat.set(4,4);
const floorMaterial = new THREE.MeshPhongMaterial({  map: floorTexture, normalMap: floorNormal, shininess: 0, reflectivity: 0.1 });
const wallTexture = textureLoader.load ("./textures/castle_brick_02_red_diff.jpg");
const wallNormal = textureLoader.load ("./textures/castle_brick_02_red_nor.jpg");
wallTexture.wrapS = THREE.RepeatWrapping;
wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set(4,4);
wallNormal.wrapS = THREE.RepeatWrapping;
wallNormal.wrapT = THREE.RepeatWrapping;
wallNormal.repeat.set(4,4);
const wallMaterial = new THREE.MeshPhongMaterial({ map: wallTexture, normalMap: wallNormal, shininess: 0, reflectivity: 0.1 });

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
  console.log(cortina);
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
  let tyreBrightness = 0.0005;
  let tyreShine = 5;
  fbxScene.children[0].children[0].material[0].color.r = tyreBrightness;
  fbxScene.children[0].children[0].material[0].color.g = tyreBrightness;
  fbxScene.children[0].children[0].material[0].color.b = tyreBrightness;
  fbxScene.children[0].children[0].material[0].shininess = tyreShine;
  fbxScene.children[0].children[0].material[1] = metalBumperMaterial;
  fbxScene.children[0].children[1].material[0].color.r = tyreBrightness;
  fbxScene.children[0].children[1].material[0].color.g = tyreBrightness;
  fbxScene.children[0].children[1].material[0].color.b = tyreBrightness;
  fbxScene.children[0].children[1].material[0].shininess = tyreShine;
  fbxScene.children[0].children[1].material[1] = metalBumperMaterial;
  fbxScene.children[0].children[2].material[1].color.r = tyreBrightness;
  fbxScene.children[0].children[2].material[1].color.g = tyreBrightness;
  fbxScene.children[0].children[2].material[1].color.b = tyreBrightness;
  fbxScene.children[0].children[2].material[1].shininess = tyreShine;
  fbxScene.children[0].children[2].material[0] = metalBumperMaterial;
  fbxScene.children[0].children[3].material[1].color.r = tyreBrightness;
  fbxScene.children[0].children[3].material[1].color.g = tyreBrightness;
  fbxScene.children[0].children[3].material[1].color.b = tyreBrightness;
  fbxScene.children[0].children[3].material[1].shininess = tyreShine;
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
// mouse event vars
let isSwiping = false;
const delta = 1.5;
let sogliaMove = 0;
let startX;
let startY;
let firstTouch = true;
let firstTime = true;
// device detection
let isMobile = false;

if (
  /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
    navigator.userAgent,
  )
  || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    navigator.userAgent.substr(0, 4),
  )
) {
  isMobile = true;
}

if (isMobile) {
  window.addEventListener('pointerdown', (event) => {
    firstTouch = true; 
    startX = event.pageX;
    startY = event.pageY;

    isSwiping = false;
  });
  window.addEventListener('pointermove', (event) => {
    if (firstTouch) {
      startX = event.pageX;
      startY = event.pageY;
      firstTouch = false;
    } else {
      const diffX = Math.abs(event.pageX - startX);
      const diffY = Math.abs(event.pageY - startY);
      if (diffX < delta && diffY < delta && sogliaMove > 2) {
        // sogliaMove>2 means 2 frame still when isSwiping is true
        onTouchClick(event); // for iOS  
      }
    }
    isSwiping = true; 
  });
  window.addEventListener('pointerup', (event) => {
    const diffX = Math.abs(event.pageX - startX);
    const diffY = Math.abs(event.pageY - startY);
    if (diffX < delta && diffY < delta) {
      onMouseClick(event); // Android old: is better desktop solution
    }
    firstTouch = true;
  });
} else {
  //desktop behavior
      window.addEventListener('pointerdown', (event) => {
        isSwiping = false;
        startX = event.pageX;
        startY = event.pageY;
      });
      window.addEventListener('pointermove', () => {
        isSwiping = true;
      });
  
      window.addEventListener('pointerup', (event) => {
        const diffX = Math.abs(event.pageX - startX);
        const diffY = Math.abs(event.pageY - startY);
  
        if (diffX < delta && diffY < delta) {
          onMouseClick(event);
        }
      });
    }
  

function onTouchClick(event){
  event.preventDefault();
  // Update mouse variable
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);
  
  if(firstTouch === false){
    firstTouch = true;
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
  }
};

function onMouseClick(event){
  event.preventDefault();
  if (!isSwiping) {
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
  }
  isSwiping = false;
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

// window.addEventListener('click', onMouseClick);
// window.addEventListener('ontouchstart', onMouseClick);
window.addEventListener('mousemove', onMouseMove);

gsap.from(".loadingHeading",{opacity: 0, duration: .5})

// Main Loop
function animate(){
  requestAnimationFrame(animate);

  renderer.render(scene,camera);
  controls.update();
}
