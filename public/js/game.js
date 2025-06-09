const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const paddleWidth = 16, paddleHeight = 100;
const playerX = 10, aiX = canvas.width - paddleWidth - 10;
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
const paddleSpeed = 6;

const ballSize = 16;
let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 5 * (Math.random() * 2 - 1);

let playerScore = 0, aiScore = 0;

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y) {
    ctx.fillStyle = "#fff";
    ctx.font = "40px Arial";
    ctx.fillText(text, x, y);
}

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    // Clamp paddle inside canvas
    playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 5 * (Math.random() * 2 - 1);
}

function moveAI() {
    let aiCenter = aiY + paddleHeight / 2;
    if (ballY + ballSize / 2 < aiCenter - 16) {
        aiY -= paddleSpeed;
    } else if (ballY + ballSize / 2 > aiCenter + 16) {
        aiY += paddleSpeed;
    }
    aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}
function collide(paddleX, paddleY) {
    return ballX < paddleX + paddleWidth &&
           ballX + ballSize > paddleX &&
           ballY < paddleY + paddleHeight &&
           ballY + ballSize > paddleY;
}

function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY + ballSize >= canvas.height) {
        ballSpeedY *= -1;
    }

    if (collide(playerX, playerY)) {
        ballX = playerX + paddleWidth;
        ballSpeedX *= -1.09; // Slight increase in speed
        let collidePoint = (ballY + ballSize/2) - (playerY + paddleHeight/2);
        ballSpeedY = collidePoint * 0.25;
    }

    if (collide(aiX, aiY)) {
        ballX = aiX - ballSize;
        ballSpeedX *= -1.09;
        let collidePoint = (ballY + ballSize/2) - (aiY + paddleHeight/2);
        ballSpeedY = collidePoint * 0.25;
    }

    if (ballX < 0) {
        aiScore++;
        resetBall();
    }
    if (ballX + ballSize > canvas.width) {
        playerScore++;
        resetBall();
    }
    moveAI();
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, "#111");

    for (let i = 0; i < canvas.height; i += 32) {
        drawRect(canvas.width/2 - 2, i, 4, 20, "#444");
    }

    // Draw paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#0ff");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#f00");

    drawRect(ballX, ballY, ballSize, ballSize, "#fff");

    drawText(playerScore, canvas.width/4, 50);
    drawText(aiScore, 3*canvas.width/4, 50);
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

gameLoop();
