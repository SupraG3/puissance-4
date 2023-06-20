const board = document.querySelector('.game-board');
const columns = [];
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const player1Color = document.getElementById('player1-color');
const startGame = document.getElementById('start-game');
const reset = document.getElementById('reset');
const replay = document.getElementById('replay');
const gameStatus = document.getElementById('game-status');

let currentPlayer = 1;
let player1Name, player2Name;
let player1Token, player2Token;
let boardFilled = false;
let gameOver = false;
let lastMove = null;
let moves = [];

function checkNoWinPossibility() {
    for (let column = 0; column < 7; column++) {
        for (let row = 0; row < 6; row++) {
            const cell = document.querySelector(`[data-column="${column}"][data-row="${row}"]`);
            if (!cell.classList.contains('red') && !cell.classList.contains('yellow')) {
                cell.classList.add(player1Token);
                if (checkWin(column, row, player1Token)) {
                    cell.classList.remove(player1Token);
                    return false;
                }
                cell.classList.remove(player1Token);

                cell.classList.add(player2Token);
                if (checkWin(column, row, player2Token)) {
                    cell.classList.remove(player2Token);
                    return false;
                }
                cell.classList.remove(player2Token);
            }
        }
    }
    return true;
}

function undoLastMove() {
    if (moves.length === 0) return;

    lastMove = moves.pop();
    const column = lastMove.column;
    const row = lastMove.row;
    const cell = document.querySelector(`[data-column="${column}"][data-row="${row}"]`);
    cell.classList.remove(player1Token);
    cell.classList.remove(player2Token);

    currentPlayer = 3 - currentPlayer;
    gameStatus.textContent = `Au tour de ${currentPlayer === 1 ? player1Name : player2Name}`;
}

function createBoard() {
    for (let i = 0; i < 7; i++) {
        const column = document.createElement('div');
        column.classList.add('column');
        column.dataset.column = i;
        columns.push(column);

        for (let j = 0; j < 6; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.column = i;
            cell.dataset.row = j;
            column.appendChild(cell);
        }

        board.appendChild(column);
    }
}

function initGame() {
    player1Name = player1.value;
    player2Name = player2.value;
    player1Token = player1Color.value;
    player2Token = player1Token === 'red' ? 'yellow' : 'red';
    currentPlayer = 1;
    gameStatus.textContent = `Au tour de ${player1Name}`;
}

function dropToken(column) {
    for (let i = 5; i >= 0; i--) {
        const cell = column.querySelector(`[data-row="${i}"]`);
        if (!cell.classList.contains('red') && !cell.classList.contains('yellow')) {
            cell.classList.add(currentPlayer === 1 ? player1Token : player2Token);
            return parseInt(cell.dataset.row);
        }
    }
    return -1;
}

function checkWin(column, row, color) {
    const directions = [
        { x: 1, y: 0 }, // horizontal
        { x: 0, y: 1 }, // vertical
        { x: 1, y: 1 }, // diagonal /
        { x: 1, y: -1 } // diagonal \
    ];

    for (const direction of directions) {
        let count = 0;
        for (let i = -3; i <= 3; i++) {
            const x = column + i * direction.x;
            const y = row + i * direction.y;
            if (x >= 0 && x < 7 && y >= 0 && y < 6) {
                const cell = document.querySelector(`[data-column="${x}"][data-row="${y}"]`);
                if (cell.classList.contains(color)) {
                    count++;
                    if (count === 4) return true;
                } else {
                    count = 0;
                }
            }
        }
    }
    return false;
}

function checkDraw() {
    return columns.every(column => column.querySelector('[data-row="0"]').classList.contains('red') || column.querySelector('[data-row="0"]').classList.contains('yellow'));
}

function handleClick(event) {
    if (gameOver) return;

    const column = parseInt(event.target.dataset.column);
    const row = dropToken(columns[column]);

    if (row < 0) return;

    moves.push({ column: column, row: row });

    if (checkWin(column, row, currentPlayer === 1 ? player1Token : player2Token)) {
        gameStatus.textContent = `${currentPlayer === 1 ? player1Name : player2Name} a gagné !`;
        gameOver = true;
    } else if (checkDraw()) {
        gameStatus.textContent = "Match nul !";
        gameOver = true;
    } else {
        currentPlayer = 3 - currentPlayer;
        gameStatus.textContent = `Au tour de ${currentPlayer === 1 ? player1Name : player2Name}`;
    }
}

function resetGame() {
    // Supprime toutes les colonnes du plateau
    for (const column of columns) {
        board.removeChild(column);
    }
    // Vide le tableau des colonnes
    columns.length = 0;

    // Crée un nouveau plateau
    createBoard();

    currentPlayer = 1;
    gameOver = false;
    gameStatus.textContent = '';
}

createBoard();
board.addEventListener('click', handleClick);
replay.addEventListener('click', undoLastMove);
startGame.addEventListener('click', initGame);
reset.addEventListener('click', resetGame);

replay.addEventListener('click', undoLastMove);