document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('Please log in to submit reports');
        window.location.href = 'login.html';
        return;
    }
    
    loadUserProfile(token);
    loadAvailableVulnerabilities(token);
    loadUserReports(token);
    setupReportForm(token);
});

// load user's profile
function loadUserProfile(token) {
    const callback = (responseStatus, responseData) => {
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

// function to submit the report
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

            const data = {
                vulnerability_id: parseInt(vulnerabilityId)
            };

            const submitBtn = reportForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">Submitting...</span><span class="btn-icon">Loading</span>'; // make the buttons clickable
            submitBtn.disabled = true;
            
            const callback = (responseStatus, responseData) => {
                submitBtn.innerHTML = originalText; // ai
                submitBtn.disabled = false;
                
                if (responseStatus === 201) {
                    alert(`Report submitted successfully! You earned ${responseData.xp_earned}`); // defined at reportcontroller
                    reportForm.reset();
                    document.getElementById('expectedReward').value = '';
                    
                    // refresh everything
                    loadAvailableVulnerabilities(token);
                    loadUserProfile(token);
                    loadUserReports(token);
                } else {
                    alert(responseData.message || 'Failed to submit report. Please try again.');
                }
            }
            
            fetchMethod(currentUrl + "/api/reports", callback, "POST", data, token);
        });
    }
}

// load available vulnerabilities
function loadAvailableVulnerabilities(token) {
    const callback = (responseStatus, responseData) => {
        if (responseStatus === 200) {
            if (responseData && responseData.length > 0) {
                displayAvailableVulnerabilities(responseData);
            } else {
                showNoVulnerabilities();
            }
        } else {
            console.error("Failed to load vulnerabilities:", responseData);
            showNoVulnerabilities();
        }
    }
    
    fetchMethod(currentUrl + "/api/reports/available", callback, "GET", null, token);
}

// show all available vulnerabilities
function displayAvailableVulnerabilities(vulnerabilities) {
    const vulnGrid = document.querySelector('.vulnerabilities-grid');
    
    if (!vulnerabilities || vulnerabilities.length === 0) {
        showNoVulnerabilities();
        return;
    }
    
    const html = vulnerabilities.map((vuln) => {
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
    
    vulnGrid.innerHTML = html;
    setupVulnerabilityCards();
}

// Remove the vulnerabilities ai
function showNoVulnerabilities() {
    const vulnGrid = document.querySelector('.vulnerabilities-grid');
    if (vulnGrid) {
        vulnGrid.innerHTML = '';
    }
}

// setup the cards ai
function setupVulnerabilityCards() {
    const vulnCards = document.querySelectorAll('.vuln-card');
    const vulnIdInput = document.getElementById('vulnerabilityId');
    const expectedRewardInput = document.getElementById('expectedReward');
    
    vulnCards.forEach((card) => {
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

// load user's reports
function loadUserReports(token) {
    const callback = (responseStatus, responseData) => {
        if (responseStatus === 200) {
            displayReports(responseData);
        } else {
            console.error("Failed to load user reports:", responseData);
        }
    }
    
    fetchMethod(currentUrl + "/api/reports/user", callback, "GET", null, token);
}

// show user's reports
function displayReports(reports) {
    const reportsList = document.getElementById('reportsList');
    reportsList.innerHTML = reports.map(report => {
        const reportDate = new Date(report.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // show the message
        const statusText = 'CLOSED';
        const statusClass = 'closed';
        return `
            <div class="report-item">
                <div class="report-header">
                    <div class="report-type">${report.vulnerability_type} <span class="status-badge ${statusClass}">${statusText}</span></div>
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