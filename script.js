
let steps = [];
let dragSrcEl = null;

function showSection(sectionId) {
  document.querySelectorAll('section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(sectionId).classList.add('active');
}

function addStep() {
  const step = { id: Date.now(), animation: 'fadeIn', delay: 0, duration: 1 };
  steps.push(step);
  renderSteps();
  saveToLocal();
}

function renderSteps() {
  const stepsList = document.getElementById('stepsList');
  stepsList.innerHTML = '';
  steps.forEach((step, index) => {
    const li = document.createElement('li');
    li.setAttribute('draggable', true);
    li.dataset.id = step.id;
    li.innerHTML = `שלב ${index + 1}: 
      <select onchange="updateStep(${step.id}, 'animation', this.value)">
        <option value="fadeIn" ${step.animation === 'fadeIn' ? 'selected' : ''}>Fade In</option>
        <option value="slideInLeft" ${step.animation === 'slideInLeft' ? 'selected' : ''}>Slide Left</option>
        <option value="zoomIn" ${step.animation === 'zoomIn' ? 'selected' : ''}>Zoom In</option>
        <option value="fadeOut" ${step.animation === 'fadeOut' ? 'selected' : ''}>Fade Out</option>
      </select>
      <input type="number" min="0" step="0.1" value="${step.delay}" onchange="updateStep(${step.id}, 'delay', this.value)"> עיכוב
      <input type="number" min="0.1" step="0.1" value="${step.duration}" onchange="updateStep(${step.id}, 'duration', this.value)"> משך
      <button onclick="removeStep(${step.id})">X</button>
    `;
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
    li.addEventListener('dragend', handleDragEnd);
    stepsList.appendChild(li);
  });
}

function updateStep(id, field, value) {
  const step = steps.find(s => s.id === id);
  if (step) {
    step[field] = field === 'delay' || field === 'duration' ? parseFloat(value) : value;
    saveToLocal();
  }
}

function removeStep(id) {
  steps = steps.filter(s => s.id !== id);
  renderSteps();
  saveToLocal();
}

function handleDragStart(e) {
  dragSrcEl = this;
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop(e) {
  if (dragSrcEl !== this) {
    const srcIndex = Array.from(dragSrcEl.parentNode.children).indexOf(dragSrcEl);
    const tgtIndex = Array.from(this.parentNode.children).indexOf(this);
    const movedItem = steps.splice(srcIndex, 1)[0];
    steps.splice(tgtIndex, 0, movedItem);
    renderSteps();
    saveToLocal();
  }
}

function handleDragEnd() {
  dragSrcEl = null;
}

function playSequence() {
  const box = document.getElementById('previewBox');
  gsap.killTweensOf(box);
  box.style.opacity = 1;
  box.style.transform = "none";
  let timeline = gsap.timeline();
  steps.forEach(step => {
    const anim = getAnimationParams(step.animation);
    timeline.from(box, { ...anim, delay: step.delay, duration: step.duration });
  });
}

function getAnimationParams(type) {
  const animations = {
    fadeIn: { opacity: 0 },
    slideInLeft: { x: '-100%', opacity: 0 },
    zoomIn: { scale: 0, opacity: 0 },
    fadeOut: { opacity: 1 }
  };
  return animations[type] || {};
}

function exportSequence() {
  let code = `gsap.timeline()
`;
  steps.forEach(step => {
    const anim = getAnimationParams(step.animation);
    let params = [];
    for (let key in anim) params.push(`${key}: ${typeof anim[key] === 'string' ? `'${anim[key]}'` : anim[key]}`);
    params.push(`delay: ${step.delay}`);
    params.push(`duration: ${step.duration}`);
    code += `.from('#element', { ${params.join(', ')} })
`;
  });
  document.getElementById('exportedCode').value = code;
}

function saveToLocal() {
  localStorage.setItem('sequenceProject', JSON.stringify(steps));
}

function loadProject() {
  const data = localStorage.getItem('sequenceProject');
  if (data) {
    steps = JSON.parse(data);
    renderSteps();
  }
}

function saveProject() {
  const blob = new Blob([JSON.stringify(steps)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'project.json';
  a.click();
}

function deleteProject() {
  localStorage.removeItem('sequenceProject');
  steps = [];
  renderSteps();
}

function importProject(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      steps = JSON.parse(e.target.result);
      renderSteps();
      saveToLocal();
    } catch (err) {
      alert('קובץ לא תקין');
    }
  };
  reader.readAsText(file);
}

function updateLiveText() {
  const text = document.getElementById('liveText').value;
  const size = document.getElementById('fontSize').value;
  const color = document.getElementById('fontColor').value;
  const box = document.getElementById('previewBox');
  box.textContent = text;
  box.style.fontSize = size + 'px';
  box.style.color = color;
}

window.addEventListener('load', loadProject);
