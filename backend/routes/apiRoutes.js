const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Save user data
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Fetch all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update approved field
router.patch('/users/:id/approve', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );
        if (!user) return res.status(404).send('User not found');
        res.status(200).send(user);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;
