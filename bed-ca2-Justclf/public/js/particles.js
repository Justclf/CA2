// Particle System for Solo Leveling Effect
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 50;
        this.init();
    }

    init() {
        this.createInitialParticles();
        this.startParticleGeneration();
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning across the entire screen width
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        // Random size variation
        const size = Math.random() * 3 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.8 + 0.2;
        
        // Add glow effect randomly with purple theme
        if (Math.random() > 0.7) {
            particle.style.boxShadow = '0 0 10px #9d4edd';
        }
        
        // Start from bottom of screen
        particle.style.top = '100vh';
        
        document.body.appendChild(particle);
        this.particles.push(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            this.removeParticle(particle);
        }, 8000);
        
        return particle;
    }

    removeParticle(particle) {
        if (particle && particle.parentNode) {
            particle.parentNode.removeChild(particle);
            const index = this.particles.indexOf(particle);
            if (index > -1) {
                this.particles.splice(index, 1);
            }
        }
    }

    createInitialParticles() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 100);
        }
    }

    startParticleGeneration() {
        setInterval(() => {
            if (this.particles.length < this.maxParticles) {
                this.createParticle();
            }
        }, 200);
    }

    // Create special effect particles on demand
    createBurstEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.position = 'fixed';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.width = '6px';
                particle.style.height = '6px';
                particle.style.background = '#ff006e';
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '9999';
                particle.style.boxShadow = '0 0 15px #ff006e';
                
                // Random direction
                const angle = (Math.PI * 2 * i) / 15;
                const velocity = Math.random() * 100 + 50;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                particle.style.animation = 'none';
                particle.style.transform = `translate(${vx}px, ${vy}px)`;
                particle.style.opacity = '1';
                particle.style.transition = 'all 1s ease-out';
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    particle.style.opacity = '0';
                    particle.style.transform = `translate(${vx * 2}px, ${vy * 2}px)`;
                }, 10);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }, i * 50);
        }
    }

    // Create ambient particles around character background
    createAmbientParticles() {
        setInterval(() => {
            const ambientParticle = document.createElement('div');
            ambientParticle.style.cssText = `
                position: fixed;
                right: ${Math.random() * 400 + 100}px;
                top: ${Math.random() * 500 + 200}px;
                width: 3px;
                height: 3px;
                background: #9d4edd;
                border-radius: 50%;
                opacity: 0.6;
                box-shadow: 0 0 8px #9d4edd;
                pointer-events: none;
                z-index: 1;
                animation: ambientFloat 4s ease-in-out infinite;
            `;
            
            document.body.appendChild(ambientParticle);
            
            setTimeout(() => {
                if (ambientParticle.parentNode) {
                    ambientParticle.parentNode.removeChild(ambientParticle);
                }
            }, 4000);
        }, 800);
    }
}

// Add ambient particle animation
const ambientStyle = document.createElement('style');
ambientStyle.textContent = `
    @keyframes ambientFloat {
        0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.6;
        }
        50% { 
            transform: translateY(-20px) translateX(10px);
            opacity: 0.3;
        }
    }
`;
document.head.appendChild(ambientStyle);

// Initialize particle system when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.particleSystem = new ParticleSystem();
    window.particleSystem.createAmbientParticles();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}