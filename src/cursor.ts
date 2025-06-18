interface TrailElement extends HTMLDivElement {
  className: string;
}

// Создаем переключатель
const createCursorToggle = () => {
  const toggle = document.createElement('div');
  toggle.className = 'cursor-toggle';
  
  const label = document.createElement('span');
  label.className = 'cursor-toggle-label';
  label.textContent = 'Кастомный курсор';
  
  const switchContainer = document.createElement('label');
  switchContainer.className = 'cursor-toggle-switch';
  
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = false;
  
  const slider = document.createElement('span');
  slider.className = 'cursor-toggle-slider';
  
  switchContainer.appendChild(input);
  switchContainer.appendChild(slider);
  toggle.appendChild(label);
  toggle.appendChild(switchContainer);
  
  document.body.appendChild(toggle);
  
  return input;
};

// Массив для хранения элементов следа
let trailElements: TrailElement[] = [];
const maxTrailLength: number = 80;
let lastX: number = 0;
let lastY: number = 0;
let isCustomCursorEnabled: boolean = false;

// Создаем переключатель и получаем ссылку на input
const cursorToggle = createCursorToggle();

// Добавляем начальный класс только если курсор включен
if (isCustomCursorEnabled) {
  document.body.classList.add('custom-cursor-enabled');
}

// Обработчик переключения
cursorToggle.addEventListener('change', (e: Event) => {
  const target = e.target as HTMLInputElement;
  isCustomCursorEnabled = target.checked;
  
  if (isCustomCursorEnabled) {
    document.body.classList.add('custom-cursor-enabled');
  } else {
    document.body.classList.remove('custom-cursor-enabled');
    // Удаляем все следы при выключении
    trailElements.forEach(trail => trail.remove());
    trailElements = [];
  }
});

// Обработчик движения мыши
document.addEventListener('mousemove', (e: MouseEvent) => {
  if (!isCustomCursorEnabled) return;
  
  // Создаем след
  if (Math.abs(e.clientX - lastX) > 1 || Math.abs(e.clientY - lastY) > 1) {
    const trail: TrailElement = document.createElement('div');
    trail.className = 'cursor';
    trail.style.left = `${e.clientX}px`;
    trail.style.top = `${e.clientY}px`;
    document.body.appendChild(trail);
    trailElements.push(trail);

    // Удаляем старые элементы следа
    if (trailElements.length > maxTrailLength) {
      const oldTrail = trailElements.shift();
      if (oldTrail) {
        oldTrail.remove();
      }
    }

    lastX = e.clientX;
    lastY = e.clientY;
  }
}); 