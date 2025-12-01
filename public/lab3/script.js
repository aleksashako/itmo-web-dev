let leaderBoard = [];

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
    
    const undoButton = document.createElement('button');
    undoButton.id = 'undo-btn';
    undoButton.className = 'control-btn';
    undoButton.textContent = '↩';

    const restartButton = document.createElement('button');
    restartButton.id = 'restart-btn';
    restartButton.className = 'control-btn';
    restartButton.textContent = 'Restart game';
    
    const leaderBoardButton = document.createElement('button');
    leaderBoardButton.id = 'leaderboard-btn';
    leaderBoardButton.className = 'control-btn';
    leaderBoardButton.textContent = 'Leaderboard';
    
    buttonsContainer.appendChild(undoButton);
    buttonsContainer.appendChild(restartButton);
    buttonsContainer.appendChild(leaderBoardButton);
    controlsPanel.appendChild(buttonsContainer);

    const playingFieldContainer = document.createElement('div');
    playingFieldContainer.id = 'playingFieldContainer';
    playingFieldContainer.className = 'playing-field-container';
    container.appendChild(playingFieldContainer);

    const mobileButtonsContainer = document.createElement('div');
    mobileButtonsContainer.id = 'mobileButtonsContainer';
    mobileButtonsContainer.className = 'mobile-btn-container';

    let mobBtn1 = document.createElement('button');
    mobBtn1.id = 'mob-btn-a';
    mobBtn1.className = 'mob-btn-a';
    mobBtn1.textContent = '◄';
    let mobBtn2 = document.createElement('button');
    mobBtn2.id = 'mob-btn-b';
    mobBtn2.className = 'mob-btn-b';
    mobBtn2.textContent = '▲';
    let mobBtn3 = document.createElement('button');
    mobBtn3.id = 'mob-btn-c';
    mobBtn3.className = 'mob-btn-c';
    mobBtn3.textContent = '▼';
    let mobBtn4 = document.createElement('button');
    mobBtn4.id = 'mob-btn-d';
    mobBtn4.className = 'mob-btn-d';
    mobBtn4.textContent = '►';
    mobileButtonsContainer.append(mobBtn1, mobBtn2, mobBtn3, mobBtn4);
    container.appendChild(mobileButtonsContainer);

    undoButton.addEventListener('click', () => {
        undo();
    });

    restartButton.addEventListener('click', () => {
        resetGame();
    });

    leaderBoardButton.addEventListener('click', () => {
        openLeaderBoardModal();
    });        

    body.appendChild(main);

    loadFromStorageGame();
    loadFromStorageScore();
    loadFromStorageLeaderBoard();

    setGame();
    addMobBtnListeners();
    updateAllTiles();
    updateUndoButton();
}

function addMobBtnListeners() {
    const mobBtnLeft = document.getElementById('mob-btn-a');
    const mobBtnRight = document.getElementById('mob-btn-d');
    const mobBtnUp = document.getElementById('mob-btn-b');
    const mobBtnDown = document.getElementById('mob-btn-c');
    
    if (mobBtnLeft) {
        mobBtnLeft.addEventListener('click', () => {
            saveStateForUndo();
            slideLeft();
            generateTiles();
            updateScore();
        });
    }
    
    if (mobBtnRight) {
        mobBtnRight.addEventListener('click', () => {
            saveStateForUndo();
            slideRight();
            generateTiles();
            updateScore();
        });
    }
    
    if (mobBtnUp) {
        mobBtnUp.addEventListener('click', () => {
            saveStateForUndo();
            slideUp();
            generateTiles();
            updateScore();
        });
    }
    
    if (mobBtnDown) {
        mobBtnDown.addEventListener('click', () => {
            saveStateForUndo();
            slideDown();
            generateTiles();
            updateScore();
        });
    }
}


function saveToStorageGame() {
    localStorage.setItem('currentGamePosition', JSON.stringify(board));
}

function loadFromStorageGame() {
    let savedBoard = localStorage.getItem('currentGamePosition');
    if (savedBoard) {
        board = JSON.parse(savedBoard);
    }
}

function saveToStorageScore() {
    localStorage.setItem('currentScore', score.toString()); 
}

function loadFromStorageScore() {
    let curScore = localStorage.getItem('currentScore');
    if (curScore) {
        score = parseInt(curScore) || 0; 
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

// для перезагрзки
function updateScore() {
    const currentScoreElement = document.getElementById('curr-score');
    const modalScoreElement = document.getElementById('modal-curr-score');
    
    if (currentScoreElement) {
        currentScoreElement.textContent = score;
    }
    if (modalScoreElement) {
        modalScoreElement.textContent = score;
    }
}

function resetScore() {
    score = 0;
    updateScore();
    saveToStorageScore();
}

function resetGame() {
    score = 0;
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    prevBoard = null;
    prevScore = 0;
    hasPreviousState = false;

    setGame();
    updateScore();
    saveToStorageScore();
    saveToStorageGame();
    updateUndoButton();
    resetModalState();
}

// просто чтобы побаловаться, добавляюю очки и проверить логику restart
function addToScore(points) {
    score += points;
    updateScore();
    saveToStorageScore(); 
}

document.addEventListener('DOMContentLoaded', () => {
    loadPage();
    createGameOverModal(); 
    createLeaderBoardModal();
});

