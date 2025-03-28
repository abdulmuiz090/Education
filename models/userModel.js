const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: {
        bio: { type: String, default: '' },
        avatar: { type: String, default: '' },
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('userModel', UserSchema);
