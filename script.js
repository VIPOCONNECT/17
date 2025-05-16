
const demo = document.getElementById('demoArea');
const speedSlider = document.getElementById('speedSlider');
let isDark = true;
let autoDemoInterval;

function playAnimation(anim) {
  gsap.killTweensOf(demo);
  demo.style.opacity = 1;
  demo.style.transform = "none";

  const speed = speedSlider.value;

  const animations = {
    fadeIn: {opacity: 0, duration: speed, y: 0},
    slideInLeft: {x: '-100%', opacity: 0, duration: speed},
    slideInRight: {x: '100%', opacity: 0, duration: speed},
    zoomIn: {scale: 0, opacity: 0, duration: speed},
    rotateIn: {rotation: 720, opacity: 0, duration: speed},
    bounce: {y: -100, opacity: 0, duration: speed, ease: "bounce.out"},
    flipInX: {rotationX: 720, opacity: 0, duration: speed},
    flipInY: {rotationY: 720, opacity: 0, duration: speed},
    neon: {scale: 1.2, duration: speed, repeat: -1, yoyo: true, ease: "power1.inOut", color: "#0ff"}
  };

  if (animations[anim]) {
    gsap.from(demo, animations[anim]);
  }
}

function startAutoDemo() {
  clearInterval(autoDemoInterval);
  const animations = ['fadeIn', 'slideInLeft', 'slideInRight', 'zoomIn', 'rotateIn', 'bounce', 'flipInX', 'flipInY', 'neon'];
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
