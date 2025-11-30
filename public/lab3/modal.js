// GAME OVER MODAL PART
function createGameOverModal() {
    let modal = document.createElement('div');
    modal.id = 'gameOverModal';
    modal.className = 'game-over-modal';
    
    let modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    let modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    let modalTitle = document.createElement('h3');
    modalTitle.id = 'game-over-modal-title';
    modalTitle.textContent = 'Game is over...';
    modalHeader.appendChild(modalTitle);

    let modalTitleSaved = document.createElement('h3');
    modalTitleSaved.id = 'game-over-modal-title-saved';
    modalTitleSaved.textContent = 'Result saved to leaderboard!';
    modalTitleSaved.style.display = 'none';
    modalHeader.appendChild(modalTitleSaved);
    
    let modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    let scoreContainer = document.createElement('div');
    scoreContainer.id = 'scoreContainerModal';
    scoreContainer.className = 'score-container';
    
    let scoreLabel = document.createElement('span');
    scoreLabel.textContent = 'Your score: ';
    
    let currentScore = document.getElementById('curr-score').cloneNode(true);
    currentScore.id = 'modal-curr-score';
    
    scoreContainer.appendChild(scoreLabel);
    scoreContainer.appendChild(currentScore);
    
    let nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'playerName';
    nameInput.placeholder = 'write down your name';
    
    let buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'modal-buttons';
    
    const saveBtn = document.createElement('button');
    saveBtn.id = 'saveResultToLeaderBoardBtn';
    saveBtn.className = 'save-result-button';
    saveBtn.textContent = 'save to leaderboard';
    
    const restartBtn = document.createElement('button');
    restartBtn.id = 'restartBtn';
    restartBtn.className = 'restart-button';
    restartBtn.textContent = 'restart game without saving';

    const restartAfterSaveBtn = document.createElement('button');
    restartAfterSaveBtn.id = 'restartAfterSaveBtn';
    restartAfterSaveBtn.className = 'restart-button';
    restartAfterSaveBtn.textContent = 'restart game';
    restartAfterSaveBtn.style.display = 'none';
    
    buttonsContainer.appendChild(saveBtn);
    buttonsContainer.appendChild(restartBtn);
    buttonsContainer.appendChild(restartAfterSaveBtn);
    
    modalBody.appendChild(scoreContainer);
    modalBody.appendChild(nameInput);
    modalBody.appendChild(buttonsContainer);
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);

    // кнопка временная, для проверки модального окна
    const openGameOverModalBtn = document.createElement('button');
    openGameOverModalBtn.id = 'openGameOverModalBtn';
    openGameOverModalBtn.textContent = 'open game over modal';
    document.body.appendChild(openGameOverModalBtn);
    
    setupModalEventListeners();
}

function setupModalEventListeners() {
    let modal = document.getElementById('gameOverModal');
    let saveBtn = document.getElementById('saveResultToLeaderBoardBtn');
    let restartBtn = document.getElementById('restartBtn');
    let restartAfterSaveBtn = document.getElementById('restartAfterSaveBtn');
  
    saveBtn.addEventListener('click', function() {
        saveScoreToLeaderboard();
        resetScore();
        afterSaveActions();

    });
    
    restartBtn.addEventListener('click', function() {
        resetGame();
        closeGameOverModal();
    });

    restartAfterSaveBtn.addEventListener('click', function() {
        resetGame();
        closeGameOverModal();

    })
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeGameOverModal();
        }
    });

    let openModal = document.getElementById('openGameOverModalBtn');
    openModal.addEventListener('click',  function() {
        openGameOverModal();
    })
}

function openGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'block';
}

function closeGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    modal.style.display = 'none';
}

function afterSaveActions() {
    const modal = document.getElementById('gameOverModal');
    let nameInput = document.getElementById('playerName');
    let prevTitle = document.getElementById('game-over-modal-title');
    let newTitle = document.getElementById('game-over-modal-title-saved');
    let scoreContainerModal = document.getElementById('scoreContainerModal');
    let saveBtn = document.getElementById('saveResultToLeaderBoardBtn');
    let restartBtn = document.getElementById('restartBtn');
    let newRestartBtn = document.getElementById('restartAfterSaveBtn');

    nameInput.style.display = 'none';
    prevTitle.style.display = 'none';
    newTitle.style.display = 'block';
    scoreContainerModal.style.display = 'none';
    saveBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    newRestartBtn.style.display = 'block';
}

// LEADERBORAD PART
function createLeaderBoardModal() {
    let modal = document.createElement('div');
    modal.id = 'leaderBoardModal';
    modal.className = 'leaderboard-modal';
    
    let modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    let modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    let modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Leaderboard';
    modalHeader.appendChild(modalTitle);
    
    let closeBtn = document.createElement('span');
    closeBtn.className = 'close-leaderboard';
    closeBtn.textContent = '×';
    closeBtn.style.cssText = 'float: right; font-size: 24px; cursor: pointer; color: #aaa;';
    closeBtn.addEventListener('click', closeLeaderBoardModal);
    modalHeader.appendChild(closeBtn);
    
    let modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    const leaderTable = document.createElement('table');
    leaderTable.id = 'leaderboardTable';
    leaderTable.className = 'leaderboard-table';
    
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const headers = ['#', 'Name', 'Score', 'Date & Time'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    thead.appendChild(headerRow);
    leaderTable.appendChild(thead);
    
    const tbody = document.createElement('tbody');
    tbody.id = 'leaderboardTableBody';
    leaderTable.appendChild(tbody);
    
    modalBody.appendChild(leaderTable);

    const clearButton = document.createElement('button');
    clearButton.id = 'clearLeaderboardBtn';
    clearButton.className = 'clear-leaderboard-button';
    clearButton.textContent = 'Clear Leaderboard';
    clearButton.addEventListener('click', clearLeaderboard);
    modalBody.appendChild(clearButton);
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
}

function clearLeaderboard() {
    leaderBoard = []; 
    saveToStorageLeaderBoard(); 
    updateLeaderboardTable(); 
}

function openLeaderBoardModal() {
    updateLeaderboardTable();
    const leaderBoardModal = document.getElementById('leaderBoardModal');
    leaderBoardModal.style.display = 'block';
}

function closeLeaderBoardModal() {
    const leaderBoardModal = document.getElementById('leaderBoardModal');
    leaderBoardModal.style.display = 'none';
}

function saveScoreToLeaderboard() {
    const playerName = document.getElementById('playerName').value;
    
    leaderBoard.push({
        name: playerName,
        score: score,
        date: new Date().toLocaleString(),
        timestamp: new Date().getTime()
    });
    
    leaderBoard.sort((a, b) => b.score - a.score);
    
    if (leaderBoard.length > 10) {
        leaderBoard.length = 10;
    }
    
    saveToStorageLeaderBoard();
    resetGame();
}

function updateLeaderboardTable() {
    const tbody = document.getElementById('leaderboardTableBody');
    if (!tbody) return;
    
    tbody.textContent = '';
    
    loadFromStorageLeaderBoard();
    
    if (!leaderBoard || leaderBoard.length === 0) { 
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 4;
        emptyCell.className = 'no-records';
        emptyCell.textContent = 'No records yet. Be the first!';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
        return;
    }
    
    const topRecords = leaderBoard.slice(0, 10); 
    
    topRecords.forEach((record, index) => {
        const row = document.createElement('tr');
        
        const numberCell = document.createElement('td');
        numberCell.textContent = index + 1;
        row.appendChild(numberCell);
        
        const nameCell = document.createElement('td');
        nameCell.textContent = record.name || 'Unknown';
        row.appendChild(nameCell);
        
        const scoreCell = document.createElement('td');
        scoreCell.textContent = record.score || 0;
        row.appendChild(scoreCell);
        
        const dateCell = document.createElement('td');
        if (record.date) {
            dateCell.textContent = record.date;
        } else if (record.timestamp) {
            dateCell.textContent = new Date(record.timestamp).toLocaleString();
        } else {
            dateCell.textContent = new Date().toLocaleString();
        }
        row.appendChild(dateCell);
        
        tbody.appendChild(row);
    });
}
