// // quests.js - Updated for your HTML structure
// document.addEventListener("DOMContentLoaded", function () {
//   const token = localStorage.getItem("token");
//   
//   // Check if user is logged in
//   if (!token) {
//     alert("Please log in to view quests");
//     window.location.href = "login.html";
//     return;
//   }
//   
//   // Load user info and quests
//   loadUserInfo(token);
//   loadQuests(token);
//   
//   // Set up quest creation form
//   setupQuestCreation(token);
//   
//   // Set up quest filters
//   setupQuestFilters(token);
// });
// 
// function loadUserInfo(token) {
//   const callback = (responseStatus, responseData) => {
//     console.log("User info responseStatus:", responseStatus);
//     console.log("User info responseData:", responseData);
//     
//     if (responseStatus === 200) {
//       document.getElementById('currentHunter').textContent = responseData.username || 'Unknown Hunter';
//       document.getElementById('currentXP').textContent = responseData.xp || '0';
//       document.getElementById('currentRank').textContent = responseData.rank || 'Novice';
//     } else {
//       console.error("Failed to load user info:", responseData);
//       document.getElementById('currentHunter').textContent = 'Unknown Hunter';
//       document.getElementById('currentXP').textContent = '0';
//       document.getElementById('currentRank').textContent = 'Novice';
//     }
//   };
//   
//   fetchMethod(currentUrl + "/api/profile", callback, "GET", null, token);
// }
// 
// function loadQuests(token) {
//   const callback = (responseStatus, responseData) => {
//     console.log("Quests responseStatus:", responseStatus);
//     console.log("Quests responseData:", responseData);
//     
//     if (responseStatus === 200) {
//       displayQuests(responseData, token);
//     } else {
//       console.error("Failed to load quests:", responseData);
//       showNoQuests("Failed to load quests. Please try again.");
//     }
//   };
//   
//   fetchMethod(currentUrl + "/api/quests", callback, "GET", null, token);
// }
// 
// function displayQuests(quests, token) {
//   const questsSection = document.querySelector('.quests-section');
//   
//   // Remove existing quest list if it exists
//   let questsList = questsSection.querySelector('.quests-list');
//   if (questsList) {
//     questsList.remove();
//   }
//   
//   // Create new quests list
//   questsList = document.createElement('div');
//   questsList.className = 'quests-list';
//   questsSection.appendChild(questsList);
//   
//   if (!quests || quests.length === 0) {
//     showNoQuests("No quests available. Create the first one!");
//     return;
//   }
//   
//   // Create quest cards
//   quests.forEach((quest) => {
//     const questCard = createQuestCard(quest, token);
//     questsList.appendChild(questCard);
//   });
// }
// 
// function createQuestCard(quest, token) {
//   const difficultyRankMap = {
//     'Beginner': 'E-Rank',
//     'Intermediate': 'D-Rank', 
//     'Advanced': 'C-Rank',
//     'Expert': 'B-Rank',
//     'Master': 'A-Rank',
//     'Legendary': 'S-Rank'
//   };
//   
//   const rankDisplay = difficultyRankMap[quest.recommended_rank] || quest.recommended_rank;
//   const isOwnQuest = quest.isOwner || false; // Backend should determine this
//   
//   const questDiv = document.createElement('div');
//   questDiv.className = `quest-card ${isOwnQuest ? 'own-quest' : ''}`;
//   
//   questDiv.innerHTML = `
//     <div class="quest-header">
//       <div>
//         <div class="quest-title">${escapeHtml(quest.title)}</div>
//         <div class="quest-creator">Created by: ${escapeHtml(quest.creator || 'Unknown')}</div>
//       </div>
//       <div class="quest-info">
//         <div class="quest-xp">+${quest.xp_reward || 0} XP</div>
//         <div class="quest-difficulty difficulty-${(quest.recommended_rank || 'beginner').toLowerCase()}">
//           ${quest.recommended_rank || 'Beginner'} (${rankDisplay})
//         </div>
//       </div>
//     </div>
//     
//     <div class="quest-description">
//       ${escapeHtml(quest.description || 'No description provided.')}
//     </div>
//     
//     <div class="quest-actions">
//       ${isOwnQuest ? 
//         `<button class="delete-quest-btn" onclick="deleteQuest('${quest.id}', '${token}')">Delete Quest</button>` :
//         `<button class="accept-btn" onclick="acceptQuest('${quest.id}', '${token}')">Accept Quest</button>`
//       }
//     </div>
//   `;
//   
//   return questDiv;
// }
// 
// function showNoQuests(message) {
//   const questsSection = document.querySelector('.quests-section');
//   let questsList = questsSection.querySelector('.quests-list');
//   
//   if (!questsList) {
//     questsList = document.createElement('div');
//     questsList.className = 'quests-list';
//     questsSection.appendChild(questsList);
//   }
//   
//   questsList.innerHTML = `<div class="no-quests">${message}</div>`;
// }
// 
// function setupQuestCreation(token) {
//   const createForm = document.getElementById('createQuestForm');
//   
//   if (createForm) {
//     createForm.addEventListener('submit', function(event) {
//       event.preventDefault();
//       
//       const formData = {
//         questTitle: document.getElementById('questTitle').value.trim(),
//         questDescription: document.getElementById('questDescription').value.trim(),
//         questDifficulty: document.getElementById('questDifficulty').value,
//         questXP: parseInt(document.getElementById('questXP').value) || 1
//       };
//       
//       // Validate form data
//       if (!formData.questTitle || !formData.questDescription || !formData.questDifficulty) {
//         alert('Please fill in all required fields');
//         return;
//       }
//       
//       if (formData.questXP < 1 || formData.questXP > 100) {
//         alert('XP reward must be between 1 and 100');
//         return;
//       }
//       
//       const callback = (responseStatus, responseData) => {
//         console.log("Create quest responseStatus:", responseStatus);
//         console.log("Create quest responseData:", responseData);
//         
//         if (responseStatus === 201 || responseStatus === 200) {
//           alert('Quest created successfully!');
//           createForm.reset();
//           loadQuests(token);
//           loadUserInfo(token);
//         } else {
//           alert(responseData.message || 'Failed to create quest. Please try again.');
//         }
//       };
//       
//       fetchMethod(currentUrl + "/api/quests", callback, "POST", formData, token);
//     });
//   }
// }
// 
// function setupQuestFilters(token) {
//   const difficultyFilter = document.getElementById('difficultyFilter');
//   
//   if (difficultyFilter) {
//     difficultyFilter.addEventListener('change', function() {
//       filterQuests(token);
//     });
//   }
// }
// 
// function filterQuests(token) {
//   const selectedDifficulty = document.getElementById('difficultyFilter').value;
//   
//   const callback = (responseStatus, responseData) => {
//     console.log("Filter quests responseStatus:", responseStatus);
//     console.log("Filter quests responseData:", responseData);
//     
//     if (responseStatus === 200) {
//       let quests = responseData;
//       
//       // Filter by difficulty if selected
//       if (selectedDifficulty) {
//         quests = quests.filter(quest => 
//           quest.recommended_rank === selectedDifficulty
//         );
//       }
//       
//       displayQuests(quests, token);
//     } else {
//       console.error("Failed to filter quests:", responseData);
//     }
//   };
//   
//   fetchMethod(currentUrl + "/api/quests", callback, "GET", null, token);
// }
// 
// function acceptQuest(questId, token) {
//   const callback = (responseStatus, responseData) => {
//     console.log("Accept quest responseStatus:", responseStatus);
//     console.log("Accept quest responseData:", responseData);
//     
//     if (responseStatus === 200) {
//       alert('Quest accepted successfully!');
//       loadQuests(token);
//       loadUserInfo(token);
//     } else {
//       alert(responseData.message || 'Failed to accept quest. Please try again.');
//     }
//   };
//   
//   fetchMethod(currentUrl + `/api/quests/${questId}/accept`, callback, "POST", null, token);
// }
// 
// // function deleteQuest(questId, token) {
// //   if (!confirm('Are you sure you want to delete this quest?')) {
// //     return;
// //   }
// //   
// //   const callback = (responseStatus, responseData) => {
// //     console.log("Delete quest responseStatus:", responseStatus);
// //     console.log("Delete quest responseData:", responseData);
// //     
// //     if (responseStatus === 200) {
// //       alert('Quest deleted successfully!');
// //       loadQuests(token);
// //       loadUserInfo(token);
// //     } else {
// //       alert(responseData.message || 'Failed to delete quest. Please try again.');
// //     }
// //   };
// //   
// //   fetchMethod(currentUrl + `/api/quests/${questId}`, callback, "DELETE", null, token);
// // }
// 
// function escapeHtml(text) {
//   const div = document.createElement('div');
//   div.textContent = text;
//   return div.innerHTML;
// }
// 
// 


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
            document.getElementById("currentXP").textContent = "0";
            document.getElementById("currentRank").textContent = "E=Hunter";
        }
    }
    fetchMethod(currentURL + "/api/profile", callback, "GET", null, token) // Is GET because we are retrieving the information, and null means that no data is sending to the request body. While token is there becuase it needs to authenticate the users
}
