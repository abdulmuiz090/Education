const mongoose = require('mongoose');


// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in the .env file');
        }

        await mongoose.connect(process.env.MONGO_URI,);

        console.log('Database connected successfully');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1); // Exit the application if connection fails
    }
};

// Function to set up a notification handler
const setupNotificationHandler = (io) => {
    const db = mongoose.connection;
    const notificationsCollection = db.collection('notifications'); // Ensure your notifications collection is named correctly

    // Use MongoDB change streams to monitor changes in the notifications collection
    const changeStream = notificationsCollection.watch();

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const newNotification = change.fullDocument;
            console.log('New notification:', newNotification);

            // Emit the notification to the user via WebSocket
            if (io) {
                io.to(newNotification.userId.toString()).emit('newNotification', newNotification);
            }
        }
    });

    console.log('Notification handler is set up and listening for changes');
};

// Debugging statement (only for development)
if (process.env.NODE_ENV !== 'production') {
    console.log('MongoDB URI:', process.env.MONGO_URI);
}

module.exports = setupNotificationHandler;
module.exports = connectDB;