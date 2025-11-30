let score = 0;
let rows = 4;
let columns = 4;
var board;

function setGame() {

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

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

    let i = 0;
    let count = Math.floor(Math.random() * 2 + 1);
    while (i < count) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        if (board[r][c] == 0) {
            let randomTile = Math.random() < 0.8 ? 2 : 4;
            board[r][c] = randomTile;
            let tile = document.getElementById('tile-' + r.toString() + '-' + c.toString());
            updateTile(tile, randomTile);
            i++;
        }
    }
    saveToStorageGame();
}

function updateTile(tile, num) {
    tile.textContent = "";
    tile.classList.value = ""; 
    tile.classList.add("tile");
    if (num > 0) {
        tile.textContent = num.toString();
        if (num <= 4096) {
            tile.classList.add("x"+num.toString());
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
        slideLeft();
        generateTiles();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        generateTiles();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        generateTiles();
    }
    else if (e.code == "ArrowDown") {
        slideDown();
        generateTiles();
    }
    updateScore();
})

function getRidOfZeros(row){
    return row.filter(num => num != 0); 
}

function merge(row) {
    // remove 0
    row = getRidOfZeros(row); 
    // merging
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            score += row[i];
            row[i+1] = 0;

            // not like in basic 2048, merge till no other oprions
            for (let j = i + 1; j < row.length - 1; j++) {
                row[j] = row[j + 1];
                row[j + 1] = 0;
            }
        }
    } 
    row = getRidOfZeros(row);

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
        for (let c = 0; c < columns; c++){
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
        for (let c = 0; c < columns; c++){
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

        for (let r = 0; r < rows; r++){
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

        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById('tile-' + r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}