document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");

    // Check if user have assigned token
    if (!token) {
        alert("Please log in to view the quests");
        window.location.href = "login.html";
        return
    }

    // load user profile
    loadUserProfile(token);

    // load all quests
    loadAllQuests(token);

    // show the quest creation
    loadQuestCreation(token);
});


// Loads the user information in quest page
function loadUserProfile(token) {
    const callback = (responseStatus, responseData) => {
        console.log("User profile responseStatus:", responseStatus);
        console.log("User profile responseData:", responseData);

        if (responseStatus === 200) {
            document.getElementById("currentHunter").textContent = responseData.username;
            document.getElementById("currentXP").textContent = responseData.xp;
            document.getElementById("currentRank").textContent = responseData.rank;
        } else {
            console.error("Failed to load user profile:", responseData);
            document.getElementById("currentHunter").textContent = "Unknown";
            document.getElementById("currentXP").textContent = "---";
            document.getElementById("currentRank").textContent = "Unknown Hunter";
        }
    }
    fetchMethod(currentUrl + "/api/profile", callback, "GET", null, token) // Is GET because we are retrieving the information, and null means that no data is sending to the request body. While token is there becuase it needs to authenticate the users
}



// Load the quests
function displayQuests(quests, token) {
    const questsSection = document.querySelector('.quests-section') // selecting the quests-section css
    // remove existing quest if exist
    let questsList = questsSection.querySelector('.quests-list');
    if (questsList) {
        questsList.remove();
    }

    questsList = document.createElement('div') // Create div element
    questsList.className = 'quests-list';
    questsSection.appendChild(questsList);

    if (!quests || quests.length === 0) {
        showNoQuests("No quests available");
        return; 
    }

    // create quest cards
    quests.forEach((quest) => {
        const questCard = createQuestCard(quest, token);
        questsList.appendChild(questCard);
    });
}


function createQuestCard(quest, token) {
    const difficultyRankMap = {
        'Beginner': 'E-Rank',
        'Intermediate': 'D-Rank', 
        'Advanced': 'C-Rank',
        'Expert': 'B-Rank',
        'Master': 'A-Rank',
        'Legendary': 'S-Rank'
    };

    const rankDisplay = difficultyRankMap[quest.recommended_rank] || quest.recommended_rank;
    const isOwnQuest = quest.isOwner || false;

    const questDiv = document.createElement('div');
    questDiv.className = `quest-card ${isOwnQuest ? 'own-quest' : ''}`; // quest-card.own-quest, ai 

    questDiv.innerHTML = `
        <div class="quest-header">
            <div class="quest-info-badge">
                Quest Info
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

        <div class="quest-warning">
            <div class="quest-warning-title">Caution!</div>
            <div class="quest-warning-text">
                ${isOwnQuest ? 
                    'This is your quest. You can delete it but cannot accept it.' : 
                    'Once accepted, you must complete this quest to gain XP rewards.'}
            </div>
        </div>

        <div class="quest-actions">
            ${isOwnQuest ?
                `<button class="delete-quest-btn" onclick="deleteQuest('${quest.id}', '${token}')">Delete Quest</button>` :
                `<button class="accept-btn" onclick="acceptQuest('${quest.id}', '${token}')">Accept Quest</button>`
            }
        </div>
    `;
    return questDiv;
}



function showNoQuests(message) {
    const questsSection = document.querySelector('.quests-section') // link to css
    let questsList = questsSection.querySelector('.quests-list')

    if (!questsList) {
        questsList = document.createElement('div');
        questsList.className = 'quests-list';
        questsSection.appendChild(questsList);
    }
    questsList.innerHTML = `<div class="no-quests">${message}</div>`;
}



function loadQuest(token) {
    const createForm = document.getElementById('createQuestForm');

    if (createForm) {
        createForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const data = {
                questTitle: document.getElementById('questTitle').value,
                questDescription: document.getElementById('questDescription').value,
                questDifficulty: document.getElementById('questDifficulty').value,
                questXP: parseInt(document.getElementById('questXP').value) || 1
            };

            // Validate the data
            if (!data.questTitle || !data.questDescription || !data.questDifficulty) {
                alert("Please fill in all require fields");
                return;
            }
             
            if(data.questXP < 1 || data.questXP > 100) {
                alert('XP reward must be between 1 and 100');
                return;
            }

            const callback = (responseStatus, responseData) => {
                console.log("Create quest responseStatus:", responseStatus)
                console.log("Create quest responseData:", responseData);

                if (responseStatus === 201 || responseStatus === 200) {
                    alert("Quest created successfully!");
                    createForm.reset();
                    loadAllQuests(token);
                    loadUserProfile(token);
                } else {
                    alert(responseData.message || `Failed to create quest. Please try again`)
                }
            }
            fetchMethod(currentUrl + "/api/quests", callback, "POST", data, token)
        })
    }
}


// Accept the quest
function acceptQuest(questId, token) {
    const callback = (responseStatus, responseData) => {
        console.log("Accept quest responseStatus:", responseStatus);
        console.log("Accept quest responseData:", responseData);

        if (responseStatus === 200 ) {
            alert('Quest accepted');
            loadAllQuests(token);
            loadUserProfile(token);
        } else {
            alert (responseData.message || 'Failed to accept quest. Please try again')
        }
    };
    fetchMethod(currentUrl + `/api/quests/${questId}/accept`, callback, "POST", null, token)
}


// Delete the quest
function deleteQuest(questId, token) {
    if (!confirm("Are you sure you want to delete this quest?")) {
        return;
    }
    const callback = (responseStatus, responseData) => {
        console.log("Deleted quest responseStatus:", responseStatus);
        console.log("Deleted quest responseData:", responseData);

        if (responseStatus === 200) {
            alert('Quest deleted');
            loadAllQuests(token);
            loadUserProfile(token);
        } else {
            alert(responseData.message || "Failed to delete quest. Please try again")
        }
    }
    fetchMethod(currentUrl + `/api/quests/${questId}`, callback, "DELETE", null, token)
}



function loadAllQuests(token) {
    const callback = (responseStatus, responseData) => {
        console.log("Quest responseStatus:", responseStatus);
        console.log("Quest responseData:", responseData);

        if(responseStatus === 200) {
            displayQuests(responseData, token);
        } else {
            console.error("Failed to load quests:", responseData);
            showNoQuests("Failed to load quest. Please try again.");
        }
    }
    fetchMethod(currentUrl + "/api/quests", callback, "GET", null, token)
}





