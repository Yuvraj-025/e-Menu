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

// Serve the built frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/order', require('./routes/order'));
app.use('/api/settings', require('./routes/settings'));

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Cafe Menu API is running' });
});

// Fallback for SPA: Serve index.html for any GET request that isn't handled by API or static files
app.use((req, res, next) => {
  if (!req.path.startsWith('/api') && req.method === 'GET') {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  } else {
    next();
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
