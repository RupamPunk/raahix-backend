require('dotenv').config();
const app = require('./src/app');

const PORT = Number(process.env.PORT || 10000);

const startServer = async () => {
    try {
        console.log('✅ Starting RaahiX Backend (no DB required for demo)');

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

