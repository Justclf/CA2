// Interactive Elements and Effects
class InteractionManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigationEffects();
        this.setupButtonEffects();
        this.setupKeyboardShortcuts();
    }

    setupNavigationEffects() {
        const navButtons = document.querySelectorAll('.nav-btn');
        
        navButtons.forEach(btn => {
            // Enhanced hover effect
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
                this.style.boxShadow = '0 8px 20px rgba(157, 78, 221, 0.6)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = this.classList.contains('active') ? 
                    '0 0 20px rgba(255, 0, 110, 0.5)' : 
                    '0 5px 15px rgba(157, 78, 221, 0.4)';
            });

            // Click effect with sound simulation
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(e, btn);
                this.simulateButtonSound();
            });
        });
    }

    setupButtonEffects() {
        const ctaButtons = document.querySelectorAll('.cta-button');
        
        ctaButtons.forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.05)';
                this.style.boxShadow = '0 15px 30px rgba(255, 0, 110, 0.6)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 10px 25px rgba(255, 0, 110, 0.4)';
            });

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.createRippleEffect(e, btn);
                this.createBurstEffect(e.clientX, e.clientY);
                
                // Simulate navigation with loading effect
                this.simulateNavigation(btn);
            });
        });
    }

    createRippleEffect(event, button) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 10;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    createBurstEffect(x, y) {
        if (window.particleSystem) {
            window.particleSystem.createBurstEffect(x, y);
        }
    }

    simulateNavigation(button) {
        const originalText = button.textContent;
        button.textContent = 'Loading...';
        button.style.opacity = '0.7';
        button.style.pointerEvents = 'none';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }, 1500);
    }

    simulateButtonSound() {
        // Visual sound effect simulation
        const soundWave = document.createElement('div');
        soundWave.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 4px;
            height: 20px;
            background: #9d4edd;
            border-radius: 2px;
            opacity: 0.8;
            animation: soundWave 0.3s ease-out;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(soundWave);
        
        setTimeout(() => {
            if (soundWave.parentNode) {
                soundWave.parentNode.removeChild(soundWave);
            }
        }, 300);
    }

    // Add keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case '1':
                    this.navigateToPage('index.html');
                    break;
                case '2':
                    this.navigateToPage('quests.html');
                    break;
                case '3':
                    this.navigateToPage('players.html');
                    break;
                case '4':
                    this.navigateToPage('login.html');
                    break;
                case '5':
                    this.navigateToPage('register.html');
                    break;
                case ' ':
                    e.preventDefault();
                    this.createScreenEffect();
                    break;
            }
        });
    }

    createScreenEffect() {
        // Create a screen-wide purple energy effect
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(157, 78, 221, 0.3) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            animation: screenFlash 0.8s ease-out;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.parentNode.removeChild(effect);
            }
        }, 800);
    }

    navigateToPage(page) {
        // Add loading animation before navigation
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #0a0a0a, #1a0d2e);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            window.location.href = page;
        }, 300);
    }
}

// Add CSS animations for screen effects and sound wave
const additionalStyles = `
    @keyframes soundWave {
        0% { 
            height: 20px;
            opacity: 0.8;
        }
        50% { 
            height: 40px;
            opacity: 1;
        }
        100% { 
            height: 10px;
            opacity: 0;
        }
    }
    
    @keyframes screenFlash {
        0% { 
            opacity: 0;
            transform: scale(0.8);
        }
        50% { 
            opacity: 1;
            transform: scale(1);
        }
        100% { 
            opacity: 0;
            transform: scale(1.2);
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize interaction manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.interactionManager = new InteractionManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionManager;
}

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize interaction manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.interactionManager = new InteractionManager();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractionManager;
}