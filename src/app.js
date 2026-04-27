const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middlewares/error.middleware');

// Setup all Sequelize associations
const setupAssociations = require('./models/associations');
setupAssociations();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Base Routes
app.get('/', (req, res) => {
    res.send('Backend is live');
});

app.get('/test', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is working correctly',
        timestamp: new Date().toISOString()
    });
});

// Routes
app.use('/driver', require('./routes/driverRoutes')); // Standard path for Flutter app
app.use('/admin', require('./routes/admin.routes'));


app.use('/api/buses', require('./routes/bus.routes'));
app.use('/api/drivers', require('./routes/driver.routes'));
app.use('/api/v1/driver', require('./routes/v1/driver'));
app.use('/api/routes', require('./routes/route.routes'));
app.use('/api/assignments', require('./routes/assignment.routes'));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        time: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
