import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import racetrackUrl from './assets/racetrack.png'
import carUrl from './assets/car.glb'
import environmentUrl from './assets/enviroment_carpetracer.glb'
import OneTrackCar from "./onetrackmodel";

// setup scene and objects
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Add a directional light to simulate the sun
const sunLight = new THREE.DirectionalLight(0xffffff, 2); // White light with intensity 1
sunLight.position.set(5, 3, 5); // Position the light above and to the side
scene.add(sunLight);

// add car
const car_height = 1.7;
const loader = new GLTFLoader();

loader.load( carUrl, function ( gltf ) {
  car.add( gltf.scene );

}, undefined, function ( error ) {

  console.error( error );

} );
const geometry = new THREE.BoxGeometry( 0, 0, 0 );
const material = new THREE.MeshPhongMaterial({
  color: 0x00ff00,        // Base color (green)
  shininess: 100,         // How shiny the surface is
  specular: 0x222222,      // Color of the specular highlight
  opacity: 0.5,
  transparent: true,
});
const car = new THREE.Mesh( geometry, material );
car.position.y = 0;
scene.add( car );

// Create wheels
function createWheel(x){
  const childGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2);
  const childMaterial = new THREE.MeshBasicMaterial({ color: 0x000});
  const wheel = new THREE.Mesh(childGeometry, childMaterial);

  wheel.rotation.z = Math.PI/2 - 0.05;
  wheel.position.x = x;
  wheel.position.z = -2.3;
  wheel.position.y = 0.5;

  // Parent the wheel to the car
  car.add(wheel);
  return wheel
}

const left_wheel = createWheel(0.9)
const right_wheel = createWheel(-0.9)


// // ground plane
// Create checkerboard texture using canvas
const planeGeometry = new THREE.PlaneGeometry(150*1.5, 100*1.5); // 20x20 units
const textureLoader = new THREE.TextureLoader();
const planeMaterial = new THREE.MeshPhongMaterial({
  map: textureLoader.load(racetrackUrl),
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate to lie flat
plane.position.y = 0; // Place below the cube
scene.add(plane);

loader.load( environmentUrl, function ( gltf ) {
  scene.add( gltf.scene );
}, undefined, function ( error ) {

  console.error( error );

} );
// setup camera
camera.position.z = 5;
camera.position.y = 2;


var steering = 0;
var speed = 0;

const carPhysics = new OneTrackCar();

var key_map = {87: false, 65: false, 83:false, 68: false};

// game loop

let frames = 0, prevTime = performance.now();
function animate() {
  // FPS

  frames ++;
  const time = performance.now();

  if ( time >= prevTime + 1000 ) {

    console.log( Math.round( ( frames * 1000 ) / ( time - prevTime ) ) );

    frames = 0;
    prevTime = time;

  }

  renderer.render( scene, camera );

  for (var key in key_map) {
    if (key_map[key]) {
      switch (key) {
        case "87": // W
          speed -= 0.01;
          break;
        case "65": // A
          steering += 0.001;
          break;
        case "83": // S
          speed += 0.01;
          break;
        case "68": // D
          steering -= 0.001;
          break;
      }
    }
  }
  // limit steering
  steering = Math.max(steering, -0.02)
  steering = Math.min(steering, 0.02)

  speed *= 0.98 * (1 - Math.abs(steering ))
  car.rotation.y += steering;
  left_wheel.rotation.y = steering*25;
  right_wheel.rotation.y = steering*25;

  steering *= 0.95

  // TODO: use nice vector math :D
  car.position.x += speed * Math.sin(car.rotation.y)
  car.position.z += speed * Math.cos(car.rotation.y)

  // cube.rotation.y += 0.01;
  camera.position.set( car.position.x + 5 * Math.cos(-car.rotation.y + (Math.PI/2)),
    car.position.y + 4,
    car.position.z + 5 * Math.sin(-car.rotation.y + (Math.PI/2)) );
  camera.lookAt( car.position.x, car.position.y + 1, car.position.z );
}
renderer.setAnimationLoop( animate );

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 87: // W
    case 65: // A
    case 83: // S
    case 68: // D
      key_map[event.keyCode] = true;
      break;
  }
});

document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 87: // W
    case 65: // A
    case 83: // S
    case 68: // D
      key_map[event.keyCode] = false;
      break;
  }
});