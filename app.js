document.addEventListener('DOMContentLoaded', () => {
  //Code
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const linesDisplay = document.querySelector('#lines')
  const levelDisplay = document.querySelector('#level')
  const youLoseDisplay = document.querySelector('#youlosebuddey')
  const startBtn = document.querySelector('#start-button')
  const startLevelText = document.querySelector('#start-level')
  const levelUpBtn = document.querySelector('#start-level-up')
  const levelDownBtn = document.querySelector('#start-level-down')
  const startHeightText = document.querySelector('#start-height')
  const heightUpBtn = document.querySelector('#start-height-up')
  const heightDownBtn = document.querySelector('#start-height-down')
  const width = 10
  let nextRandom = 0
  let timerId
  let textTimerId
  let score = 0
  let level = 1
  let startHeight = 0
  let startLevel = level
  let lines = 0
  let levelInterval = 0 //Value between 0 and 999; used to decrease delays when increasing level, making game harder
  let hasStarted = false
  let gameOverBuddy = false

  document.addEventListener('keyup', control)

  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  const statSquares = document.querySelectorAll('.stats-pieces div')

  const statNumbers = [0,0,0,0,0,0,0]
  const statNumbersText = document.querySelectorAll('#piece_stats')

  const colors = ['orange','red','purple','aqua','green','blue','yellow']

 //The tetrominos

 const jTetromino = [
   [1, width+1, width*2+1, 2],
   [width, width+1, width+2, width*2+2],
   [1, width+1, width*2+1, width*2],
   [width, width*2, width*2+1, width*2+2]
]

  const lTetromino = [
    [0, 1, width+1, width*2+1],
    [2, width, width+1, width+2],
    [1, width+1, width*2+1, width*2+2],
  [width, width+1, width+2, width*2]
]

  const sTetromino = [
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1]
  ]

  const zTetromino = [
    [width, width+1, width*2+1, width*2+2],
    [1, width, width+1, width*2],
    [width, width+1, width*2+1, width*2+2],
    [1, width, width+1, width*2]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
  ]

  const theTetrominoes = [jTetromino, lTetromino, sTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 4
  let currentRotation = 0

  //randomly select a tetromino
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]

  resetStats()
  fillStatSquares()

  //drawing first rotation
  function draw(){
    current.forEach(index => {
       squares[currentPosition + index].classList.add('tetromino')
       squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  function moveDown() {
    //undraw()
    //currentPosition+=width
    //draw()
    freeze()
  }

  //freeze piece
  function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //Start a new tetromino
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      statNumbers[random]++
      adjustStats()
      addScore()
      draw()
      displayShape()
      gameOver()
    } else {
      undraw()
      currentPosition+=width
      draw()
    }
  }

  //move tetromino left/right, unless it is blocked by edge or enother block

  function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)

    if(!isAtLeftEdge) currentPosition -=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition +=1
    }
    draw()
  }

  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if(!isAtRightEdge) currentPosition +=1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition -=1
    }
    draw()
  }

  function rotate(){
    undraw()
    currentRotation++
    if(currentRotation === current.length){ //If we are at the end of the current rotation
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]

    if((current.some(index => (currentPosition + index) % width === 0) &&
      current.some(index => (currentPosition + index) % width === width - 1))){
        currentRotation--
        if(currentRotation < 0){
          currentRotation = current.length - 1
        }
      } else if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentRotation--
      if(currentRotation < 0){
        currentRotation = current.length - 1
      }
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  function control(e){
    if(timerId && !gameOverBuddy){
      if(e.keyCode === 37) {
        moveLeft()
      } else if (e.keyCode === 38) {
        rotate()
      } else if (e.keyCode === 39) {
        moveRight()
      } else if (e.keyCode === 40) {
        moveDown()
      }
  }
  }


// Next j, l, s, z, t, o, and i tetrominos, respectively
const upNextTetrominoes = [
  [1, displayWidth+1, displayWidth*2+1, 2],
  [0, 1, displayWidth+1, displayWidth*2+1],
  [displayWidth+1, displayWidth+2, displayWidth*2, displayWidth*2+1],
  [displayWidth, displayWidth+1, displayWidth*2+1, displayWidth*2+2],
  [1, displayWidth, displayWidth+1, displayWidth+2],
  [0,1,displayWidth,displayWidth+1],
  [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
]

//display shape in minigrid
function displayShape() {
  displaySquares.forEach(square => {
    square.classList.remove('tetromino')
    square.style.backgroundColor = ''
  })
  upNextTetrominoes[nextRandom].forEach( index => {
    displaySquares[displayIndex + index].classList.add('tetromino')
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
}

// These functions fill the stat squares with tetromino colors, reset the stats,
// and adjusts them based on tetrominos put in play.
//
function fillStatSquares() {
  for(let i = 0; i < colors.length; i++){
    statSquares[i].style.backgroundColor = colors[i]
  }
}

function resetStats() {
  for(let i = 0; i < statNumbers.length; i++){
    statNumbers[i] = 0
    statNumbersText[i].innerHTML = statNumbers[i]
  }
}

function adjustStats() {
  for(let i = 0; i < statNumbers.length; i++){
    statNumbersText[i].innerHTML = statNumbers[i]
  }
}
//////

function addScore() {
  let numberLines = 0
  for(let i = 0; i < 199; i+=width){
    const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

    if(row.every(index => squares[index].classList.contains('taken'))){
      numberLines++
      row.forEach(index => {
        squares[index].classList.remove('taken')
        squares[index].classList.remove('tetromino')
        squares[index].style.backgroundColor = ''
      })
      const squaresRemoved = squares.splice(i, width)
      squares = squaresRemoved.concat(squares)
      squares.forEach(cell => grid.appendChild(cell))
    }
  }
  // Score points based off getting a single, double, triple, or tetris
  // Also informs player what they got
  if(numberLines === 1){
    score +=10 * level
    youLoseDisplay.innerHTML = 'SINGLE!'
    clearInterval(textTimerId)
    textTimerId = setInterval(clearText, 5000)
  } else if (numberLines === 2){
    score +=40 * level
    youLoseDisplay.innerHTML = 'DOUBLE!!'
    clearInterval(textTimerId)
    textTimerId = setInterval(clearText, 5000)
  } else if (numberLines === 3){
    score +=100 * level
    youLoseDisplay.innerHTML = 'TRIPLE!!!'
    clearInterval(textTimerId)
    textTimerId = setInterval(clearText, 5000)
  } else if (numberLines === 4){
    score +=200 * level
    youLoseDisplay.innerHTML = 'TETRIS!!!!!!! WOOT WOOT WOOT'
    clearInterval(textTimerId)
    textTimerId = setInterval(clearText, 5000)
  }
  lines += numberLines
  checkLevel()
  scoreDisplay.innerHTML = score
  linesDisplay.innerHTML = lines
  levelDisplay.innerHTML = level
}

//GAME OVER YEAH
function gameOver() {
  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    clearInterval(textTimerId)
    youLoseDisplay.innerHTML = 'YOU LOSE BUDDEY!'
    gameOverBuddy = true
    hasStarted = false
    clearInterval(timerId)
    timerId = null
  }
}

// Adjusts speed based on level and lines created; 10 lines equal a level up

function checkLevel(){
  let r = Math.floor(lines / 10) + 1
  if(r > level) {
    level = r
  }
  adjustDropSpeed()
}

function adjustDropSpeed(){
  levelInterval = level * 70
  if(levelInterval < 0){
    levelInterval = 0
  } else if (levelInterval > 900){
    levelInterval = Math.min(890 + level * 2, 990)
  }

  clearInterval(timerId)
  timerId = setInterval(moveDown, 1000 - levelInterval)
}
/////

function clearText(){
    youLoseDisplay.innerHTML = ''
}

function clearBoard(){
  for(let i = 0; i < 200; i++){
    //console.log('woot woot woot')
    squares[i].classList.remove('taken')
    squares[i].classList.remove('tetromino')
    squares[i].style.backgroundColor = ''
  }
}

// This is an advanced mode in which blocks are pre-added.
// 0 means no added rows; 1 is four rows, and 5 means 12 rows
  function heightTest(){
    let heightTotal = 4 + ((startHeight - 1) * 2)
    for(let i = 199; i > (20-heightTotal) * width; i--){
      let r = Math.random() * 2
      if (r < 1){
        let rcolor = Math.floor(Math.random()*theTetrominoes.length)
        squares[i].classList.add('taken')
        squares[i].classList.add('tetromino')
        squares[i].style.backgroundColor = colors[rcolor]
      }
    }
  }

// Listeners for the start/pause, level, and height buttons
// Level maxes at 9 and height maxes at 5 (12 rows)

startBtn.addEventListener('click', () => {
 if(timerId){
   clearInterval(timerId)
   timerId = null
   clearText()
   youLoseDisplay.innerHTML = 'Game paused.'
   clearInterval(textTimerId)
 } else {
     if(!hasStarted) {
       console.log(statNumbersText.length)
       resetStats()
       fillStatSquares()
       clearBoard()
       clearText()
       if(startHeight > 0) {
         heightTest()
       }
       score = 0
       lines = 0
       level = startLevel
       scoreDisplay.innerHTML = score
       linesDisplay.innerHTML = lines
       levelDisplay.innerHTML = level
       gameOverBuddy = false
       adjustDropSpeed()
       draw()
       nextRandom = Math.floor(Math.random()*theTetrominoes.length)
       displayShape()
       statNumbers[random]++
       adjustStats()
       hasStarted = true
   } else if (!gameOverBuddy){
       timerId = setInterval(moveDown, 1000 - levelInterval)
       clearText()
   }
 }
})

levelUpBtn.addEventListener('click', () => {
  if(startLevel < 9 && !hasStarted)
  startLevel++
  startLevelText.innerHTML = startLevel
})

levelDownBtn.addEventListener('click', () => {
  if(startLevel > 1 && !hasStarted)
  startLevel--
  startLevelText.innerHTML = startLevel
})

heightUpBtn.addEventListener('click', () => {
  if(startHeight < 5 && !hasStarted)
  startHeight++
  startHeightText.innerHTML = startHeight
})

heightDownBtn.addEventListener('click', () => {
  if(startHeight > 0 && !hasStarted)
  startHeight--
  startHeightText.innerHTML = startHeight
})

})
