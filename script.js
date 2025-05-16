
let favorites = [];

function previewAnimation() {
  const box = document.getElementById('previewBox');
  const animType = document.getElementById('animationType').value;
  const speed = parseFloat(document.getElementById('animationSpeed').value);
  const delay = parseFloat(document.getElementById('animationDelay').value);
  const repeat = parseInt(document.getElementById('animationRepeat').value);

  gsap.killTweensOf(box);
  box.style.opacity = 1;
  box.style.transform = "none";

  const animations = {
    fadeIn: { opacity: 0 },
    slideInLeft: { x: '-100%', opacity: 0 },
    zoomIn: { scale: 0, opacity: 0 },
    fadeOut: { opacity: 1 },
    zoomOut: { scale: 1.5, opacity: 0 },
    pulse: { scale: 1.1, yoyo: true, repeat: repeat === -1 ? -1 : 1 }
  };

  gsap.from(box, {
    ...animations[animType],
    delay: delay,
    duration: speed,
    repeat: repeat === -1 ? -1 : repeat,
    yoyo: repeat !== 0
  });
}

function saveFavorite() {
  const animType = document.getElementById('animationType').value;
  const speed = document.getElementById('animationSpeed').value;
  const delay = document.getElementById('animationDelay').value;
  const repeat = document.getElementById('animationRepeat').value;

  const favorite = {
    animType,
    speed,
    delay,
    repeat
  };

  favorites.push(favorite);
  renderFavorites();
}

function renderFavorites() {
  const list = document.getElementById('favoritesList');
  list.innerHTML = '';

  favorites.forEach((fav, index) => {
    const li = document.createElement('li');
    li.textContent = `${fav.animType} | מהירות: ${fav.speed}s | עיכוב: ${fav.delay}s | חזרות: ${fav.repeat}`;
    li.onclick = () => loadFavorite(fav);
    list.appendChild(li);
  });
}

function loadFavorite(fav) {
  document.getElementById('animationType').value = fav.animType;
  document.getElementById('animationSpeed').value = fav.speed;
  document.getElementById('animationDelay').value = fav.delay;
  document.getElementById('animationRepeat').value = fav.repeat;

  previewAnimation();
}

function exportAnimation() {
  const animType = document.getElementById('animationType').value;
  const speed = document.getElementById('animationSpeed').value;
  const delay = document.getElementById('animationDelay').value;
  const repeat = document.getElementById('animationRepeat').value;

  const code = `
gsap.from('#element', {
  ${animType === 'pulse' ? 'scale: 1.1,' : animType === 'zoomIn' ? 'scale: 0,' : ''}
  ${animType === 'slideInLeft' ? "x: '-100%'," : ''}
  ${animType === 'fadeIn' || animType === 'fadeOut' ? 'opacity: 0,' : ''}
  delay: ${delay},
  duration: ${speed},
  repeat: ${repeat},
  yoyo: ${repeat !== '0'}
});
  `;

  document.getElementById('exportedCode').value = code.trim();
}
