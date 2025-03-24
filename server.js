require('dotenv').config();
const express = require('express');
const http = require('http'); // Import http to create the server
const { Server } = require('socket.io'); // Import Socket.IO
const connectDB = require('./config/db');
const fs = require('fs');
const path = require('path'); // Import the path module
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const nodemailer = require('nodemailer');

const app = express();

// Database Connection
connectDB();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Use the contact routes
app.use('/api', contactRoutes);
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
//favicon 
app.use('/favicon_io', express.static(path.join(__dirname, 'favicon_io')));


// Ensure the uploads folder exists
const uploadsFolderPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdirSync(uploadsFolderPath, { recursive: true });
    console.log('Uploads folder created.');
}

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(uploadsFolderPath));

// Routes
app.use('/api', authRoutes);
app.use('/users', userRoutes);

// Dashboard Route
app.get('/dashboard/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard', 'dashboard.html')); // Correct path
});

// Profile Route
app.get('/profile/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile', 'profile.html'));
});

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins for development; restrict in production
        methods: ['GET', 'POST'],
    },
});

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join user-specific room (e.g., for notifications)
    socket.on('joinRoom', (userId) => {
        socket.join(userId);
        console.log(`User with ID ${userId} joined their room`);
    });

    // Handle notification emission
    socket.on('sendNotification', ({ userId, message }) => {
        io.to(userId).emit('notification', message);
        console.log(`Notification sent to user ${userId}: ${message}`);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
