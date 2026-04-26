require('dotenv').config();
const app = require('./src/app');
const { pool } = require('./src/config/db');

// Render uses process.env.PORT, default to 10000 for local development if needed
const PORT = process.env.PORT || 10000;

/**
 * Start Server
 * We verify the DB connection before listening to ensure the API is fully ready.
 */
const startServer = async () => {
    try {
        // The db.js already tests the connection on import, 
        // but we can do an explicit check here if we want to be certain.
        await pool.query('SELECT NOW()');
        console.log('✅ PostgreSQL: Connection verified');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`
🚀 RaahiX Backend is Live!
📡 Port: ${PORT}
🔗 URL: http://localhost:${PORT}
🕒 Time: ${new Date().toLocaleString()}
            `);
        });
    } catch (err) {
        console.error('❌ CRITICAL ERROR: Could not start server:', err.message);
        process.exit(1);
    }
};

startServer();

