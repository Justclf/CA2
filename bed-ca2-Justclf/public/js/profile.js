document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Please log in to view your profile');
        window.location.href = 'login.html';
        return;
    }
    
    // Load profile data
    loadUserProfile(token);
});

function loadUserProfile(token) {
    const callback = (responseStatus, responseData) => {
        console.log("User profile responseStatus:", responseStatus);
        console.log("User profile responseData:", responseData);

        if (responseStatus === 200) {
            updateProfileDisplay(responseData);
        } else {
            console.error("Failed to load user profile:", responseData);
            alert("Failed to load profile data");
        }
    }
    fetchMethod(currentUrl + "/api/profile", callback, "GET", null, token);
}

function updateProfileDisplay(userData) {
    // Change basic info
    document.getElementById('hunterName').textContent = userData.username;
    document.getElementById('currentXP').textContent = userData.xp;
    document.getElementById('currentRank').textContent = userData.rank;

    // FIXED: Simple rank progression with correct XP values
    const userXP = userData.xp;
    const userRank = userData.rank;

    let currentRankXP = 0;
    let nextRankXP = 500;
    let nextRankName = "D-Hunter";

    // FIXED: Proper rank progression logic
    if (userRank === 'E-Hunter') {
        currentRankXP = 0;
        nextRankXP = 500;
        nextRankName = 'D-Hunter';
    } else if (userRank === 'D-Hunter') {
        currentRankXP = 500;
        nextRankXP = 1000;
        nextRankName = 'C-Hunter';
    } else if (userRank === 'C-Hunter') {
        currentRankXP = 1000;
        nextRankXP = 2000;
        nextRankName = 'B-Hunter';
    } else if (userRank === 'B-Hunter') {
        currentRankXP = 2000;
        nextRankXP = 3500;
        nextRankName = 'A-Hunter';
    } else if (userRank === 'A-Hunter') {
        currentRankXP = 3500;
        nextRankXP = 5000;
        nextRankName = 'S-Hunter';
    } else {
        // S-Hunter is max level
        document.getElementById('xpProgress').textContent = 'Max Level Reached!';
        document.getElementById('progressFill').style.width = '100%';
        updateAchievements(userData);
        
        // Calculate quests completed
        const questsCompleted = Math.floor((userXP - 100) / 100);
        document.getElementById('questsCompleted').textContent = questsCompleted < 0 ? 0 : questsCompleted;
        return;
    }

    // Calculate progress to next rank
    const xpInThisLevel = userXP - currentRankXP;
    const xpNeededForNext = nextRankXP - currentRankXP;
    const progressPercent = Math.min((xpInThisLevel / xpNeededForNext) * 100, 100);
    
    // Update the display
    document.getElementById('xpProgress').textContent = `${xpInThisLevel} / ${xpNeededForNext} XP to ${nextRankName}`;
    document.getElementById('progressFill').style.width = `${progressPercent}%`;

    // Update achievements
    updateAchievements(userData);

    // Calculate quests completed
    const questsCompleted = Math.floor((userXP - 100) / 100);
    document.getElementById('questsCompleted').textContent = questsCompleted < 0 ? 0 : questsCompleted;
}


// Set the achievement
function updateAchievements(userData) {
    
    // Unlock achievement if user create its first quest
    if (userData.xp !== 100) {
        document.getElementById('firstQuestBadge').classList.remove('locked');
        document.getElementById('firstQuestBadge').classList.add('unlocked');
    }
    
    // // Unlocking quest 
    // if (userData.xp < 100) {
    //     document.getElementById('questCreatorBadge').classList.remove('locked');
    //     document.getElementById('questCreatorBadge').classList.add('unlocked');
    // }

    // Unlock achievement if user more than 100 XP
    if (userData.xp >= 100) {
        document.getElementById('xp100Badge').classList.remove('locked');
        document.getElementById('xp100Badge').classList.add('unlocked');
    }

    // Unlock achievement if user rank is higher than E rank
    if (userData.rank == 'D-Hunter') {
        document.getElementById('rankUpBadgeDTier').classList.remove('locked');
        document.getElementById('rankUpBadgeDTier').classList.add('unlocked');
    }
    
    // Unlock achievement if user rank is higher than C rank
    if (userData.rank == 'C-Hunter') {
        document.getElementById('rankUpBadgeCTier').classList.remove('locked');
        document.getElementById('rankUpBadgeCTier').classList.add('unlocked');
    }

    // Unlock achievement if user rank is higher than B rank
    if (userData.rank == 'B-Hunter') {
        document.getElementById('rankUpBadgeBTier').classList.remove('locked');
        document.getElementById('rankUpBadgeBTier').classList.add('unlocked');
    }

    // Unlock achievement if user rank is higher than A rank
    if (userData.rank == 'A-Hunter') {
        document.getElementById('rankUpBadgeATier').classList.remove('locked');
        document.getElementById('rankUpBadgeATier').classList.add('unlocked');
    }

    // Unlock achievement if user rank is higher than S rank
    if (userData.rank == 'C-Hunter') {
        document.getElementById('rankUpBadgeSTier').classList.remove('locked');
        document.getElementById('rankUpBadgeSTier').classList.add('unlocked');
    }
}