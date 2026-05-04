const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Form route
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Remove route
app.get('/remove', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'remove.html'));
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('submit_wish', (wish) => {
        console.log('Wish received:', wish);
        // Broadcast the wish to all connected clients
        io.emit('new_wish', wish);
    });

    socket.on('request_remove_wish', (wishText) => {
        console.log('Remove wish received:', wishText);
        io.emit('remove_wish', wishText);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Form app is running on http://localhost:${PORT}/form`);
    console.log(`Remove app is running on http://localhost:${PORT}/remove`);
});
