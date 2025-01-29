const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    telephone: { type: String, required: true },
    comments: { type: String, required: true },
    mapCoordinates: { type: String, required: true },
    photo: { type: String, required: false }, // Store as a URL or Base64 string
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
    isRemoved: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);
