
const demo = document.getElementById('demoArea');
const speedSlider = document.getElementById('speedSlider');
const customText = document.getElementById('customText');
const clickSound = document.getElementById('clickSound');
let isDark = true;
let autoDemoInterval;

const allButtons = document.querySelectorAll('.controls button');

document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => clickSound.play());
});

function playAnimation(anim) {
  clearInterval(autoDemoInterval);
  clearActiveButtons();

  const currentButton = document.getElementById(`btn-${anim}`);
  if (currentButton) currentButton.classList.add('active');

  gsap.killTweensOf(demo);
  demo.style.opacity = 1;
  demo.style.transform = "none";

  const speed = speedSlider.value;

  const animations = {
    fadeIn: {opacity: 0, duration: speed},
    slideInLeft: {x: '-100%', opacity: 0, duration: speed},
    slideInRight: {x: '100%', opacity: 0, duration: speed},
    zoomIn: {scale: 0, opacity: 0, duration: speed},
    rotateIn: {rotation: 720, opacity: 0, duration: speed},
    bounce: {y: -100, opacity: 0, duration: speed, ease: "bounce.out"},
    flipInX: {rotationX: 720, opacity: 0, duration: speed},
    flipInY: {rotationY: 720, opacity: 0, duration: speed},
    neon: {scale: 1.2, duration: speed, repeat: -1, yoyo: true, ease: "power1.inOut"},
    elastic: {y: -500, duration: speed, ease: "elastic.out(1, 0.3)"}
  };

  if (animations[anim]) {
    gsap.from(demo, animations[anim]);
  }
}

function clearActiveButtons() {
  allButtons.forEach(btn => btn.classList.remove('active'));
}

function stopAnimations() {
  clearInterval(autoDemoInterval);
  gsap.killTweensOf(demo);
  demo.style.opacity = 1;
  demo.style.transform = "none";
  demo.innerText = customText.value || 'NailArt Pro';
  clearActiveButtons();
}

function startAutoDemo() {
  clearInterval(autoDemoInterval);
  const animations = ['fadeIn', 'slideInLeft', 'slideInRight', 'zoomIn', 'rotateIn', 'bounce', 'flipInX', 'flipInY', 'neon', 'elastic'];
  let index = 0;
  autoDemoInterval = setInterval(() => {
    playAnimation(animations[index]);
    index = (index + 1) % animations.length;
  }, 3000);
}

function toggleMode() {
  document.body.classList.toggle('dark-mode');
  document.body.classList.toggle('light-mode');
  isDark = !isDark;
}

function updateText() {
  demo.innerText = customText.value || 'NailArt Pro';
}

ScrollReveal().reveal('.sr', { delay: 200, distance: '50px', duration: 1000, easing: 'ease-out' });

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg'), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: 0xff0055, wireframe: true });
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
