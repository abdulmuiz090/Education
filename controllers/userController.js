const User = require('../models/userModel');

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = await User.create({ name, email, password });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: 'Error creating user', error: err.message });
    }
};

// Login a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.password === password) {
        res.status(200).json({ message: 'Login successful', user });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

module.exports = { registerUser, loginUser };