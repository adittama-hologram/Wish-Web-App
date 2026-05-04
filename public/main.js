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
    "I want to write a song", "I want to learn dancing", "I want to visit Tokyo", "I want a new camera", "I want a pet cat",
    "I want to grow a garden", "I want to bake a cake", "To learn magic tricks", "I want to go scuba diving", "I want to write a poem",
    "I want to build a robot", "To learn a new language", "I want a vintage car", "I want a telescope", "I want to be a pilot",
    "I want to learn painting", "I want to visit Paris", "I want a big library", "I want to make a movie", "I want to help people"
];

socket.on('new_wish', (wish) => {
    savedUserWishes.push(wish);
    if (savedUserWishes.length > 50) {
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

window.spawnAllPreExisting = function() {
    preExistingWishes.forEach(wish => {
        spawnBouncingWish(wish);
    });
};

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
    let x = Math.random() * (window.innerWidth - 200);
    let y = Math.random() * (window.innerHeight - 100);
    let dx = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1.5);
    let dy = (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 1.5);

    // Apply position before appending to prevent top-left flash
    el.style.transform = `translate(${x}px, ${y}px)`;
    container.appendChild(el);
    
    // Force layout calculation
    el.getBoundingClientRect();
    
    // Show element
    el.style.opacity = targetOpacity;

    function updatePosition() {
        const rect = el.getBoundingClientRect();
        
        if (x + rect.width >= window.innerWidth) {
            x = window.innerWidth - rect.width;
            dx = -dx;
        } else if (x <= 0) {
            x = 0;
            dx = -dx;
        }
        
        if (y + rect.height >= window.innerHeight) {
            y = window.innerHeight - rect.height;
            dy = -dy;
        } else if (y <= 0) {
            y = 0;
            dy = -dy;
        }
        
        x += dx;
        y += dy;
        
        el.style.transform = `translate(${x}px, ${y}px)`;
    }

    const intervalId = setInterval(updatePosition, 16);
    
    const wishObj = { el, intervalId, text: wishText };
    activeWishes.push(wishObj);

    if (activeWishes.length > 50) {
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
