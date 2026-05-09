// Game state: dito nakatago ang score, combo, oras, at bilis ng beat.
const scoreEl = document.getElementById('score');
const comboEl = document.getElementById('combo');
const timeEl = document.getElementById('time');
const feedbackEl = document.getElementById('feedback');
const beatBoard = document.getElementById('beat-board');
const beatDot = document.getElementById('beat-dot');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

let score = 0;
let combo = 0;
let timeLeft = 30;
let beatX = 20;
let speed = 4;
let gameTimer = null;
let frameTimer = null;
let isRunning = false;

function updateStats() {
  scoreEl.textContent = score;
  comboEl.textContent = combo;
  timeEl.textContent = timeLeft;
}

function setFeedback(message, type = '') {
  feedbackEl.textContent = message;
  feedbackEl.className = `feedback ${type}`;
}

// Ina-update ang posisyon ng beat sa loob ng game board.
function moveBeat() {
  const boardWidth = beatBoard.clientWidth;
  beatX += speed;

  if (beatX > boardWidth - 96) {
    beatX = 20;
    combo = 0;
    setFeedback('Missed beat. Try to catch it in the tap zone.', 'bad');
  }

  beatDot.style.left = `${beatX}px`;
  updateStats();
}

function startGame() {
  if (isRunning) return;

  isRunning = true;
  startBtn.textContent = 'Playing...';
  setFeedback('Tap the beat when it reaches the bright zone.', 'good');

  frameTimer = setInterval(moveBeat, 16);
  gameTimer = setInterval(() => {
    timeLeft -= 1;
    updateStats();

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(frameTimer);
  clearInterval(gameTimer);
  frameTimer = null;
  gameTimer = null;
  isRunning = false;
  startBtn.textContent = 'Start Game';
  setFeedback(`Game over. Final score: ${score}`, 'good');
}

function resetGame() {
  clearInterval(frameTimer);
  clearInterval(gameTimer);
  score = 0;
  combo = 0;
  timeLeft = 30;
  beatX = 20;
  speed = 4;
  isRunning = false;
  beatDot.style.left = `${beatX}px`;
  startBtn.textContent = 'Start Game';
  setFeedback('Press Start, then tap the moving beat.');
  updateStats();
}

// Hit logic: mas mataas ang score kapag nasa gitna ng tap zone.
function tapBeat() {
  if (!isRunning) return;

  const boardWidth = beatBoard.clientWidth;
  const dotCenter = beatX + 38;
  const zoneStart = boardWidth * 0.44;
  const zoneEnd = boardWidth * 0.56;

  if (dotCenter >= zoneStart && dotCenter <= zoneEnd) {
    combo += 1;
    score += 10 + combo * 2;
    speed = Math.min(speed + 0.25, 9);
    beatX = 20;
    setFeedback(`Perfect hit! Combo ${combo}`, 'good');
    beatDot.classList.add('hit');
    setTimeout(() => beatDot.classList.remove('hit'), 220);
  } else {
    combo = 0;
    score = Math.max(0, score - 3);
    setFeedback('Too early or too late. Wait for the tap zone.', 'bad');
  }

  updateStats();
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
beatDot.addEventListener('click', tapBeat);

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    tapBeat();
  }
});

updateStats();
