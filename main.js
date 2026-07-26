const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.querySelector('#mainMenu');
const readyPanel = document.querySelector('#readyPanel');
const systemStatus = document.querySelector('#systemStatus');
const modeStatus = document.querySelector('#modeStatus');
const startButton = document.querySelector('#startButton');
const backToMenuButton = document.querySelector('#backToMenuButton');

let state = 'menu';
const GRID = { columns: 20, rows: 13, cellSize: 40 };
const TICK_INTERVAL_MS = 150;
let snake = [];
let direction = { x: 1, y: 0 };
let elapsedSinceTick = 0;
let lastFrameTime = 0;

function drawFoundationBoard() {
  ctx.fillStyle = '#07130e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(140, 255, 176, .08)';
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += GRID.cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += GRID.cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function resetSnake() {
  snake = [
    { x: 10, y: 6 },
    { x: 9, y: 6 },
    { x: 8, y: 6 },
  ];
  direction = { x: 1, y: 0 };
  elapsedSinceTick = 0;
}

function moveSnakeOneStep() {
  const head = snake[0];
  const nextHead = {
    x: (head.x + direction.x + GRID.columns) % GRID.columns,
    y: (head.y + direction.y + GRID.rows) % GRID.rows,
  };
  snake = [nextHead, ...snake.slice(0, -1)];
}

function drawSnake() {
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#e8f37b' : '#8cffb0';
    ctx.fillRect(
      segment.x * GRID.cellSize + 4,
      segment.y * GRID.cellSize + 4,
      GRID.cellSize - 8,
      GRID.cellSize - 8,
    );
  });
}

function draw() {
  drawFoundationBoard();
  drawSnake();
}

function enterPlaySpace() {
  state = 'playing';
  resetSnake();
  mainMenu.classList.add('hidden');
  readyPanel.classList.remove('hidden');
  systemStatus.textContent = 'SNAKE ONLINE';
  modeStatus.textContent = 'MOVEMENT PREVIEW';
}

function returnToMenu() {
  state = 'menu';
  snake = [];
  readyPanel.classList.add('hidden');
  mainMenu.classList.remove('hidden');
  systemStatus.textContent = 'SYSTEM READY';
  modeStatus.textContent = 'MENU MODE';
}

function frame(timestamp) {
  const delta = Math.min(timestamp - lastFrameTime, 100);
  lastFrameTime = timestamp;
  if (state === 'playing') {
    elapsedSinceTick += delta;
    while (elapsedSinceTick >= TICK_INTERVAL_MS) {
      moveSnakeOneStep();
      elapsedSinceTick -= TICK_INTERVAL_MS;
    }
  }
  draw();
  requestAnimationFrame(frame);
}

startButton.addEventListener('click', enterPlaySpace);
backToMenuButton.addEventListener('click', returnToMenu);
requestAnimationFrame((timestamp) => {
  lastFrameTime = timestamp;
  frame(timestamp);
});
