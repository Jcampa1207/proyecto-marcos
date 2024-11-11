const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let player = { x: canvas.width / 2, y: canvas.height - 60, size: 20, color: 'yellow' };
let bullets = [];
let enemies = [];
let laws = [
    "1ª Ley de Kepler: Los planetas se mueven en órbitas elípticas, con el Sol en uno de los focos.",
    "2ª Ley de Kepler: Una línea entre el Sol y un planeta barre áreas iguales en tiempos iguales.",
    "3ª Ley de Kepler: El cuadrado del período orbital es proporcional al cubo de la distancia promedio al Sol."
];

function drawPlayer() {
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color;
        ctx.fill();
        ctx.closePath();
    });
}

function drawBullets() {
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    });
}

function updateEnemies() {
    if (enemies.length < 6) {
        let planetColors = ['blue', 'orange', 'gray', 'red', 'green', 'purple'];
        let newEnemy = {
            x: Math.random() * (canvas.width - 40) + 20,
            y: 50,
            size: 15,
            color: planetColors[Math.floor(Math.random() * planetColors.length)],
            speed: 1 + Math.random() * 2
        };
        enemies.push(newEnemy);
    }

    enemies.forEach(enemy => {
        enemy.y += enemy.speed;
        if (enemy.y > canvas.height) {
            enemy.y = 0;
            enemy.x = Math.random() * (canvas.width - 40) + 20;
        }
    });
}

function updateBullets() {
    bullets.forEach((bullet, bulletIndex) => {
        bullet.y -= 5;
        if (bullet.y < 0) {
            bullets.splice(bulletIndex, 1);
        }
    });
}

function detectCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            const dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
            if (dist - enemy.size < 5) {
                score += 10;
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);

                if (score % 50 === 0) {
                    showMessage(laws[(score / 50) - 1] || "¡Sigue jugando y aprendiendo!");
                }
            }
        });
    });
}

function showMessage(text) {
    messageDisplay.innerText = text;
    setTimeout(() => messageDisplay.innerText = '', 5000);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawEnemies();
    drawBullets();
    scoreDisplay.innerText = `Puntos: ${score}`;
}

function update() {
    updateEnemies();
    updateBullets();
    detectCollisions();
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', (e) => {
    player.x = e.clientX;
});

canvas.addEventListener('click', () => {
    bullets.push({ x: player.x, y: player.y });
});

gameLoop();
