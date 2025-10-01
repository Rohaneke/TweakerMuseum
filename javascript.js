        // Enhanced Museum Experience with Animations and Loading

// Loading Screen Management
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    const mainWrapper = document.getElementById('main-wrapper');
    
    // Simulate loading time for a more premium feel
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        mainWrapper.classList.add('loaded');
        
        // Initialize scroll animations after loading
        initScrollAnimations();
        initInteractionFeatures();
    }, 2500);
});

// Scroll Progress Indicator
function updateScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress-bar');
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = Math.min(progress, 100) + '%';
}

// Scroll Animations Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections for animations
    const animatedSections = document.querySelectorAll('.exhibition-info, .artist-info');
    animatedSections.forEach(section => {
        observer.observe(section);
    });
}

// Interactive Features
function initInteractionFeatures() {
    // Floating reset button
    const floatingReset = document.getElementById('floating-reset');
    const regenNotification = document.getElementById('regen-notification');
    
    floatingReset.addEventListener('click', () => {
        // Trigger p5 reset
        if (typeof resetSketch === 'function') {
            resetSketch(true);
            showRegenerationNotification();
        }
    });
    
    // Enhanced navigation with smooth scrolling
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Add visual feedback
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 150);
            }
        });
    });
    
    // Header animation on scroll
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.museum-header');
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        updateScrollProgress();
    });
}

// Regeneration Notification
function showRegenerationNotification() {
    const notification = document.getElementById('regen-notification');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Enhanced p5.js Integration
let originalCreateCanvas = createCanvas;
window.createCanvas = function(w, h) {
    let canvas = originalCreateCanvas(w, h);
    canvas.parent('p5-canvas');
    
    // Add click animation effect
    canvas.canvas.addEventListener('click', () => {
        showRegenerationNotification();
        addClickRipple(event);
    });
    
    return canvas;
};

// Click Ripple Effect
function addClickRipple(event) {
    const heroSection = document.querySelector('.hero-section');
    const ripple = document.createElement('div');
    
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(212, 175, 55, 0.3)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = (event.clientX - heroSection.offsetLeft - 25) + 'px';
    ripple.style.top = (event.clientY - heroSection.offsetTop - 25) + 'px';
    ripple.style.width = '50px';
    ripple.style.height = '50px';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '100';
    
    heroSection.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Enhanced window resize handling
function windowResized() {
    let heroSection = document.querySelector('.hero-section');
    if (heroSection && typeof resizeCanvas === 'function') {
        resizeCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
        if (typeof bgColor !== 'undefined') {
            background(bgColor);
        }
        if (typeof setupFieldAndParticles === 'function') {
            setupFieldAndParticles();
        }
    }
}

// Enhanced p5 setup
let originalSetup = setup;
window.setup = function() {
    if (typeof pixelDensity === 'function') {
        pixelDensity(Math.min(1, window.devicePixelRatio));
    }
    
    let heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        createCanvas(heroSection.offsetWidth, heroSection.offsetHeight);
        if (typeof colorMode === 'function') {
            colorMode(HSB, 360, 100, 100, 1);
        }
        
        if (typeof resetSketch === 'function') {
            resetSketch(true);
        }
    }
};

// Keyboard shortcuts with visual feedback
document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    const actionMap = {
        's': 'Saved current frame',
        'c': 'Cleared trails',
        'f': 'Toggled fade effect',
        'r': 'Reset composition'
    };
    
    if (actionMap[key]) {
        showActionFeedback(actionMap[key]);
    }
});

// Action Feedback
function showActionFeedback(message) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.textContent = message;
    feedback.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(212, 175, 55, 0.95);
        color: #1a1a1a;
        padding: 1rem 1.5rem;
        border-radius: 25px;
        font-weight: 600;
        font-size: 0.9rem;
        z-index: 9999;
        animation: slideInFromRight 0.5s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.animation = 'slideInFromRight 0.5s ease reverse';
        setTimeout(() => feedback.remove(), 500);
    }, 2000);
}

// Add ripple animation to CSS dynamically
const rippleCSS = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);