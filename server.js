require('dotenv').config();
const app = require('./src/app');
const { pool } = require('./src/config/db');

const PORT = Number(process.env.PORT || 10000);
const requiredEnv = ['JWT_SECRET', 'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length) {
    console.error(`❌ FATAL: Missing required environment variables: ${missingEnv.join(', ')}`);
    process.exit(1);
}

const startServer = async () => {
    try {
        await pool.query('SELECT NOW()');
        console.log('✅ PostgreSQL: Connection verified');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 RaahiX Backend is Live on port ${PORT}`);
        });
    } catch (err) {
        console.error('❌ CRITICAL ERROR: Could not start server:', err.stack || err);
        process.exit(1);
    }
};

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

startServer();

