document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please log in to view your current quests");
        window.location.href = "login.html";
        return;
    }

    loadCurrentQuests(token);
});


// function to load the current quest
function loadCurrentQuests(token) {
    const callback = (responseStatus, responseData) => {
        console.log("Current quests loaded:", responseStatus, responseData);
        
        if (responseStatus === 200) {
            displayCurrentQuests(responseData, token);
        } else {
            console.error("Failed to load current quests:", responseData);
            showNoQuests("Failed to load your current quests.");
        }
    }
    fetchMethod(currentUrl + "/api/progress/current", callback, "GET", null, token);
}

// function to show the quest
function displayCurrentQuests(quests, token) {
    const questsList = document.getElementById('currentQuestsList');
    
    if (!quests || quests.length === 0) {
        showNoQuests("You have no current quests. <a href='quests.html'>Go to the Quests page</a> to accept some!");
        return;
    }

    questsList.innerHTML = quests.map(quest => createCurrentQuestCard(quest, token)).join('');
}


function showNoQuests(message) {
    const questsList = document.getElementById('currentQuestsList');
    questsList.innerHTML = `<div class="no-quests"><p>${message}</p></div>`;
}

// creating quest card
function createCurrentQuestCard(quest, token) {
    const difficultyRankMap = {
        'Beginner': 'E-Rank',
        'Intermediate': 'D-Rank', 
        'Advanced': 'C-Rank',
        'Expert': 'B-Rank',
        'Master': 'A-Rank',
        'Legendary': 'S-Rank'
    };

    const rankDisplay = difficultyRankMap[quest.recommended_rank] || quest.recommended_rank;
    const statusDisplay = quest.status === 'completed' ? 'COMPLETED' : 'IN PROGRESS';
    const statusClass = quest.status === 'completed' ? 'completed' : 'started';

    return `
        <div class="quest-card" data-status="${quest.status}">
            <div class="quest-header">
                <div class="quest-info-badge ${statusClass}">
                    ${statusDisplay}
                </div>
                <div class="quest-title">${quest.title}</div>
            </div>

            <div class="quest-goals">
                <div class="quest-goals-title">Objective</div>
                <div class="quest-description">
                    ${quest.description || 'No description provided'}
                </div>
            </div>

            <div class="quest-rewards">
                <div class="quest-xp">+${quest.xp_reward || 0} XP</div>
                <div class="quest-difficulty difficulty-${(quest.recommended_rank || 'beginner').toLowerCase()}">
                    ${quest.recommended_rank || 'Beginner'} (${rankDisplay})
                </div>
            </div>

            <div class="quest-warning ${statusClass}">
                <div class="quest-warning-title">
                    ${quest.status === 'completed' ? 'Quest Status' : 'Quest Status'}
                </div>
                <div class="quest-warning-text">
                    ${quest.status === 'completed' ? 
                        'Congratulations! You have successfully completed this quest and earned your XP reward!' : 
                        'This quest is currently in progress. Complete it to earn XP and advance your hunter rank!'}
                </div>
            </div>

            <div class="quest-actions">
                ${quest.status === 'started' ? 
                    `<button class="complete-btn" onclick="completeQuest('${quest.id}', '${token}')">
                        Complete Quest
                     </button>` :
                    `<button class="completed-btn" disabled>
                        Quest Completed
                     </button>`
                }
            </div>
        </div>
    `;
}

function completeQuest(questId, token) {
    if (!confirm('Are you sure you want to complete this quest?')) {
        return;
    }

    const button = event.target;
    const originalText = button.innerHTML;
    button.innerHTML = 'Completing...';
    button.disabled = true;

    const data = {};
    const callback = (responseStatus, responseData) => {
        button.innerHTML = originalText;
        button.disabled = false;
        
        console.log("Complete quest result:", responseStatus, responseData);
        
        if (responseStatus === 200) {
            alert(`Quest completed successfully! You earned XP. New rank: ${responseData.rank}`);
            loadCurrentQuests(token);
        } else {
            console.error("Failed to complete quest:", responseData);
            alert(responseData.message || 'Failed to complete quest. Please try again');
        }
    };
    
    fetchMethod(currentUrl + `/api/progress/${questId}/complete`, callback, "POST", data, token);
}