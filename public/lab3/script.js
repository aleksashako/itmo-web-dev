let board = createEmptyBoard();
let curPosition = [];
let leaderBoard = [];
let score = 56695;

function loadPage() {
    let body = document.querySelector('body');

    const header = document.createElement('header');
    header.className = 'page-header';

    const title = document.createElement('h1');
    title.textContent = '2048';

    header.appendChild(title);

    const main = document.createElement('main');
    main.className = 'content';

    main.appendChild(header);

    const container = document.createElement('div');
    container.id = 'gameContainer';
    container.className = 'game-container';
    main.appendChild(container);

    const controlsPanel = document.createElement('div');
    controlsPanel.className = 'controls-panel';
    container.appendChild(controlsPanel);

    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'score-container';
    
    const scoreLabel = document.createElement('span');
    scoreLabel.textContent = 'score: ';
    scoreLabel.className = 'score-label';
    
    const currentScore = document.createElement('span');
    currentScore.id = 'curr-score';
    currentScore.className = 'curr-score';
    currentScore.textContent = score;
    
    scoreContainer.appendChild(scoreLabel);
    scoreContainer.appendChild(currentScore);
    controlsPanel.appendChild(scoreContainer);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'buttons-container';
    
    const restartButton = document.createElement('button');
    restartButton.id = 'restart-btn';
    restartButton.className = 'control-btn';
    restartButton.textContent = 'Restart game';
    
    const leaderBoardButton = document.createElement('button');
    leaderBoardButton.id = 'leaderboard-btn';
    leaderBoardButton.className = 'control-btn';
    leaderBoardButton.textContent = 'Leaderboard';
    
    buttonsContainer.appendChild(restartButton);
    buttonsContainer.appendChild(leaderBoardButton);
    controlsPanel.appendChild(buttonsContainer);

    const playingFieldContainer = document.createElement('div');
    playingFieldContainer.id = 'playingFieldContainer';
    playingFieldContainer.className = 'playing-field-container';
    container.appendChild(playingFieldContainer);

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const tile = document.createElement('div');
            tile.id = `tile-${row}-${col}`;
            tile.className = 'tile';
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.textContent = ''; 
            
            playingFieldContainer.appendChild(tile);
        }
    }

    restartButton.addEventListener('click', () => {
        resetGame();
    });

    leaderBoardButton.addEventListener('click', () => {
        openLeaderBoardModal();
    });        

    body.appendChild(main);

    loadFromStorageGame();
    // renderBoard();
    updateMainScore(); 
}

function createEmptyBoard() {
  const arr = [];
  for (let r = 0; r < 4; r++) {
    arr.push(new Array(4).fill(0));
  }
  return arr;
}

function saveToStorageGame() {
    localStorage.setItem('currentGamePosition', JSON.stringify(curPosition));
}

function loadFromStorageGame() {
    const curPos = localStorage.getItem('currentGamePosition');
    if (curPos) {
        curPosition = JSON.parse(curPos);
    }
}

function saveToStorageLeaderBoard() {
    localStorage.setItem('currentLeaderBoard', JSON.stringify(leaderBoard)); 
}

function loadFromStorageLeaderBoard() {
    const curLeaderB = localStorage.getItem('currentLeaderBoard'); 
    if (curLeaderB) {
        leaderBoard = JSON.parse(curLeaderB); 
    }
}

// function renderBoard() {
//     for (let r = 0; r < 4; r++) {
//         for (let c = 0; c < 4; c++) {
//             const tile = document.getElementById(`tile-${r}-${c}`);
//             updateTile(tile, board[r][c]);
//         }
//     }
// }

// для перезагрзки
function updateMainScore() {
    const currentScoreElement = document.getElementById('curr-score');
    if (currentScoreElement) {
        currentScoreElement.textContent = score;
    }
}

function resetScore() {
    score = 0;
    updateMainScore();
    updateScoreDisplay();
}

function resetGame() {
    score = 0;
    board = createEmptyBoard();
    updateMainScore();
    updateScoreDisplay();
}



document.addEventListener('DOMContentLoaded', () => {
    loadPage();
    createFinishModal(); 
    createLeaderBoardModal();
});