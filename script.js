// --- DOM Elements ---
const game = document.getElementById('game');
const dino = document.getElementById('dino');
const block = document.getElementById('block');
const coin = document.getElementById('coin');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('high-score');
const gameOverMessage = document.getElementById('game-over-message');
const finalScoreSpan = document.getElementById('final-score');
const finalHighScoreSpan = document.getElementById('final-high-score');

// --- Game State ---
let score = 0;
let highScore = 0;
let isGameOver = false;
let isJumping = false;

// Base animation speeds (in seconds)
const BASE_SPEED = {
    block: 2,
    coin: 2.5,
    background: 10
};

// --- Game Functions ---

// JUMP
function jump() {
    if (isJumping || isGameOver) return;
    isJumping = true;
    dino.classList.add('jump-animation');
    setTimeout(() => {
        dino.classList.remove('jump-animation');
        isJumping = false;
    }, 500); // Must match animation duration
}

// UPDATE SCORE
function updateScore() {
    if (isGameOver) return;
    score++;
    scoreSpan.textContent = score;
    checkSpeedUp();
}

// HANDLE GAME OVER
function handleGameOver() {
    isGameOver = true;

    // Stop all element animations by pausing them
    game.style.animationPlayState = 'paused';
    block.style.animationPlayState = 'paused';
    coin.style.animationPlayState = 'paused';

    // Update high score if needed
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('ethDinoHighScore', highScore);
    }

    // Display Game Over screen
    finalScoreSpan.textContent = score;
    finalHighScoreSpan.textContent = highScore;
    gameOverMessage.style.display = 'block';
}

// RESTART GAME
function restartGame() {
    location.reload();
}

// INCREASING SPEED
function checkSpeedUp() {
    // Every 200 points, increase speed by 10%
    if (score > 0 && score % 200 === 0) {
        // Calculate the speed multiplier, ensuring it doesn't get impossibly fast
        let speedMultiplier = 1 - (score / 200) * 0.1;
        if (speedMultiplier < 0.4) speedMultiplier = 0.4; // Set a max speed

        block.style.animationDuration = (BASE_SPEED.block * speedMultiplier) + 's';
        coin.style.animationDuration = (BASE_SPEED.coin * speedMultiplier) + 's';
        game.style.animationDuration = (BASE_SPEED.background * speedMultiplier) + 's';
    }
}

// CHECK FOR COLLISIONS
function checkCollisions() {
    if (isGameOver) return;

    const dinoRect = dino.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();
    const coinRect = coin.getBoundingClientRect();

    // Obstacle Collision (simplified hitbox check)
    if (
        dinoRect.left < blockRect.right &&
        dinoRect.right > blockRect.left &&
        dinoRect.bottom > blockRect.top
    ) {
        handleGameOver();
    }

    // Coin Collection
    if (
        dinoRect.left < coinRect.right &&
        dinoRect.right > coinRect.left &&
        dinoRect.top < coinRect.bottom &&
        dinoRect.bottom > coinRect.top
    ) {
        score += 100; // Bonus points for coin
        scoreSpan.textContent = score;
        // Hide and respawn coin
        coin.style.display = 'none';
        setTimeout(() => { coin.style.display = 'block'; }, 1000);
    }
}

// --- Initialize Game ---
function initializeGame() {
    // Load high score from browser storage
    highScore = parseInt(localStorage.getItem('ethDinoHighScore')) || 0;
    highScoreSpan.textContent = highScore;
    
    // Add event listener for jumping/restarting
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            jump();
        }
    });
    document.addEventListener('click', () => {
        if (isGameOver) {
            restartGame();
        } else {
            jump();
        }
    });

    // Start game loops
    setInterval(updateScore, 100); // Score increases every 100ms
    setInterval(checkCollisions, 10); // Check for collisions frequently
}

// --- Start the Game! ---
initializeGame();