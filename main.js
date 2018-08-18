var width = 500;
var height = 600;

var canvas = document.getElementById('game');
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext('2d');
var lastCalledTime, fps;

var drawBackground = function () {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    ctx.fill();

    var delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta;

    ctx.font = '15px arial';
    ctx.fillStyle = 'rgba(255, 0, 255, .8)';
    ctx.fillText('FPS ' + Math.floor(fps), 400, 30);
}

var playerData = {
    x: 50,
    y: 55,
    jumpSpeed: 5,
    fallSpeed: 6,
    destY: 0,
    jumpSize: 60,
    score: 0
};

var blockData = {
    width: 30,
    positions: [],
    speed: 2,
    distance: 250
}

var canJump = 0x0;
var isGameOver = 0x0;

var drawAnimation = function () {
    if (isGameOver & 1) {
        return;
    }

    drawBackground();
    drawBlocks();

    if (playerData.y != playerData.destY && canJump & 1) {
        playerData.y -= playerData.jumpSpeed;
    } else {
        canJump = 0x0;

        if (height - 30 >= playerData.y) {
            playerData.y += playerData.fallSpeed;
        }
    }

    var lastBlockX = blockData.positions[blockData.positions.length - 1].x;

    if (width >= lastBlockX) {
        drawRandomBlocks();
    }

    ctx.fillStyle = 'red';
    ctx.fillRect(playerData.x, playerData.y, 30, 30);
    ctx.fill();

    requestAnimationFrame(drawAnimation);
}

var drawRandomBlocks = function () {
    for (var i = 0; i < 5; i++) {
        var randomHeight = Math.random() * 500;

        blockData.positions.push({
            x: (width + blockData.distance) + (i * blockData.distance),
            y: 0,
            height: randomHeight,
            canTakeScore: true
        });

        var downHeight = height - (randomHeight + 150);
        blockData.positions.push({
            x: (width + blockData.distance) + (i * blockData.distance),
            y: height - downHeight,
            height: downHeight
        });
    }
}

drawRandomBlocks();

var drawBlocks = function () {
    for (var i = 0; i < blockData.positions.length; i++) {
        var currentBlock = blockData.positions[i];

        ctx.fillStyle = currentBlock.color || 'white';
        ctx.fillRect(currentBlock.x, currentBlock.y, blockData.width, currentBlock.height);
        ctx.fill();

        currentBlock.x -= blockData.speed;

        if (
            playerData.x >= currentBlock.x - blockData.width &&
            playerData.x <= currentBlock.x + blockData.width &&
            playerData.y + blockData.width >= currentBlock.y &&
            playerData.y <= currentBlock.y + currentBlock.height) {
            currentBlock.color = 'blue';
            isGameOver = 0x1;

            ctx.font = '30px arial';
            ctx.fillStyle = 'green';
            ctx.fillText('Game over !', (width / 2) - 70, height / 2);

            ctx.font = '30px arial';
            ctx.fillStyle = 'green';
            ctx.fillText('Score ' + playerData.score + ' !', (width / 2) - 70, (height / 2) + 40);
        }

        if (playerData.x > currentBlock.x + blockData.width && !isGameOver && currentBlock.canTakeScore) {
            currentBlock.canTakeScore = false;
            playerData.score += 1;

            console.log('score ++');
        }
    }
}

document.onkeydown = function () {
    canJump = 0x1;

    playerData.destY = playerData.y - playerData.jumpSize;
}

requestAnimationFrame(drawAnimation);
