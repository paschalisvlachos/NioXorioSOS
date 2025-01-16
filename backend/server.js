const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/NeoChorioSOS')
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

// Routes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// Start Server
const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://localhost:${PORT}`));
