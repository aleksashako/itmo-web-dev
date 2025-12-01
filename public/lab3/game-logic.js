let score = 0;
let rows = 4;
let columns = 4;
var board;

let prevBoard = null;
let prevScore = 0;
let hasPreviousState = false;

function setGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
    score = 0;

    const playingFieldContainer = document.getElementById('playingFieldContainer');
    playingFieldContainer.innerHTML = '';

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = 'tile-' + r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            playingFieldContainer.appendChild(tile);
        }
    }

    if (isBoardEmpty()) {
        generateTiles();
    } else {
        updateAllTiles();
    }

    saveToStorageGame();
}

function isBoardEmpty() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] !== 0) {
                return false;
            }
        }
    }
    return true;
}

function canContinueGame() {
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) return true;
            if (c < columns - 1 && board[r][c] === board[r][c + 1]) {
                return true;
            }
            if (r < rows - 1 && board[r][c] === board[r + 1][c]) {
                return true;
            }
        }
    return false;
}

function hasEmptyCells() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }
    return false;
}

function generateTiles() {
    if (!canContinueGame()) {
        openGameOverModal();
        return;
    }
    
    if (hasEmptyCells()) {
        let i = 0;
        let count = Math.floor(Math.random() * 2 + 1);
        let attempts = 0;
        const maxAttempts = 10; 

        while (i < count && attempts < maxAttempts) {
            let r = Math.floor(Math.random() * rows);
            let c = Math.floor(Math.random() * columns);

            if (board[r][c] == 0) {
                let randomTile = Math.random() < 0.8 ? 2 : 4;
                board[r][c] = randomTile;

                let tile = document.getElementById('tile-' + r.toString() + '-' + c.toString());
                updateTile(tile, randomTile);

                i++;
            }
            attempts++;
        }

        if (!canContinueGame()) {
            openGameOverModal();
            return;
        }

        saveToStorageGame();
    }
    else {
        if (!canContinueGame()) {
            openGameOverModal();
            return;
        }
    }
}

function updateTile(tile, num) {
    tile.textContent = "";
    tile.classList.value = "";
    tile.classList.add("tile");

    if (num > 0) {
        tile.textContent = num.toString();

        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

function updateAllTiles() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById('tile-' + r.toString() + '-' + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

document.addEventListener('keyup', (e) => {

    if (e.code == "ArrowLeft") {
        saveStateForUndo();
        slideLeft();
        generateTiles();
    }
    else if (e.code == "ArrowRight") {
        saveStateForUndo();
        slideRight();
        generateTiles();
    }
    else if (e.code == "ArrowUp") {
        saveStateForUndo();
        slideUp();
        generateTiles();
    }
    else if (e.code == "ArrowDown") {
        saveStateForUndo();
        slideDown();
        generateTiles();
    }

    updateScore();
});

function getRidOfZeros(row) {
    return row.filter(num => num != 0);
}

function merge(row) {
    // remove 0
    row = getRidOfZeros(row);

    let changed = true; 
    
    // not like in basic 2048, merge till no other options
    while (changed) {
        changed = false;
        let newRow = [];
        // merging
        for (let i = 0; i < row.length; i++) {
            if (i < row.length - 1 && row[i] === row[i + 1]) {
                const merged = row[i] * 2;
                newRow.push(merged);
                score += merged;
                i++; 
                changed = true;
            } else {
                newRow.push(row[i]);
            }
        }
        row = getRidOfZeros(newRow); 
    }

    // add 0 back
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}



function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = merge(row);
        board[r] = row;

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById('tile-' + r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = merge(row);
        board[r] = row.reverse();

        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById('tile-' + r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = merge(row);

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById('tile-' + r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = merge(row);
        row.reverse();

        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById('tile-' + r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

// всё для отмены хода
function saveStateForUndo() {
    prevBoard = copyBoard(board);
    prevScore = score;
    hasPreviousState = true;

    updateUndoButton();
}

function copyBoard(boardToCopy) {
    return boardToCopy.map(row => [...row]);
}

function undo() {
    if (!hasPreviousState) return;

    board = copyBoard(prevBoard);
    score = prevScore;

    updateAllTiles();
    updateScore();

    saveToStorageGame();
    saveToStorageScore();

    hasPreviousState = false;
    prevBoard = null;
    prevScore = 0;

    updateUndoButton();
}

function updateUndoButton() {
    const undoButton = document.getElementById('undo-btn');
    if (undoButton) {
        undoButton.disabled = !hasPreviousState;
    }
}
