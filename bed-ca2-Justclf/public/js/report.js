document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Please log in to submit vulnerability reports');
        window.location.href = 'login.html';
        return;
    }
    
    // Load user profile and reports
    loadUserProfile(token);
    loadUserReports(token);
    
    // Setup form submission
    setupReportForm(token);
});

// get the profile
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
            document.getElementById("currentRank").textContent = "E-Hunter";
        }
    }
    fetchMethod(currentUrl + "/api/profile", callback, "GET", null, token);
}


// create function for setting up report form
function setupReportForm(token) {
    const reportForm = document.getElementById('reportForm');
    
    if (reportForm) {
        reportForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const vulnerabilityId = document.getElementById('vulnerabilityType').value;
            const description = document.getElementById('reportDescription').value;
            
            if (!vulnerabilityId) {
                alert('Please select a vulnerability type');
                return;
            }

            if (!description) {
                alert('Please provide a description of the vulnerability');
                return;
            }

            if (description.length < 10) {
                alert('Description must be at least 10 characters long');
                return;
            }
            
            const data = {
                vulnerability_id: parseInt(vulnerabilityId),
                description: description
            };
            
            const callback = (responseStatus, responseData) => {
                console.log("Submit report responseStatus:", responseStatus);
                console.log("Submit report responseData:", responseData);
                
                if (responseStatus === 201) {
                    alert("Report submitted successfully");
                    reportForm.reset();
                    loadUserProfile(token); // refresh user stats
                    loadUserReports(token); // refresh reports list
                } else {
                    alert(responseData.message || 'Failed to submit report. Please try again.');
                }
            }
            
            fetchMethod(currentUrl + "/api/reports", callback, "POST", data, token);
        });
    }
}


// function to load the user reports
function loadUserReports(token) {
    const callback = (responseStatus, responseData) => {
        console.log("User reports responseStatus:", responseStatus);
        console.log("User reports responseData:", responseData);
        
        if (responseStatus === 200) {
            displayReports(responseData);
        } else {
            console.error("Failed to load user reports:", responseData);
            showNoReports("Failed to load your reports.");
        }
    }
    
    fetchMethod(currentUrl + "/api/reports/user", callback, "GET", null, token);
}


// function to show the report
function displayReports(reports) {
    const reportsList = document.getElementById('reportsList');
    
    if (!reports || reports.length === 0) {
        showNoReports("No reports submitted yet. Submit your first vulnerability report!");
        return;
    }
    
    reportsList.innerHTML = reports.map(report => {
        const reportDate = new Date(report.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        return `
            <div class="report-item">
                <div class="report-header">
                    <div class="report-type">${report.vulnerability_type}</div>
                    <div class="report-xp">+${report.points} XP</div>
                </div>
                <div class="report-date">Submitted: ${reportDate}</div>
            </div>
        `;
    }).join('');
}

function showNoReports(message) {
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = `<div class="no-reports"><p>${message}</p></div>`;
}