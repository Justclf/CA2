document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Please log in to submit reports');
        window.location.href = 'login.html';
        return;
    }
    
    // Load user profile, available vulnerabilities, and reports
    loadUserProfile(token);
    loadAvailableVulnerabilities(token);
    loadUserReports(token);
    
    // Setup form functionality
    setupReportForm(token);
});

// Load user profile information
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

// Setup report form submission  
function setupReportForm(token) {
    const reportForm = document.getElementById('reportForm');
    
    if (reportForm) {
        reportForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const vulnerabilityId = document.getElementById('vulnerabilityId').value;
            
            if (!vulnerabilityId) {
                alert('Please enter a vulnerability ID');
                return;
            }

            // Validate that the vulnerability ID exists in the available list
            const vulnCard = document.querySelector(`.vuln-card[data-id="${vulnerabilityId}"]`);
            if (!vulnCard) {
                alert('Invalid vulnerability ID. Please select from the available vulnerabilities above.');
                return;
            }
            
            const data = {
                vulnerability_id: parseInt(vulnerabilityId)
            };
            
            // Disable submit button during submission
            const submitBtn = reportForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">Submitting...</span><span class="btn-icon">⏳</span>';
            submitBtn.disabled = true;
            
            const callback = (responseStatus, responseData) => {
                // Re-enable submit button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                console.log("Submit report responseStatus:", responseStatus);
                console.log("Submit report responseData:", responseData);
                
                if (responseStatus === 201) {
                    alert(`Report submitted successfully! You earned ${responseData.xp_earned} XP!`);
                    reportForm.reset();
                    document.getElementById('expectedReward').value = '';
                    
                    // Remove the reported vulnerability from the display
                    removeReportedVulnerability(vulnerabilityId);
                    
                    loadUserProfile(token); // Refresh user stats
                    loadUserReports(token); // Refresh reports list
                } else {
                    alert(responseData.message || 'Failed to submit report. Please try again.');
                }
            }
            
            fetchMethod(currentUrl + "/api/reports", callback, "POST", data, token);
        });
    }
}

// Remove reported vulnerability from display
function removeReportedVulnerability(vulnerabilityId) {
    const vulnCard = document.querySelector(`.vuln-card[data-id="${vulnerabilityId}"]`);
    if (vulnCard) {
        // Add exit animation
        vulnCard.style.transition = 'all 0.3s ease';
        vulnCard.style.transform = 'translateX(-100%)';
        vulnCard.style.opacity = '0';
        
        // Remove after animation
        setTimeout(() => {
            vulnCard.remove();
            
            // Check if any vulnerabilities are left
            const remainingCards = document.querySelectorAll('.vuln-card');
            if (remainingCards.length === 0) {
                showNoVulnerabilities("All available vulnerabilities have been reported! Great work!");
            }
        }, 300);
    }
}

// Load available vulnerabilities that users have created (excluding already reported ones)
function loadAvailableVulnerabilities(token) {
    const callback = (responseStatus, responseData) => {
        console.log("Available vulnerabilities responseStatus:", responseStatus);
        console.log("Available vulnerabilities responseData:", responseData);
        
        if (responseStatus === 200) {
            displayAvailableVulnerabilities(responseData);
        } else {
            console.error("Failed to load vulnerabilities:", responseData);
            showNoVulnerabilities("No vulnerabilities available yet. Create some vulnerabilities first!");
        }
    }
    
    // Load available vulnerabilities (excluding already reported ones)
    fetchMethod(currentUrl + "/api/reports/available", callback, "GET", null, token);
}

// Display available vulnerabilities dynamically
function displayAvailableVulnerabilities(vulnerabilities) {
    const vulnGrid = document.querySelector('.vulnerabilities-grid');
    
    if (!vulnerabilities || vulnerabilities.length === 0) {
        showNoVulnerabilities("No vulnerabilities available to report. You may have already reported all available vulnerabilities!");
        return;
    }
    
    vulnGrid.innerHTML = vulnerabilities.map(vuln => {
        return `
            <div class="vuln-card" data-id="${vuln.id}">
                <div class="vuln-header">
                    <span class="vuln-id">ID: ${vuln.id}</span>
                    <span class="vuln-points">+${vuln.points} XP</span>
                </div>
                <div class="vuln-name">${vuln.type}</div>
                <div class="vuln-description">${vuln.description}</div>
            </div>
        `;
    }).join('');
    
    // Re-setup click handlers for the new cards
    setupVulnerabilityCards();
}

// Show no vulnerabilities message
function showNoVulnerabilities(message) {
    const vulnGrid = document.querySelector('.vulnerabilities-grid');
    vulnGrid.innerHTML = `
        <div class="no-vulnerabilities">
            <p>${message}</p>
            <a href="vulnerability.html" style="color: var(--primary-purple); text-decoration: none; font-weight: bold;">
                Go to Vulnerabilities →
            </a>
        </div>
    `;
}

// Setup vulnerability cards click functionality
function setupVulnerabilityCards() {
    const vulnCards = document.querySelectorAll('.vuln-card');
    const vulnIdInput = document.getElementById('vulnerabilityId');
    const expectedRewardInput = document.getElementById('expectedReward');
    
    vulnCards.forEach(card => {
        card.addEventListener('click', function() {
            const vulnId = this.dataset.id;
            const vulnPoints = this.querySelector('.vuln-points').textContent;
            
            // Remove active class from all cards
            vulnCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Update form fields
            vulnIdInput.value = vulnId;
            expectedRewardInput.value = vulnPoints;
            
            // Add visual feedback
            vulnIdInput.style.borderColor = 'var(--secondary-pink)';
            expectedRewardInput.style.borderColor = 'var(--secondary-pink)';
            
            setTimeout(() => {
                vulnIdInput.style.borderColor = 'var(--primary-purple)';
                expectedRewardInput.style.borderColor = 'var(--primary-purple)';
            }, 1000);
        });
    });
    
    // Handle manual input in vulnerability ID field
    vulnIdInput.addEventListener('input', function() {
        const vulnId = this.value;
        
        // Remove active class from all cards
        vulnCards.forEach(c => c.classList.remove('active'));
        
        // Find and highlight corresponding card
        const correspondingCard = document.querySelector(`.vuln-card[data-id="${vulnId}"]`);
        if (correspondingCard) {
            correspondingCard.classList.add('active');
            const vulnPoints = correspondingCard.querySelector('.vuln-points').textContent;
            expectedRewardInput.value = vulnPoints;
        } else {
            expectedRewardInput.value = '';
        }
    });
}

// Load user's reports
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

// Display user's reports
function displayReports(reports) {
    const reportsList = document.getElementById('reportsList');
    
    if (!reports || reports.length === 0) {
        showNoReports("No reports submitted yet. Submit your first report above!");
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
                
                ${report.description ? `
                    <div class="report-description">
                        <span class="report-description-label">Report Details:</span>
                        ${report.description}
                    </div>
                ` : ''}
                
                <div class="report-date">Submitted: ${reportDate}</div>
            </div>
        `;
    }).join('');
}

// Show no reports message
function showNoReports(message) {
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = `<div class="no-reports"><p>${message}</p></div>`;
}