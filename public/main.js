const socket = io();
const container = document.getElementById('container');
let activeWishes = [];
const savedUserWishes = [];

const preExistingWishes = [
    "I want to travel the world", "I want a new laptop", "To be truly happy", "I want a puppy", "I want to learn piano",
    "I want to win the lottery", "I want a cup of coffee", "I wanna be a Super Man", "To get a promotion", "I want to fly",
    "I want a fast car", "I want to learn to surf", "I want a bigger house", "To meet my soulmate", "I want a new phone",
    "I want to climb Mt. Everest", "I want to be debt-free", "To speak Japanese fluently", "I want a lifetime supply of pizza", "I want to write a book",
    "To start a successful business", "I want to go to space", "I want a magical wand", "To learn to cook well", "I want to see the northern lights",
    "I want a home gym", "To learn to code", "I want to run a marathon", "I want a new bicycle", "I want world peace",
    "I want to write a song", "I want to learn dancing", "I want to visit Tokyo", "I want a new camera", "I want a pet cat"
];

socket.on('new_wish', (wish) => {
    savedUserWishes.push(wish);
    if (savedUserWishes.length > 35) {
        savedUserWishes.shift();
    }
    spawnBouncingWish(wish);
});

socket.on('remove_wish', (wishText) => {
    const targetText = wishText.toLowerCase();

    // Remove from savedUserWishes
    for (let i = savedUserWishes.length - 1; i >= 0; i--) {
        if (savedUserWishes[i].toLowerCase() === targetText) {
            savedUserWishes.splice(i, 1);
        }
    }

    // Remove from activeWishes and fade them out
    for (let i = activeWishes.length - 1; i >= 0; i--) {
        if (activeWishes[i].text.toLowerCase() === targetText) {
            const wishObj = activeWishes.splice(i, 1)[0];
            fadeAndRemoveWish(wishObj);
        }
    }
});

window.spawnAllPreExisting = function () {
    preExistingWishes.forEach(wish => {
        spawnBouncingWish(wish);
    });
};

document.addEventListener('keydown', (event) => {
    if (event.key === '0') {
        window.spawnAllPreExisting();
    }
});

function spawnBouncingWish(wishText) {
    const el = document.createElement('div');
    el.className = 'bouncing-name';

    const envelope = document.createElement('div');
    envelope.className = 'envelope';
    envelope.textContent = '✉️';

    const textSpan = document.createElement('div');
    textSpan.className = 'wish-text';
    textSpan.textContent = wishText;

    el.appendChild(envelope);
    el.appendChild(textSpan);

    // Unified color to match the cloudy sky
    el.style.color = '#ffffff';
    el.style.textShadow = '0 2px 10px rgba(30, 58, 138, 0.8), 0 0 20px rgba(30, 58, 138, 0.6)';

    let targetOpacity = '1';
    el.style.opacity = '0'; // Hide initially to prevent flash

    // Bouncing logic initial position
    let x = 100 + Math.random() * Math.max(0, window.innerWidth - 400);
    let y = 200 + Math.random() * Math.max(0, window.innerHeight - 500);
    let dx = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1.5) * 0.5;
    let dy = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1.5) * 0.5;

    // Apply position before appending to prevent top-left flash
    el.style.transform = `translate(${x}px, ${y}px)`;
    container.appendChild(el);

    // Force layout calculation
    el.getBoundingClientRect();

    // Show element
    el.style.opacity = targetOpacity;

    function updatePosition() {
        const rect = el.getBoundingClientRect();

        if (x + rect.width >= window.innerWidth - 100) {
            x = window.innerWidth - 100 - rect.width;
            dx = -dx;
        } else if (x <= 100) {
            x = 100;
            dx = -dx;
        }

        if (y + rect.height >= window.innerHeight - 200) {
            y = window.innerHeight - 200 - rect.height;
            dy = -dy;
        } else if (y <= 150) {
            y = 150;
            dy = -dy;
        }

        x += dx;
        y += dy;

        el.style.transform = `translate(${x}px, ${y}px)`;
    }

    const intervalId = setInterval(updatePosition, 16);

    const wishObj = { el, intervalId, text: wishText };
    activeWishes.push(wishObj);

    if (activeWishes.length > 35) {
        const oldest = activeWishes.shift();
        fadeAndRemoveWish(oldest);
    }
}

function fadeAndRemoveWish(wishObj) {
    wishObj.el.classList.add('vanishing');

    setTimeout(() => {
        clearInterval(wishObj.intervalId);
        if (container.contains(wishObj.el)) {
            container.removeChild(wishObj.el);
        }
    }, 1000);
}
