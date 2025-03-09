import * as THREE from 'three';
import racetrackUrl from './assets/racetrack.png'

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
const geometry = new THREE.BoxGeometry( 2, car_height, 3.5 );
const material = new THREE.MeshPhongMaterial({
  color: 0x00ff00,        // Base color (green)
  shininess: 100,         // How shiny the surface is
  specular: 0x222222      // Color of the specular highlight
});
const cube = new THREE.Mesh( geometry, material );
cube.position.y = car_height/2;
scene.add( cube );

// ground plane
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

// setup camera
camera.position.z = 5;
camera.position.y = 2;


var steering = 0;
var acceleration = 0;
var speed = 0;

var key_map = {87: false, 65: false, 83:false, 68: false};

// game loop
function animate() {
  renderer.render( scene, camera );

  for (var key in key_map) {
    if (key_map[key]) {
      console.log(key, key_map[key]);
      switch (key) {
        case "87": // W
          speed -= 0.01;
          console.log("power!")
          break;
        case "65": // A
          steering += 0.01;
          break;
        case "83": // S
          speed += 0.01;
          break;
        case "68": // D
          steering -= 0.01;
          break;
      }
    }
  }
  // limit steering
  steering = Math.max(steering, -0.02)
  steering = Math.min(steering, 0.02)

  speed += acceleration;
  speed *= 0.98
  cube.rotation.y += steering;
  steering *= 0.9

  // TODO: use nice vector math :D
  cube.position.x += speed * Math.sin(cube.rotation.y)
  cube.position.z += speed * Math.cos(cube.rotation.y)

  // cube.rotation.y += 0.01;
  camera.position.set( cube.position.x + 5 * Math.cos(-cube.rotation.y + (Math.PI/2)),
    cube.position.y + 2,
    cube.position.z + 5 * Math.sin(-cube.rotation.y + (Math.PI/2)) );
  camera.lookAt( cube.position.x, cube.position.y, cube.position.z );
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