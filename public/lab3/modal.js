// FINISH MODAL PART
function createFinishModal() {
    let modal = document.createElement('div');
    modal.id = 'finishModal';
    modal.className = 'finish-modal';
    
    let modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    let modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    
    let modalTitle = document.createElement('h3');
    modalTitle.textContent = 'Game is over...';
    modalHeader.appendChild(modalTitle);
    
    let modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    let scoreDisplay = document.createElement('div');
    scoreDisplay.className = 'score-display';
    scoreDisplay.textContent = `Your score: ${score}`;
    
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
    
    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'cancelBtn';
    cancelBtn.className = 'cancel-button';
    cancelBtn.textContent = 'do not save';

    const restartBtn = document.createElement('button');
    restartBtn.id = 'restartBtn';
    restartBtn.className = 'restart-button';
    restartBtn.textContent = 'restart game without saving';
    
    buttonsContainer.appendChild(saveBtn);
    buttonsContainer.appendChild(cancelBtn);
    buttonsContainer.appendChild(restartBtn);
    
    modalBody.appendChild(scoreDisplay);
    modalBody.appendChild(nameInput);
    modalBody.appendChild(buttonsContainer);
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);

    // кнопка временная, для проверки модального окна
    const openFinishModalBtn = document.createElement('button');
    openFinishModalBtn.id = 'openFinishModalBtn';
    openFinishModalBtn.textContent = 'open finish modal';
    document.body.appendChild(openFinishModalBtn);
    
    setupModalEventListeners();
}

function setupModalEventListeners() {
    let modal = document.getElementById('finishModal');
    let cancelBtn = document.getElementById('cancelBtn');
    let saveBtn = document.getElementById('saveResultToLeaderBoardBtn');
    let restartBtn = document.getElementById('restartBtn');

    cancelBtn.addEventListener('click', function() {
        closeFinishModal();
    });
    
    saveBtn.addEventListener('click', function() {
        saveScoreToLeaderboard();
    });
    
    restartBtn.addEventListener('click', function() {
        resetGame();
        closeFinishModal();
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeFinishModal();
        }
    });

    let openModal = document.getElementById('openFinishModalBtn');
    openModal.addEventListener('click',  function() {
        openFinishModal();
    })
}

function openFinishModal() {
    updateScoreDisplay(); 
    const modal = document.getElementById('finishModal');
    modal.style.display = 'block';
}

function closeFinishModal() {
    const modal = document.getElementById('finishModal');
    modal.style.display = 'none';
}

function updateScoreDisplay() {
    const scoreElement = document.getElementById('currentScore');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
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
    
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);
    
    document.body.appendChild(modal);
    
    setupLeaderboardEventListeners();
}

function setupLeaderboardEventListeners() {
    const modal = document.getElementById('leaderBoardModal'); 
    const closeBtn = document.getElementById('closeLeaderboardBtn');
    
    closeBtn.addEventListener('click', closeLeaderBoardModal);
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeLeaderBoardModal();
        }
    });
    
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeLeaderBoardModal();
        }
    });
}

function openLeaderBoardModal() {
    updateLeaderBoardTable();
    const modal = document.getElementById('leaderBoardModal');
    modal.style.display = 'block';
}

function closeLeaderBoardModal() {
    const modal = document.getElementById('leaderBoardModal');
    modal.style.display = 'none';
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
       
    closeFinishModal();
    resetGame();
}

function updateLeaderBoardTable() {
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
