const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authenticate = require('../middlewares/authenticate');
const userModel = require('../models/userModel');
const router = express.Router();

// Ensure the uploads folder exists
const uploadsFolderPath = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsFolderPath)) {
    fs.mkdirSync(uploadsFolderPath, { recursive: true });
    console.log('Uploads folder created.');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsFolderPath);
        console.log(`Uploading file to: ${uploadsFolderPath}`);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
        console.log(`Uploaded file path: /uploads/${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({ storage }); // Define `upload` here, so it's accessible

// ** Sign-Up Route **
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            profile: {},
        });

        const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profile: newUser.profile,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// ** Login Route **
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profile: user.profile,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// ** Profile Update Route **
router.put('/profile', authenticate, upload.single('avatar'), async (req, res) => {
    const { name, bio } = req.body;

    if (!name || !bio) {
        return res.status(400).json({ message: 'Name and bio are required' });
    }

    const updatedData = { name, 'profile.bio': bio };
    if (req.file) {
        updatedData['profile.avatar'] = `/uploads/${req.file.filename}`;
    }

    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            updatedData,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const refreshedUser = await userModel.findById(req.user._id).select('-password');
        res.status(200).json({ message: 'Profile updated successfully', user: refreshedUser });
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile', error: err.message });
    }
});

// ** Dashboard Route **
router.get('/dashboard', authenticate, (req, res) => {
    res.status(200).send(`Welcome to the dashboard, ${req.user.email}`);
});

module.exports = router;
