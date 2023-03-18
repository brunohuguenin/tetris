const gridWidth = 10
// Shapes
const lShape = [
  [1, 2, gridWidth + 1, gridWidth*2 + 1],
  [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth*2 + 2],
  [1, gridWidth + 1, gridWidth*2, gridWidth*2 + 1],
  [gridWidth, gridWidth*2, gridWidth*2 + 1, gridWidth*2 + 2]
]

const zShape = [
  [gridWidth + 1, gridWidth + 2, gridWidth*2, gridWidth*2 + 1],
  [0, gridWidth, gridWidth + 1, gridWidth*2 + 1],
  [gridWidth + 1, gridWidth + 2, gridWidth*2, gridWidth*2 + 1],
  [0, gridWidth, gridWidth + 1, gridWidth*2 + 1]
]

const tShape = [
  [1, gridWidth, gridWidth + 1, gridWidth + 2],
  [1, gridWidth + 1, gridWidth + 2, gridWidth*2 + 1],
  [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth*2 + 1],
  [1, gridWidth, gridWidth + 1, gridWidth*2 + 1]
]

const oShape = [
  [0, 1, gridWidth, gridWidth + 1],
  [0, 1, gridWidth, gridWidth + 1],
  [0, 1, gridWidth, gridWidth + 1],
  [0, 1, gridWidth, gridWidth + 1]
]

const iShape = [
  [1, gridWidth + 1, gridWidth*2 + 1, gridWidth*3 + 1],
  [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3],
  [1, gridWidth + 1, gridWidth*2 + 1, gridWidth*3 + 1],
  [gridWidth, gridWidth + 1, gridWidth + 2, gridWidth + 3]
]

const allShapes = [lShape, zShape, tShape, oShape, iShape];

let currentPosition = 3
let currentRotation = 0;
let randomShape = Math.floor(Math.random() * allShapes.length);
let currentShape = allShapes[randomShape][currentRotation];
let $gridSquares = document.querySelectorAll('.grid div')
// $ sig algum elemento HTML que já foi criado

function draw() {
  currentShape.forEach((squareIndex) => {
    $gridSquares[squareIndex + currentPosition].classList.add('shapePainted');
  });
}
draw();


function unDraw() {
  currentShape.forEach((squareIndex) => {
    $gridSquares[squareIndex + currentPosition].classList.remove('shapePainted');
  });
}

const $restartButton = document.getElementById('restart-button')
$restartButton.addEventListener('click',() => {
  window.location.reload()
})

//setInterval(moveDown, 600);
let timeId = null;
const $startStopButton = document.getElementById('start-button');
$startStopButton.addEventListener('click', () => {
  if (timeId) {
    clearInterval(timeId);
    timeId = null
  } else {
    timeId = setInterval(moveDown, 600);
  }
})


function moveDown() {
  freeze();

  unDraw();
  currentPosition += 10;
  draw() 
}

function freeze() {
  if (currentShape.some(squareIndex => 
    $gridSquares[squareIndex + currentPosition + gridWidth].classList.contains('filled')
  )) { 
    currentShape.forEach(squareIndex => $gridSquares[squareIndex + currentPosition].classList.add('filled'));

    currentPosition = 3
    currentRotation = 0;
    randomShape = Math.floor(Math.random() * allShapes.length);
    currentShape = allShapes[randomShape][currentRotation];
    draw()
  }
}

function moveLeft() {
  const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0)
  if (isEdgeLimit) return

  const isFilled = currentShape.some(squareIndex => 
    $gridSquares[squareIndex + currentPosition - 1].classList.contains('filled')
  )
  if (isFilled) return;

  unDraw();
  currentPosition -= 1;
  draw()
}

function moveRight() {
  const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === gridWidth - 1)
  if (isEdgeLimit) return

  const isFilled = currentShape.some(squareIndex =>
    $gridSquares[squareIndex + currentPosition + 1].classList.contains('filled')
  )
  if (isFilled) return

  unDraw();
  currentPosition++;
  draw()
}

function previousRotation() {
  if (currentRotation === 0) {
    currentRotation = currentShape.length -1
  } else {
    currentRotation--
  }

  currentShape = allShapes[randomShape][currentRotation]
}

function rotate() {
  unDraw();

  if (currentRotation === currentShape.length -1) {
    currentRotation = 0;
  } else {
    currentRotation++
  }

  currentShape = allShapes[randomShape][currentRotation]

  const isLeftEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0);
  const isRightEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === -1);
  if (isLeftEdgeLimit && isRightEdgeLimit) {
    previousRotation();
  }

  const isFilled = currentShape.some(squareIndex => 
    $gridSquares[squareIndex + currentPosition].classList.contains('filled')
    )
    if (isFilled) {
      previousRotation();
    }

  draw()
}

document.addEventListener('keydown', controlKeyboard);

function controlKeyboard(event) {
  if (timeId) {
    if (event.key === 'ArrowLeft') {
      moveLeft()
    } else if (event.key === 'ArrowRight') {
      moveRight();
    } else if (event.key === 'ArrowDown') {
       moveDown();
    } else if (event.key === 'ArrowUp') {
      rotate()
    }
  }
}