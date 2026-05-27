const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the .env file');
        }

        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s
        };

        await mongoose.connect(process.env.MONGO_URI, options);

        console.log('Database connected successfully');

        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit the application if connection fails
    }
};

// Function to set up a notification handler
const setupNotificationHandler = (io) => {
    const db = mongoose.connection;
    const notificationsCollection = db.collection('notifications');

    const changeStream = notificationsCollection.watch();

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const newNotification = change.fullDocument;
            console.log('New notification:', newNotification);

            if (io) {
                io.to(newNotification.userId.toString()).emit('newNotification', newNotification);
            }
        }
    });

    console.log('Notification handler is set up and listening for changes');
};

module.exports = { connectDB, setupNotificationHandler };
