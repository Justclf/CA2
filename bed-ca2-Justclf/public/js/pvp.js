document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Please log in to access the PVP Arena');
        window.location.href = 'login.html';
        return;
    }
    
    // Load PVP data
    loadPlayerStats();
    loadAvailablePlayers();  
});

// load users stats
function loadPlayerStats() {
    const token = localStorage.getItem('token');
    
    const callback = (responseStatus, responseData) => {
        console.log("Player stats responseStatus:", responseStatus);
        console.log("Player stats responseData:", responseData);
        
        if (responseStatus === 200) {
            document.getElementById('playerName').textContent = responseData.username;
            document.getElementById('playerXP').textContent = responseData.xp;
            document.getElementById('playerRank').textContent = responseData.rank;
        } else {
            console.error("Failed to load player stats:", responseData);
            document.getElementById('playerName').textContent = 'Unknown';
            document.getElementById('playerXP').textContent = '0';
            document.getElementById('playerRank').textContent = 'E-Hunter';
        }
    };
    
    fetchMethod(currentUrl + "/api/pvp/stats", callback, "GET", null, token);
}

// load the players to fight
function loadAvailablePlayers() {
    const token = localStorage.getItem('token');
    
    const callback = (responseStatus, responseData) => {
        console.log("Available players responseStatus:", responseStatus);
        console.log("Available players responseData:", responseData);
        
        if (responseStatus === 200) {
            displayAvailablePlayers(responseData);
        } else {
            console.error("Failed to load available players:", responseData);
        }
    };
    
    fetchMethod(currentUrl + "/api/pvp/players", callback, "GET", null, token);
}

// show all playesrs
function displayAvailablePlayers(players) {
    const playersList = document.getElementById('playersList');
    
    playersList.innerHTML = players.map(player => {
        return `
            <div class="player-card" data-id="${player.id}">
                <div class="player-info">
                    <div class="player-name">${player.username}</div>
                    <div class="player-details">
                        <span class="player-xp">XP: ${player.XP || 0}</span>
                        <span class="player-rank">${player.user_rank}</span>
                    </div>
                </div>
                <button class="challenge-btn" onclick="challengePlayer(${player.id}, '${player.username}')">
                    Challenge Hunter
                </button>
            </div>
        `;
    }).join('');
}

// challenge a player
function challengePlayer(opponentId, opponentName) {
    const token = localStorage.getItem('token');
    
    if (!confirm(`Are you sure you want to challenge ${opponentName}?`)) {
        return;
    }

    const data = {
        opponent_id: opponentId
    };
    
    const callback = (responseStatus, responseData) => {
        console.log("Challenge responseStatus:", responseStatus);
        console.log("Challenge responseData:", responseData);
        
        
        if (responseStatus === 201) {
            showBattleResult(responseData);
            setTimeout(() => {
                loadPlayerStats();
                loadAvailablePlayers();
            }, 1000);
        } else {
            alert(responseData.message || 'Failed to challenge player. Please try again.');
        }
    };
    
    fetchMethod(currentUrl + "/api/pvp/challenge", callback, "POST", data, token);
}

// show battle result
function showBattleResult(battleData) {
    const battleResult = document.getElementById('battleResult');
    const battleTitle = document.getElementById('battleTitle');
    const battleSummary = document.getElementById('battleSummary');
    
    const isWinner = battleData.winner.name === document.getElementById('playerName').textContent;
    
    battleTitle.textContent = isWinner ? 'VICTORY!' : 'DEFEAT!';
    battleTitle.style.color = isWinner ? '#28a745' : '#dc3545';
    
    battleSummary.innerHTML = `
        <div style="margin-bottom: 15px; font-size: 1.2rem;">
            <strong>${battleData.result}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div style="text-align: center;">
                <strong>Winner:</strong><br>
                ${battleData.winner.name}<br>
                <span style="color: #28a745;">${battleData.winner.rank}</span>
            </div>
            <div style="text-align: center;">
                <strong>Loser:</strong><br>
                ${battleData.loser.name}<br>
                <span style="color: #dc3545;">${battleData.loser.rank}</span>
            </div>
        </div>
        <div style="text-align: center; margin-top: 15px; font-style: italic;">
            ${isWinner ? 
                'Your higher rank secured the victory!' : 
                'Train harder to improve your rank!'}
        </div>
    `;
    
    battleResult.classList.remove('d-none');
}

// close battle result modal
function closeBattleResult() {
    const battleResult = document.getElementById('battleResult');
    battleResult.classList.add('d-none');
}