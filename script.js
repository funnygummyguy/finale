// Scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Floor
const floorGeo = new THREE.PlaneGeometry(200, 200);
const floorMat = new THREE.MeshBasicMaterial({ color: 0x228B22 });
const floor = new THREE.Mesh(floorGeo, floorMat);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Walls
function wall(x, z) {
  const geo = new THREE.BoxGeometry(10, 10, 10);
  const mat = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, 5, z);
  scene.add(mesh);
}

wall(20, 0);
wall(20, 20);
wall(0, 20);
wall(-20, 10);
wall(-10, -30);

// Cat
const catGeo = new THREE.BoxGeometry(4, 4, 4);
const catMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
const cat = new THREE.Mesh(catGeo, catMat);
cat.position.set(
  (Math.random() - 0.5) * 80,
  2,
  (Math.random() - 0.5) * 80
);
scene.add(cat);

// Camera position
camera.position.set(0, 4, 50);
let velocityY = 0;
let isGrounded = true;

const speed = 0.5;
const gravity = 0.02;
const jumpForce = 0.4;

let keys = {};
document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

function updateMovement() {
  // Movement
  if (keys["w"] || keys["arrowup"]) camera.position.z -= speed;
  if (keys["s"] || keys["arrowdown"]) camera.position.z += speed;
  if (keys["a"] || keys["arrowleft"]) camera.position.x -= speed;
  if (keys["d"] || keys["arrowright"]) camera.position.x += speed;

  // Jump
  if ((keys[" "] || keys["space"]) && isGrounded) {
    velocityY = jumpForce;
    isGrounded = false;
  }

  camera.position.y += velocityY;
  velocityY -= gravity;

  if (camera.position.y < 4) {
    camera.position.y = 4;
    velocityY = 0;
    isGrounded = true;
  }
}

// Check if found cat
function checkCatFound() {
  if (camera.position.distanceTo(cat.position) < 5) {
    document.getElementById("message").innerText = "YOU FOUND THE CAT! 🐱";
  }
}

// Simple mouse look
let pitch = 0, yaw = 0;
document.addEventListener("mousemove", e => {
  yaw -= e.movementX * 0.002;
  pitch -= e.movementY * 0.002;
  if (pitch > Math.PI/2) pitch = Math.PI/2;
  if (pitch < -Math.PI/2) pitch = -Math.PI/2;
  camera.rotation.x = pitch;
  camera.rotation.y = yaw;
});

function animate() {
  updateMovement();
  checkCatFound();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
