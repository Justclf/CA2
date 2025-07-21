// quests.js - Updated for your HTML structure
const currentUrl = window.location.origin;

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    
    // Check if user is logged in
    if (!token) {
        // User not logged in - redirect to login or show message
        alert("Please log in to view quests");
        window.location.href = "login.html";
        return;
    }
    
    // User is logged in - load quest data
    loadUserInfo(token);
    loadQuests(token);
    
    // Set up quest creation form
    setupQuestCreation(token);
    
    // Set up quest filters
    setupQuestFilters(token);
});

// Function to load user information (name, XP, rank)
function loadUserInfo(token) {
    const callback = (status, data) => {
        if (status === 200) {
            // Update user stats using your specific IDs
            document.getElementById('currentHunter').textContent = data.username || 'Unknown Hunter';
            document.getElementById('currentXP').textContent = data.xp || '0';
            document.getElementById('currentRank').textContent = data.rank || 'Novice';
        } else {
            console.error("Failed to load user info:", data);
            // Set default values
            document.getElementById('currentHunter').textContent = 'Unknown Hunter';
            document.getElementById('currentXP').textContent = '0';
            document.getElementById('currentRank').textContent = 'Novice';
        }
    };
    
    // Fetch user profile data
    fetchMethod(currentUrl + "/api/profile", callback, "GET", null, token);
}

// Function to load all quests
function loadQuests(token) {
    const callback = (status, data) => {
        if (status === 200) {
            displayQuests(data.quests || data, token); // Handle different API response formats
        } else {
            console.error("Failed to load quests:", data);
            showNoQuests("Failed to load quests. Please try again.");
        }
    };
    
    // Fetch all quests
    fetchMethod(currentUrl + "/api/quests", callback, "GET", null, token);
}

// Function to display quests in the UI
function displayQuests(quests, token) {
    const questsSection = document.querySelector('.quests-section');
    
    // Remove existing quest list if it exists
    let questsList = questsSection.querySelector('.quests-list');
    if (questsList) {
        questsList.remove();
    }
    
    // Create new quests list
    questsList = document.createElement('div');
    questsList.className = 'quests-list';
    questsSection.appendChild(questsList);
    
    if (!quests || quests.length === 0) {
        showNoQuests("No quests available. Create the first one!");
        return;
    }
    
    // Get current user info to identify own quests
    const currentUser = getCurrentUser(token);
    
    // Create quest cards
    quests.forEach(quest => {
        const questCard = createQuestCard(quest, currentUser, token);
        questsList.appendChild(questCard);
    });
}

// Function to create a single quest card
function createQuestCard(quest, currentUser, token) {
    const isOwnQuest = quest.creatorId === currentUser?.id || quest.creator === currentUser?.username;
    
    const questDiv = document.createElement('div');
    questDiv.className = `quest-card ${isOwnQuest ? 'own-quest' : ''}`;
    
    // Map difficulty to rank display
    const difficultyRankMap = {
        'Beginner': 'E-Rank',
        'Intermediate': 'D-Rank', 
        'Advanced': 'C-Rank',
        'Expert': 'B-Rank',
        'Master': 'A-Rank',
        'Legendary': 'S-Rank'
    };
    
    const rankDisplay = difficultyRankMap[quest.difficulty] || quest.difficulty;
    
    questDiv.innerHTML = `
        <div class="quest-header">
            <div>
                <div class="quest-title">${escapeHtml(quest.title || quest.questTitle)}</div>
                <div class="quest-creator">Created by: ${escapeHtml(quest.creator || quest.creatorName || 'Unknown')}</div>
            </div>
            <div class="quest-info">
                <div class="quest-xp">+${quest.xp || quest.questXP || 0} XP</div>
                <div class="quest-difficulty difficulty-${(quest.difficulty || 'beginner').toLowerCase()}">
                    ${quest.difficulty || 'Beginner'} (${rankDisplay})
                </div>
            </div>
        </div>
        
        <div class="quest-description">
            ${escapeHtml(quest.description || quest.questDescription || 'No description provided.')}
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

// Function to show "no quests" message
function showNoQuests(message) {
    const questsSection = document.querySelector('.quests-section');
    let questsList = questsSection.querySelector('.quests-list');
    
    if (!questsList) {
        questsList = document.createElement('div');
        questsList.className = 'quests-list';
        questsSection.appendChild(questsList);
    }
    
    questsList.innerHTML = `<div class="no-quests">${message}</div>`;
}

// Function to set up quest creation form
function setupQuestCreation(token) {
    const createForm = document.getElementById('createQuestForm');
    
    if (createForm) {
        createForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data using your specific field names
            const formData = {
                questTitle: document.getElementById('questTitle').value.trim(),
                questDescription: document.getElementById('questDescription').value.trim(),
                questDifficulty: document.getElementById('questDifficulty').value,
                questXP: parseInt(document.getElementById('questXP').value) || 1
            };
            
            // Validate form data
            if (!formData.questTitle || !formData.questDescription || !formData.questDifficulty) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Check XP range
            if (formData.questXP < 1 || formData.questXP > 100) {
                alert('XP reward must be between 1 and 100');
                return;
            }
            
            const callback = (status, data) => {
                if (status === 201 || status === 200) {
                    alert('Quest created successfully!');
                    createForm.reset();
                    loadQuests(token); // Refresh quest list
                    loadUserInfo(token); // Refresh user info (XP might have changed)
                } else {
                    alert(data.message || 'Failed to create quest. Please try again.');
                }
            };
            
            // Send quest creation request
            fetchMethod(currentUrl + "/api/quests", callback, "POST", formData, token);
        });
    }
}

// Function to set up quest filters
function setupQuestFilters(token) {
    const difficultyFilter = document.getElementById('difficultyFilter');
    
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', function() {
            filterQuests(token);
        });
    }
}

// Function to filter quests based on selected criteria
function filterQuests(token) {
    const selectedDifficulty = document.getElementById('difficultyFilter').value;
    
    const callback = (status, data) => {
        if (status === 200) {
            let quests = data.quests || data;
            
            // Filter by difficulty if selected
            if (selectedDifficulty) {
                quests = quests.filter(quest => 
                    (quest.difficulty || quest.questDifficulty) === selectedDifficulty
                );
            }
            
            displayQuests(quests, token);
        } else {
            console.error("Failed to filter quests:", data);
        }
    };
    
    // Fetch all quests and then filter
    fetchMethod(currentUrl + "/api/quests", callback, "GET", null, token);
}

// Function to accept a quest
function acceptQuest(questId, token) {
    const callback = (status, data) => {
        if (status === 200) {
            alert('Quest accepted successfully!');
            loadQuests(token); // Refresh quest list
            loadUserInfo(token); // Refresh user info (XP might have changed)
        } else {
            alert(data.message || 'Failed to accept quest. Please try again.');
        }
    };
    
    fetchMethod(currentUrl + `/api/quests/${questId}/accept`, callback, "POST", null, token);
}

// Function to delete a quest
function deleteQuest(questId, token) {
    if (!confirm('Are you sure you want to delete this quest?')) {
        return;
    }
    
    const callback = (status, data) => {
        if (status === 200) {
            alert('Quest deleted successfully!');
            loadQuests(token); // Refresh quest list
            loadUserInfo(token); // Refresh user info (XP might be restored)
        } else {
            alert(data.message || 'Failed to delete quest. Please try again.');
        }
    };
    
    fetchMethod(currentUrl + `/api/quests/${questId}`, callback, "DELETE", null, token);
}

// Helper function to get current user info
function getCurrentUser(token) {
    // This is a simplified version - you might need to decode the JWT token
    // or make an API call to get current user info
    try {
        // If your token contains user info, decode it here
        // For now, return null and let the backend handle ownership
        return null;
    } catch (error) {
        return null;
    }
}
