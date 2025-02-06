const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// Save user data 
router.post('/users', upload.single('photo'), async (req, res) => {
    try {
        const { name, telephone, comments, mapCoordinates, approved } = req.body;

        // Handle optional photo field
        const photo = req.file ? `/uploads/${req.file.filename}` : null; // Now allows null values

        const user = new User({
            name,
            telephone,
            comments,
            mapCoordinates,
            approved: approved === 'true', // Ensure boolean conversion
            photo, // Now supports users without images
        });

        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error('Error saving user:', err);
        res.status(400).json({ error: err.message });
    }
});


// Fetch all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ isRemoved: { $ne: true } });
        res.status(200).json(users);
    } catch (err) {
        console.error('MongoDB Query Error:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Serve uploaded images
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Update user approval status
router.patch('/users/:id/toggle-approval', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.approved = !user.approved;
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update approval' });
    }
});

// Soft delete user (mark as removed)
router.patch('/users/:id/remove', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isRemoved: true }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove user' });
    }
});

// Restore user (unremove)
router.patch('/users/:id/restore', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, { isRemoved: false }, { new: true });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to restore user' });
    }
});

// Permanently delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.photo) {
            const filePath = path.join(__dirname, '..', user.photo);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Delete image file
            }
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
