
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d'); // 2d rendering context

const $sprite = document.getElementById('sprite');
const $bricks = document.getElementById('bricks');

canvas.width = 448;
canvas.height = 400;

// variables del juego

// variables de la pelota
const ballRadius = 4;

// posición de la pelota
let x = canvas.width / 2;
let y = canvas.height - 30;
// velocidad de la pelota
let dx = 2;
let dy = -2;

// variables de la paleta
const paddleHeight = 10;
const paddleWidth = 50;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

let rightPressed = false;
let leftPressed = false;

// variables de los ladrillos
const brickRowCount = 6;
const brickColumnCount = 13;
const brickWidth = 30;
const brickHeight = 14;
const brickPadding = 2;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = [];

const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0
}

for (let column = 0; column < brickColumnCount; column++) {
  bricks[column] = []; // inicializamos con un array vacio
  for (let row = 0; row < brickRowCount; row++) {
    // calcula posición del ladrillo en pantalla
    const brickX = column * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = row * (brickHeight + brickPadding) + brickOffsetTop;
    // asignar un color aleatoria a cada ladrillo
    const random = Math.floor(Math.random() * 8);
    // guardar la información de cada ladrillo
    bricks[column][row] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.ACTIVE,
      color: random
    }
  };
};

const PADDLE_SENSITIVITY = 7;

function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath(); // mejora el rendimiento, evita trazados al final
}

function drawPaddle() {
  ctx.drawImage(
    $sprite,
    29,
    174,
    paddleWidth,
    paddleHeight,
    paddleX,
    paddleY,
    paddleWidth,
    paddleHeight
  );
}

function drawBricks() {
  for (let column = 0; column < brickColumnCount; column++) {
    for (let row = 0; row < brickRowCount; row++) {
      const currentBrick = bricks[column][row];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const clipX = currentBrick.color * 32;

      ctx.drawImage(
        $bricks,
        clipX,
        0,
        brickWidth,
        brickHeight,
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeight
      )

    }
  }
}

function collisionDetection() { }

function ballMovement() {
  // colisiones horizontales
  if (
    x + dx > canvas.width - ballRadius || // la pared derecha
    x + dx < ballRadius // pared izquierda
  ) {
    dx = -dx;
  }

  if (y + dy < ballRadius) { // toca el techo
    dy = -dy;
  }

  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;

  const isBallTouchingPaddle = y + dy > paddleY;

  if (isBallSameXAsPaddle && isBallTouchingPaddle) { // si toca la paleta
    dy = -dy
  }

  if (y + dy > canvas.height - ballRadius) { // toca el suelo
    document.location.reload();
  }

  // mover la pelota
  x += dx;
  y += dy;
}
function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += PADDLE_SENSITIVITY;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= PADDLE_SENSITIVITY;
  }
}

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function initEvents() {
  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  function keyDownHandler(event) {
    const { key } = event;
    if (key === 'Right' || key === 'ArrowRight') {
      rightPressed = true;
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = true;
    }
  }

  function keyUpHandler(event) {
    const { key } = event;
    if (key === 'Right' || key === 'ArrowRight') {
      rightPressed = false;
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = false;
    }
  }
}

function draw() {
  cleanCanvas();
  // hay que dibujar elementos
  drawBall();
  drawPaddle();
  drawBricks();
  // drawScore();

  // colisiones y movimientos
  collisionDetection();
  ballMovement();
  paddleMovement();

  window.requestAnimationFrame(draw);
}
draw();
initEvents();