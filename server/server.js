require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static assets from the client public directory for uploads
app.use('/assets', express.static(path.join(__dirname, '../client/public/assets')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/order', require('./routes/order'));
app.use('/api/settings', require('./routes/settings'));

// Root endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Cafe Menu API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
