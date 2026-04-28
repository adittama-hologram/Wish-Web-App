const socket = io();
const container = document.getElementById('container');
let userWishesCount = 0;
let randomSpawnerInterval = null;
let activeWishes = [];
const savedUserWishes = [];

const preExistingWishes = [
    "I want to travel the world", "I want a new laptop", "To be truly happy", "I want a puppy", "I want to learn piano",
    "I want to win the lottery", "I want a cup of coffee", "I wanna be a Super Man", "To get a promotion", "I want to fly",
    "I want a fast car", "I want to learn to surf", "I want a bigger house", "To meet my soulmate", "I want a new phone",
    "I want to climb Mt. Everest", "I want to be debt-free", "To speak Japanese fluently", "I want a lifetime supply of pizza", "I want to write a book",
    "To start a successful business", "I want to go to space", "I want a magical wand", "To learn to cook well", "I want to see the northern lights",
    "I want a home gym", "To learn to code", "I want to run a marathon", "I want a new bicycle", "I want world peace"
];

function startRandomSpawner() {
    if (!randomSpawnerInterval) {
        spawnRandomWish();
        randomSpawnerInterval = setInterval(spawnRandomWish, 3000);
    }
}

function spawnRandomWish() {
    if (activeWishes.length < 5) {
        let randomWish;
        let chance = 0;
        
        if (savedUserWishes.length > 0) {
            if (savedUserWishes.length < 10) chance = 0.2;
            else if (savedUserWishes.length < 20) chance = 0.3;
            else chance = 0.4;
        }

        if (savedUserWishes.length > 0 && Math.random() < chance) {
            randomWish = savedUserWishes[Math.floor(Math.random() * savedUserWishes.length)];
        } else {
            randomWish = preExistingWishes[Math.floor(Math.random() * preExistingWishes.length)];
        }
        spawnBouncingWish(randomWish, true);
    }
}

function stopRandomSpawner() {
    if (randomSpawnerInterval) {
        clearInterval(randomSpawnerInterval);
        randomSpawnerInterval = null;
    }
}

startRandomSpawner();

socket.on('new_wish', (wish) => {
    savedUserWishes.push(wish);
    if (savedUserWishes.length > 30) {
        savedUserWishes.shift();
    }
    userWishesCount++;
    stopRandomSpawner();
    spawnBouncingWish(wish, false);
});

function spawnBouncingWish(wishText, isRandom) {
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

    let targetOpacity = isRandom ? '0.6' : '1';
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
    
    const wishObj = { el, intervalId, isRandom, timeoutId: null };
    activeWishes.push(wishObj);

    if (activeWishes.length > 5) {
        const oldest = activeWishes.shift();
        fadeAndRemoveWish(oldest);
    }

    // Remove after 60 seconds
    wishObj.timeoutId = setTimeout(() => {
        const index = activeWishes.indexOf(wishObj);
        if (index !== -1) {
            activeWishes.splice(index, 1);
            fadeAndRemoveWish(wishObj);
        }
    }, 60000);
}

function fadeAndRemoveWish(wishObj) {
    if (wishObj.timeoutId) {
        clearTimeout(wishObj.timeoutId);
    }
    wishObj.el.classList.add('vanishing');
    
    setTimeout(() => {
        clearInterval(wishObj.intervalId);
        if (container.contains(wishObj.el)) {
            container.removeChild(wishObj.el);
        }
        if (!wishObj.isRandom) {
            userWishesCount--;
            if (userWishesCount === 0) {
                startRandomSpawner();
            }
        }
    }, 1000);
}
