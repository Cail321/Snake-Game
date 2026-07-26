const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const corePath = path.join(__dirname, '..', 'game-core.js');
const coreSource = fs.readFileSync(corePath, 'utf8');
const sandbox = {};
vm.runInNewContext(coreSource, sandbox, { filename: corePath });
const { createSnakeGame } = sandbox.SnakeCore;

function createGame(options = {}) {
  return createSnakeGame({ random: () => 0, ...options });
}

function assertJsonEqual(actual, expected) {
  assert.equal(JSON.stringify(actual), JSON.stringify(expected));
}

test('moves the snake one grid cell per step', () => {
  const game = createGame({
    grid: { columns: 5, rows: 5 },
    initialSnake: [{ x: 1, y: 1 }, { x: 0, y: 1 }],
    initialDirection: { x: 1, y: 0 },
  });

  const result = game.moveOneStep();
  const state = game.getState();

  assert.equal(result.moved, true);
  assertJsonEqual(state.snake, [{ x: 2, y: 1 }, { x: 1, y: 1 }]);
});

test('rejects direct reverse input and limits rapid input to one turn per step', () => {
  const game = createGame({
    grid: { columns: 5, rows: 5 },
    initialSnake: [{ x: 2, y: 2 }, { x: 1, y: 2 }],
    initialDirection: { x: 1, y: 0 },
  });

  assert.equal(game.requestDirection({ x: -1, y: 0 }), false);
  assert.equal(game.requestDirection({ x: 0, y: -1 }), true);
  assert.equal(game.requestDirection({ x: -1, y: 0 }), false);
  game.moveOneStep();

  assertJsonEqual(game.getState().direction, { x: 0, y: -1 });
  assertJsonEqual(game.getState().snake[0], { x: 2, y: 1 });
});

test('generates an apple inside the board and outside the snake', () => {
  const game = createGame({
    grid: { columns: 4, rows: 3 },
    initialSnake: [{ x: 1, y: 1 }, { x: 0, y: 1 }],
  });
  const { apple, snake } = game.getState();

  assert.notEqual(apple, null);
  assert.ok(apple.x >= 0 && apple.x < 4);
  assert.ok(apple.y >= 0 && apple.y < 3);
  assert.equal(snake.some((segment) => segment.x === apple.x && segment.y === apple.y), false);
});

test('increments score, grows the snake, and respawns the apple after eating', () => {
  const game = createGame({
    grid: { columns: 5, rows: 2 },
    initialSnake: [{ x: 1, y: 0 }, { x: 0, y: 0 }],
    initialDirection: { x: 1, y: 0 },
  });

  const result = game.moveOneStep();
  const state = game.getState();

  assert.equal(result.ateApple, true);
  assert.equal(state.score, 1);
  assert.equal(state.snake.length, 3);
  assertJsonEqual(state.snake[0], { x: 2, y: 0 });
  assert.notEqual(state.apple, null);
  assert.equal(state.snake.some((segment) => segment.x === state.apple.x && segment.y === state.apple.y), false);
});

test('ends the game when the snake hits a wall', () => {
  const game = createGame({
    grid: { columns: 3, rows: 3 },
    initialSnake: [{ x: 2, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 1 }],
    initialDirection: { x: 1, y: 0 },
  });

  const result = game.moveOneStep();

  assert.equal(result.gameOver, true);
  assert.equal(game.getState().gameOver, true);
});

test('ends the game when the snake hits its body', () => {
  const game = createGame({
    grid: { columns: 4, rows: 4 },
    initialSnake: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    initialDirection: { x: 1, y: 0 },
  });

  const result = game.moveOneStep();

  assert.equal(result.gameOver, true);
  assert.equal(game.getState().gameOver, true);
});
