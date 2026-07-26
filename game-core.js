(function exposeSnakeCore(global) {
  const DEFAULT_GRID = { columns: 20, rows: 13 };
  const DEFAULT_SNAKE = [
    { x: 10, y: 6 },
    { x: 9, y: 6 },
    { x: 8, y: 6 },
  ];
  const DEFAULT_DIRECTION = { x: 1, y: 0 };

  function copyPosition(position) {
    return { x: position.x, y: position.y };
  }

  function isOppositeDirection(nextDirection, currentDirection) {
    return nextDirection.x === -currentDirection.x && nextDirection.y === -currentDirection.y;
  }

  function createSnakeGame(options = {}) {
    const grid = { ...DEFAULT_GRID, ...(options.grid || {}) };
    const initialSnake = options.initialSnake || DEFAULT_SNAKE;
    const initialDirection = options.initialDirection || DEFAULT_DIRECTION;
    const random = options.random || Math.random;
    let snake = [];
    let direction = copyPosition(initialDirection);
    let pendingDirection = copyPosition(initialDirection);
    let directionChangeQueued = false;
    let apple = null;
    let score = 0;
    let gameOver = false;

    function isSnakeSegmentAt(position, segments = snake) {
      return segments.some((segment) => segment.x === position.x && segment.y === position.y);
    }

    function spawnApple() {
      const emptyCells = [];
      for (let y = 0; y < grid.rows; y += 1) {
        for (let x = 0; x < grid.columns; x += 1) {
          const position = { x, y };
          if (!isSnakeSegmentAt(position)) emptyCells.push(position);
        }
      }
      if (emptyCells.length === 0) {
        apple = null;
        return;
      }
      apple = emptyCells[Math.floor(random() * emptyCells.length)];
    }

    function reset() {
      snake = initialSnake.map(copyPosition);
      direction = copyPosition(initialDirection);
      pendingDirection = copyPosition(direction);
      directionChangeQueued = false;
      apple = null;
      score = 0;
      gameOver = false;
      spawnApple();
    }

    function clear() {
      snake = [];
      direction = copyPosition(DEFAULT_DIRECTION);
      pendingDirection = copyPosition(DEFAULT_DIRECTION);
      directionChangeQueued = false;
      apple = null;
      score = 0;
      gameOver = false;
    }

    function requestDirection(nextDirection) {
      if (gameOver || directionChangeQueued || isOppositeDirection(nextDirection, direction)) return false;
      pendingDirection = copyPosition(nextDirection);
      directionChangeQueued = true;
      return true;
    }

    function isOutsideBoard(position) {
      return position.x < 0 || position.x >= grid.columns || position.y < 0 || position.y >= grid.rows;
    }

    function getState() {
      return {
        snake: snake.map(copyPosition),
        direction: copyPosition(direction),
        apple: apple ? copyPosition(apple) : null,
        score,
        gameOver,
      };
    }

    function moveOneStep() {
      if (gameOver) return { moved: false, ateApple: false, gameOver: true };

      direction = copyPosition(pendingDirection);
      directionChangeQueued = false;
      const head = snake[0];
      const nextHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };
      const eatsApple = apple && nextHead.x === apple.x && nextHead.y === apple.y;
      const bodyToCheck = eatsApple ? snake : snake.slice(0, -1);

      if (isOutsideBoard(nextHead) || isSnakeSegmentAt(nextHead, bodyToCheck)) {
        gameOver = true;
        return { moved: false, ateApple: false, gameOver: true };
      }

      snake = eatsApple ? [nextHead, ...snake] : [nextHead, ...snake.slice(0, -1)];
      if (eatsApple) {
        score += 1;
        apple = null;
        spawnApple();
      }
      return { moved: true, ateApple: Boolean(eatsApple), gameOver: false };
    }

    reset();
    return { clear, getState, moveOneStep, requestDirection, reset };
  }

  global.SnakeCore = { createSnakeGame };
}(globalThis));
