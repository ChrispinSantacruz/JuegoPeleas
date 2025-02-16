const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Cargar imágenes del jugador
const imgIdle = new Image();
imgIdle.src = "assents/quieto.png"; 

const imgMove = new Image();
imgMove.src = "assents/moverse.png"; 

const imgJump = new Image();
imgJump.src = "assents/salto.png"; 

const imgAttack = new Image();
imgAttack.src = "assents/golpe.png"; 

// Imagen del enemigo
const enemyImg = new Image();
enemyImg.src = ""; 

const enemyHurtImg = new Image();
enemyHurtImg.src = "img/enemy_hurt.png"; 

let playerX = 50;
let playerY;
let enemyX = 600; // Alejado al otro extremo del mapa
let enemyY;
const playerSize = 160; // Duplicado el tamaño del jugador
const enemyWidth = 70; 
const enemyHeight = 50; 
let playerHealth = 100;
let enemyHealth = 100;
const playerSpeed = 5;
const enemySpeed = 2;
let moveLeft = false;
let moveRight = false;
let velocityY = 0;
const gravity = 1;
let isJumping = false;
let jumpCount = 0;
const maxJumps = 2;
let attacking = false;
let enemyHit = false;
let currentImage = imgIdle;
let lastEnemyAttackTime = 0;
const attackCooldown = 8000; // 8 segundos

function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
    playerY = canvas.height - playerSize - 50;
    enemyY = canvas.height - enemyHeight - 50;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function drawScene() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "gray";
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
}

function drawCharacters() {
    if (attacking) {
        currentImage = imgAttack;
    } else if (isJumping) {
        currentImage = imgJump;
    } else if (moveLeft || moveRight) {
        currentImage = imgMove;
    } else {
        currentImage = imgIdle;
    }

    ctx.drawImage(currentImage, playerX, playerY, playerSize, playerSize);
    
    ctx.fillStyle = enemyHit ? "green" : "red"; 
    ctx.fillRect(enemyX, enemyY, enemyWidth, enemyHeight);
}

function attack() {
    const playerHitbox = { x: playerX, y: playerY, width: playerSize, height: playerSize };
    const enemyHitbox = { x: enemyX, y: enemyY, width: enemyWidth, height: enemyHeight };
    if (checkCollision(playerHitbox, enemyHitbox)) {
        enemyHealth -= 30;
        enemyHit = true;
        setTimeout(() => enemyHit = false, 300);
        updateHealthBars();
        if (enemyHealth <= 0) {
            setTimeout(() => alert("¡Ganaste! Recarga para jugar de nuevo."), 100);
            resetGame();
        }
    }
    attacking = true;
    setTimeout(() => attacking = false, 300);
}

function checkCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function updateHealthBars() {
    document.getElementById("playerHealth").style.width = playerHealth + "%";
    document.getElementById("enemyHealth").style.width = enemyHealth + "%";
}

function resetGame() {
    playerHealth = 100;
    enemyHealth = 100;
    updateHealthBars();
    playerX = 50;
    enemyX = 600;
}

function jump() {
    if (jumpCount < maxJumps) {
        velocityY = -15;
        isJumping = true;
        jumpCount++;
    }
}

function enemyAI() {
    if (Math.abs(playerX - enemyX) > 100) {
        if (playerX > enemyX) {
            enemyX += enemySpeed;
        } else {
            enemyX -= enemySpeed;
        }
    } else {
        let currentTime = Date.now();
        if (currentTime - lastEnemyAttackTime > attackCooldown) {
            enemyAttack();
            lastEnemyAttackTime = currentTime;
        }
    }
}

function enemyAttack() {
    const playerHitbox = { x: playerX, y: playerY, width: playerSize, height: playerSize };
    const enemyHitbox = { x: enemyX, y: enemyY, width: enemyWidth, height: enemyHeight };
    if (checkCollision(playerHitbox, enemyHitbox)) {
        if (playerHealth > 0) {
            playerHealth -= 20;
            updateHealthBars();
            if (playerHealth <= 0) {
                setTimeout(() => alert("¡Perdiste! Recarga para jugar de nuevo."), 100);
                resetGame();
            }
        }
    }
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") moveLeft = true;
    if (event.key === "ArrowRight") moveRight = true;
    if (event.key === " ") attack();
    if (event.key === "ArrowUp") jump();
});

document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") moveLeft = false;
    if (event.key === "ArrowRight") moveRight = false;
});

document.getElementById("left").addEventListener("touchstart", () => moveLeft = true);
document.getElementById("left").addEventListener("touchend", () => moveLeft = false);
document.getElementById("right").addEventListener("touchstart", () => moveRight = true);
document.getElementById("right").addEventListener("touchend", () => moveRight = false);
document.getElementById("attack").addEventListener("touchstart", attack);
document.getElementById("jump").addEventListener("touchstart", jump);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawScene();
    drawCharacters();
    enemyAI();

    if (moveLeft && playerX > 0) playerX -= playerSpeed;
    if (moveRight && playerX < canvas.width - playerSize) playerX += playerSpeed;

    playerY += velocityY;
    velocityY += gravity;
    if (playerY >= canvas.height - playerSize - 50) {
        playerY = canvas.height - playerSize - 50;
        isJumping = false;
        jumpCount = 0;
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();
