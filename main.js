const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.querySelector('#mainMenu');
const systemStatus = document.querySelector('#systemStatus');
const modeStatus = document.querySelector('#modeStatus');
const scoreValue = document.querySelector('#scoreValue');
const startButton = document.querySelector('#startButton');
const gameOverPanel = document.querySelector('#gameOverPanel');
const finalScore = document.querySelector('#finalScore');
const restartButton = document.querySelector('#restartButton');
const gameOverMenuButton = document.querySelector('#gameOverMenuButton');

let state = 'menu';
const GRID = { columns: 20, rows: 13, cellSize: 40 };
const game = SnakeCore.createSnakeGame({
  grid: { columns: GRID.columns, rows: GRID.rows },
});
const TICK_INTERVAL_MS = 150;
let elapsedSinceTick = 0;
let lastFrameTime = 0;

function drawFoundationBoard() {
  ctx.fillStyle = '#07130e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const glow = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 30, canvas.width / 2, canvas.height / 2, canvas.width * .7);
  glow.addColorStop(0, 'rgba(34, 93, 58, .26)');
  glow.addColorStop(1, 'rgba(3, 13, 8, .08)');
  ctx.fillStyle = glow;
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
  ctx.strokeStyle = 'rgba(140, 255, 176, .22)';
  ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
}

function resetSnake() {
  game.reset();
  elapsedSinceTick = 0;
  updateScore();
}

function updateScore() {
  scoreValue.textContent = String(game.getState().score).padStart(3, '0');
}

function handleDirectionKey(event) {
  const key = event.key.toLowerCase();
  const directions = {
    w: { x: 0, y: -1 },
    arrowup: { x: 0, y: -1 },
    s: { x: 0, y: 1 },
    arrowdown: { x: 0, y: 1 },
    a: { x: -1, y: 0 },
    arrowleft: { x: -1, y: 0 },
    d: { x: 1, y: 0 },
    arrowright: { x: 1, y: 0 },
  };
  const nextDirection = directions[key];
  if (!nextDirection) return;
  if (state !== 'playing') return;
  event.preventDefault();
  game.requestDirection(nextDirection);
}

function endGame() {
  state = 'gameover';
  gameOverPanel.classList.remove('hidden');
  finalScore.textContent = String(game.getState().score).padStart(3, '0');
  systemStatus.textContent = 'RUN COMPLETE';
  modeStatus.textContent = 'GAME OVER';
}

function moveSnakeOneStep() {
  const result = game.moveOneStep();
  if (result.gameOver) endGame();
  if (result.ateApple) updateScore();
}

function drawSnake() {
  const { snake, direction } = game.getState();
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#e8f37b' : '#8cffb0';
    ctx.shadowColor = index === 0 ? 'rgba(232, 243, 123, .8)' : 'rgba(140, 255, 176, .35)';
    ctx.shadowBlur = index === 0 ? 16 : 7;
    ctx.fillRect(
      segment.x * GRID.cellSize + 4,
      segment.y * GRID.cellSize + 4,
      GRID.cellSize - 8,
      GRID.cellSize - 8,
    );
    ctx.shadowBlur = 0;
    if (index === 0) {
      ctx.fillStyle = '#07130e';
      const eyeOffsetX = direction.x === 0 ? 10 : direction.x > 0 ? 24 : 9;
      const eyeOffsetY = direction.y === 0 ? 10 : direction.y > 0 ? 24 : 9;
      ctx.fillRect(segment.x * GRID.cellSize + eyeOffsetX, segment.y * GRID.cellSize + eyeOffsetY, 4, 4);
    }
  });
}

function drawApple() {
  const { apple } = game.getState();
  if (!apple) return;
  const pulse = 1 + Math.sin(performance.now() / 180) * .1;
  ctx.fillStyle = '#ff7b78';
  ctx.shadowColor = 'rgba(255, 123, 120, .8)';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(
    apple.x * GRID.cellSize + GRID.cellSize / 2,
    apple.y * GRID.cellSize + GRID.cellSize / 2,
    GRID.cellSize * .27 * pulse,
    0,
    Math.PI * 2,
  );
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#e8f37b';
  ctx.fillRect(apple.x * GRID.cellSize + 24, apple.y * GRID.cellSize + 8, 7, 4);
}

function draw() {
  drawFoundationBoard();
  drawApple();
  drawSnake();
}

function enterPlaySpace() {
  state = 'playing';
  resetSnake();
  mainMenu.classList.add('hidden');
  gameOverPanel.classList.add('hidden');
  systemStatus.textContent = 'SNAKE ONLINE';
  modeStatus.textContent = 'LIVE RUN · 150MS';
}

function returnToMenu() {
  state = 'menu';
  game.clear();
  updateScore();
  gameOverPanel.classList.add('hidden');
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
restartButton.addEventListener('click', enterPlaySpace);
gameOverMenuButton.addEventListener('click', returnToMenu);
document.addEventListener('keydown', handleDirectionKey);
requestAnimationFrame((timestamp) => {
  lastFrameTime = timestamp;
  frame(timestamp);
});
