// ==========================================
// Interactive Dating Narrative Script
// ==========================================

// Track current state
let currentGuy = null;

// Function to show a specific screen
function showScreen(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
    });

    // Show the target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        setTimeout(() => {
            targetScreen.classList.add('active');
        }, 100);
    }

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function when user chooses a guy
function chooseGuy(guyNumber) {
    currentGuy = guyNumber;

    // Add a little animation before transitioning
    const selectedCard = document.querySelector(`.guy-card[data-guy="${guyNumber}"]`);
    selectedCard.style.transform = 'scale(1.1)';
    selectedCard.style.transition = 'transform 0.3s ease';

    setTimeout(() => {
        selectedCard.style.transform = '';
        showScreen(`date-screen-${guyNumber}`);
    }, 300);
}

// Function when user answers yes/no to "Do you like me?"
function answerGuy(guyNumber, answer) {
    if (answer) {
        // User said YES - show specific ending for this guy
        showScreen(`ending-screen-${guyNumber}-yes`);
    } else {
        // User said NO - show generic friend ending
        showScreen('ending-screen-no');
    }
}

// Function to restart the experience
function restart() {
    currentGuy = null;
    showScreen('selection-screen');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Ensure selection screen is shown first
    showScreen('selection-screen');

    // Add hover effects to guy cards
    const guyCards = document.querySelectorAll('.guy-card');
    guyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Add particle effects on button clicks
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
});

// Create ripple effect on button click
function createRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add keyboard navigation (Easter egg!)
document.addEventListener('keydown', function(e) {
    // Press 'R' to restart
    if (e.key === 'r' || e.key === 'R') {
        restart();
    }

    // Press 1, 2, 3 to select guys on selection screen
    if (document.getElementById('selection-screen').classList.contains('active')) {
        if (e.key === '1') chooseGuy(1);
        if (e.key === '2') chooseGuy(2);
        if (e.key === '3') chooseGuy(3);
    }

    // Press Y or N on date screens
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && activeScreen.id.startsWith('date-screen-')) {
        const guyNum = parseInt(activeScreen.id.split('-')[2]);
        if (e.key === 'y' || e.key === 'Y') {
            answerGuy(guyNum, true);
        }
        if (e.key === 'n' || e.key === 'N') {
            answerGuy(guyNum, false);
        }
    }
});

// Add floating hearts animation on YES answers
function createFloatingHearts() {
    const heartsContainer = document.createElement('div');
    heartsContainer.style.position = 'fixed';
    heartsContainer.style.top = '0';
    heartsContainer.style.left = '0';
    heartsContainer.style.width = '100%';
    heartsContainer.style.height = '100%';
    heartsContainer.style.pointerEvents = 'none';
    heartsContainer.style.zIndex = '9999';
    document.body.appendChild(heartsContainer);

    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.position = 'absolute';
            heart.style.fontSize = '30px';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '100%';
            heart.style.animation = `floatHeart ${3 + Math.random() * 2}s ease-in forwards`;
            heartsContainer.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 5000);
        }, i * 100);
    }

    setTimeout(() => {
        heartsContainer.remove();
    }, 5000);
}

// Add floating hearts animation CSS
const heartsStyle = document.createElement('style');
heartsStyle.textContent = `
    @keyframes floatHeart {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(heartsStyle);

// Enhanced answer function with hearts
const originalAnswerGuy = answerGuy;
answerGuy = function(guyNumber, answer) {
    if (answer) {
        createFloatingHearts();
    }
    originalAnswerGuy(guyNumber, answer);
};

console.log('💕 Dating Narrative Loaded! 💕');
console.log('Keyboard shortcuts:');
console.log('- Press 1, 2, or 3 to select a guy on the selection screen');
console.log('- Press Y for Yes or N for No on date screens');
console.log('- Press R to restart anytime');
