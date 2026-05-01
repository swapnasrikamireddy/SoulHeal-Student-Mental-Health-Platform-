require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: '🌿 SoulHeal API is running', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SoulHeal Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
