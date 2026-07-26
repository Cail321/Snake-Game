const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const mainMenu = document.querySelector('#mainMenu');
const readyPanel = document.querySelector('#readyPanel');
const systemStatus = document.querySelector('#systemStatus');
const modeStatus = document.querySelector('#modeStatus');
const startButton = document.querySelector('#startButton');
const backToMenuButton = document.querySelector('#backToMenuButton');

let state = 'menu';

function drawFoundationBoard() {
  ctx.fillStyle = '#07130e';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(140, 255, 176, .08)';
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function enterPlaySpace() {
  state = 'ready';
  mainMenu.classList.add('hidden');
  readyPanel.classList.remove('hidden');
  systemStatus.textContent = 'PLAY SPACE READY';
  modeStatus.textContent = 'FOUNDATION MODE';
}

function returnToMenu() {
  state = 'menu';
  readyPanel.classList.add('hidden');
  mainMenu.classList.remove('hidden');
  systemStatus.textContent = 'SYSTEM READY';
  modeStatus.textContent = 'MENU MODE';
}

startButton.addEventListener('click', enterPlaySpace);
backToMenuButton.addEventListener('click', returnToMenu);
drawFoundationBoard();
