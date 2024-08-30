var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    setTwo();
    setTwo();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; // clear the classList
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener('keyup', (e) => {
    let madeMove = false;
    if (e.code == "ArrowLeft") {
        madeMove = slideLeft();
    } else if (e.code == "ArrowRight") {
        madeMove = slideRight();
    } else if (e.code == "ArrowUp") {
        madeMove = slideUp();
    } else if (e.code == "ArrowDown") {
        madeMove = slideDown();
    }

    if (madeMove) {
        setTwo();
        document.getElementById("score").innerText = score;
        if (!canMakeMove()) {
            showGameOver();
        }
    }
});

function filterZero(row) {
    return row.filter(num => num != 0); // create new array of all nums != 0
}

function slide(row) {
    row = filterZero(row); // [2, 2, 2]
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row); // [4, 2]
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = [...row];
        row = slide(row);
        board[r] = row;
        if (row.toString() !== originalRow.toString()) {
            moved = true;
        }
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideRight() {
    let moved = false;
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        let originalRow = [...row];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
        if (row.toString() !== originalRow.toString()) {
            moved = true;
        }
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
    return moved;
}

function slideUp() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalRow = [...row];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if (row.toString() !== originalRow.toString()) {
            moved = true;
        }
    }
    return moved;
}

function slideDown() {
    let moved = false;
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        let originalRow = [...row];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
        if (row.toString() !== originalRow.toString()) {
            moved = true;
        }
    }
    return moved;
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function canMakeMove() {
    if (hasEmptyTile()) return true;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 1; c++) {
            if (board[r][c] == board[r][c + 1]) {
                return true;
            }
        }
    }
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 1; r++) {
            if (board[r][c] == board[r + 1][c]) {
                return true;
            }
        }
    }
    return false;
}

function showGameOver() {
    let boardElement = document.getElementById("board");
    let gameOverDiv = document.createElement("div");
    gameOverDiv.id = "game-over";
    gameOverDiv.innerText = "Game Over";
    boardElement.appendChild(gameOverDiv);
    setTimeout(() => {
        gameOverDiv.remove();
        resetGame();
    }, 2000);
}

function resetGame() {
    score = 0;
    document.getElementById("board").innerHTML = "";
    setGame();
}
