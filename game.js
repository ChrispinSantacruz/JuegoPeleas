const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let playerX = 50;  // Posición inicial del jugador
let enemyX = 250;  // Posición inicial del enemigo
const playerSize = 50;
const enemySize = 50;
let playerHealth = 100;
const playerSpeed = 5;  // Velocidad más suave
let moveLeft = false;
let moveRight = false;

// Ajustar el tamaño del canvas a la pantalla
function resizeCanvas() {
    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.6;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Dibujar el escenario
function drawScene() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar el piso
    ctx.fillStyle = "gray";
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
}

// Dibujar los personajes
function drawCharacters() {
    // Jugador (rojo)
    ctx.fillStyle = "red";
    ctx.fillRect(playerX, canvas.height - 100, playerSize, playerSize);

    // Enemigo (azul)
    ctx.fillStyle = "blue";
    ctx.fillRect(enemyX, canvas.height - 100, enemySize, enemySize);
}

// Golpe al enemigo
function attack() {
    const attackRange = 60;

    if (Math.abs(playerX - enemyX) < attackRange) {
        playerHealth -= 20;
        updateHealthBar();
    }
}

// Actualizar la barra de vida
function updateHealthBar() {
    document.getElementById("playerHealth").style.width = playerHealth + "%";

    if (playerHealth <= 0) {
        alert("¡Perdiste! Recarga para intentarlo de nuevo.");
        playerHealth = 100;
        updateHealthBar();
    }
}

// Detectar botones presionados
document.getElementById("left").addEventListener("touchstart", () => moveLeft = true);
document.getElementById("left").addEventListener("touchend", () => moveLeft = false);

document.getElementById("right").addEventListener("touchstart", () => moveRight = true);
document.getElementById("right").addEventListener("touchend", () => moveRight = false);

document.getElementById("attack").addEventListener("touchstart", attack);

// Bucle del juego
function gameLoop() {
    drawScene();
    drawCharacters();

    // Movimiento del jugador
    if (moveLeft && playerX > 0) playerX -= playerSpeed;
    if (moveRight && playerX < canvas.width - playerSize) playerX += playerSpeed;

    requestAnimationFrame(gameLoop);
}

gameLoop();
