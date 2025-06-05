// This file contains the JavaScript for the Bug Bash (Whack A Mole) game.
// It controls the game logic, score, timer, and bug appearance.

// Get references to elements in the HTML
const holes = document.querySelectorAll('.hole');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const gameOverEl = document.getElementById('game-over');
const resetBtn = document.getElementById('reset-btn'); // Get the reset button
const pauseBtn = document.getElementById('pause-btn'); // Get the pause button

let score = 0;
let timeLeft = 30;
let gameInterval;
let bugInterval;
let gameActive = true;

// Variable to track pause state
let isPaused = false; // Track if the game is paused

// Function to pick a random hole
function randomHole() {
  return holes[Math.floor(Math.random() * holes.length)];
}

// Function to show a bug, a bomb, or a special caterpillar in a random hole
function showBugOrBombOrCaterpillar() {
  if (!gameActive || isPaused) return;
  const hole = randomHole();
  if (hole.classList.contains('bug') || hole.classList.contains('bomb') || hole.classList.contains('caterpillar')) return;

  // Randomly decide what to show
  // 40% bug, 40% bomb, 20% caterpillar
  const rand = Math.random();
  if (rand < 0.4) {
    // Show bug (10 points)
    hole.textContent = '🐛';
    hole.classList.add('bug');
  } else if (rand < 0.8) {
    // Show bomb (-10 points)
    hole.textContent = '💣';
    hole.classList.add('bomb');
  } else {
    // Show special caterpillar (20 points)
    hole.textContent = '🪱';
    hole.classList.add('caterpillar');
  }

  // Hide after a short time
  const hideTimer = setTimeout(() => {
    if (hole.classList.contains('bug') || hole.classList.contains('bomb') || hole.classList.contains('caterpillar')) {
      hole.textContent = '';
      hole.classList.remove('bug');
      hole.classList.remove('bomb');
      hole.classList.remove('caterpillar');
    }
  }, 1000 + Math.random() * 1000);

  // When the hole is clicked
  hole.onclick = () => {
    if (!gameActive || isPaused) return;
    if (hole.classList.contains('bug')) {
      score += 10;
      scoreEl.textContent = score;
      hole.textContent = '💥';
      hole.classList.remove('bug');
      hole.classList.add('squashed');
      setTimeout(() => {
        hole.textContent = '';
        hole.classList.remove('squashed');
      }, 500);
    } else if (hole.classList.contains('bomb')) {
      score -= 10;
      if (score < 0) score = 0;
      scoreEl.textContent = score;
      hole.textContent = '💥';
      hole.classList.remove('bomb');
      hole.classList.add('squashed');
      setTimeout(() => {
        hole.textContent = '';
        hole.classList.remove('squashed');
      }, 500);
    } else if (hole.classList.contains('caterpillar')) {
      score += 20;
      scoreEl.textContent = score;
      hole.textContent = '💥';
      hole.classList.remove('caterpillar');
      hole.classList.add('squashed');
      setTimeout(() => {
        hole.textContent = '';
        hole.classList.remove('squashed');
      }, 500);
    }
  };
}

// Function to clear all bugs and squashed effects from holes
function clearHoles() {
  holes.forEach(hole => {
    hole.textContent = '';
    hole.classList.remove('bug');
    hole.classList.remove('bomb');
    hole.classList.remove('caterpillar');
    hole.classList.remove('squashed');
    hole.onclick = null;
  });
}

// Function to start the game
function startGame() {
  // Clear any previous intervals
  clearInterval(gameInterval);
  clearInterval(bugInterval);
  // Reset everything
  score = 0;
  scoreEl.textContent = score;
  timeLeft = 30;
  timerEl.textContent = timeLeft;
  gameOverEl.textContent = '';
  gameActive = true;
  isPaused = false;
  pauseBtn.textContent = 'Pause';
  clearHoles(); // Clear all holes

  // Countdown timer
  gameInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(bugInterval);
      gameActive = false;
      gameOverEl.textContent = `Game Over! Final Score: ${score}`;
    }
  }, 1000);

  // Show bugs at intervals
  bugInterval = setInterval(showBugOrBombOrCaterpillar, 600);
}

// Function to pause or resume the game
function togglePause() {
  if (!gameActive && !isPaused) return; // Don't allow pause if game is over
  if (!isPaused) {
    // Pause the game
    isPaused = true;
    clearInterval(gameInterval);
    clearInterval(bugInterval);
    pauseBtn.textContent = 'Resume';
    // Disable clicking on holes while paused
    holes.forEach(hole => {
      hole.onclick = null;
    });
  } else {
    // Resume the game
    isPaused = false;
    pauseBtn.textContent = 'Pause';
    // Resume the timer
    gameInterval = setInterval(() => {
      if (!isPaused) {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(gameInterval);
          clearInterval(bugInterval);
          gameActive = false;
          gameOverEl.textContent = `Game Over! Final Score: ${score}`;
        }
      }
    }, 1000);
    // Resume showing bugs, bombs, and caterpillars
    bugInterval = setInterval(showBugOrBombOrCaterpillar, 600);
  }
}

// Add event listener to the reset button
resetBtn.addEventListener('click', function() {
  startGame(); // Restart the game when reset button is clicked
});

// Add event listener to the pause button
pauseBtn.addEventListener('click', togglePause);

// Start the game when the page loads
startGame();
