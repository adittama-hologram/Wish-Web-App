const socket = io();
const form = document.getElementById('wishForm');
const wishInput = document.getElementById('wishInput');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const wish = wishInput.value.trim();
    if (wish) {
        socket.emit('submit_wish', wish);
        wishInput.value = '';

        successMessage.classList.remove('hidden');
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 3000);
    }
});
