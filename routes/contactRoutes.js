const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

// Define Contact Schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    captcha: String,
    createdAt: { type: Date, default: Date.now },
});
const Contact = mongoose.model('Contact', contactSchema);

// Nodemailer Config
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Contact Form Submission Route
router.post('/submit-contact', async (req, res) => {
    const { name, email, subject, message, captcha } = req.body;

    try {
        // Save to MongoDB
        const newContact = new Contact({ name, email, subject, message, captcha });
        await newContact.save();

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email, // Send confirmation email to the user
            subject: `Contact Form Submission: ${subject}`,
            text: `Hello ${name},\n\nThank you for contacting us! We received your message:\n\n${message}\n\nWe'll get back to you soon!\n\nBest regards,\nYour Team`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ message: 'Contact form submitted successfully!' });
    } catch (error) {
        console.error('Error handling form submission:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
