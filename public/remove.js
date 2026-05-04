const socket = io();

const form = document.getElementById('removeForm');
const input = document.getElementById('removeInput');
const successMessage = document.getElementById('successMessage');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
        socket.emit('request_remove_wish', text);
        input.value = '';
        
        successMessage.classList.remove('hidden');
        successMessage.style.opacity = '1';
        
        setTimeout(() => {
            successMessage.style.opacity = '0';
            setTimeout(() => {
                successMessage.classList.add('hidden');
            }, 300);
        }, 3000);
    }
});
