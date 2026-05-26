const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import our new User blueprint!

// 1. REGISTRATION API
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone_number,address } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash the password (scramble it 10 times for security)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user and save to database
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            phone_number,
            address
        });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully! 🥳' });

    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error });
    }
});

// 2. LOGIN API
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the typed password with the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a login token that lasts for 1 day
        // (We are using a temporary secret key here just for testing)
        const token = jwt.sign({ id: user._id }, 'super_secret_bakery_key', { expiresIn: '1d' });

        res.status(200).json({ 
            message: 'Login successful! 🍩',
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error });
    }
});

module.exports = router;