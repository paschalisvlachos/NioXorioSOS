const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use('/uploads', express.static('uploads'));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://admin:!P%40sch%40l1s!@127.0.0.1:27017/NeoChorioSOS?authSource=admin')
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log(err));

// Routes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// Start Server
const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
