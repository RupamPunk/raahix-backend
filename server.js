require('dotenv').config();
const app = require('./src/app');
const { pool } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

// Test DB Connection before starting the server
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('CRITICAL: Failed to connect to the database:', err.message);
        process.exit(1);
    } else {
        console.log('PostgreSQL: Connection established successfully');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`
🚀 Server is production-ready!
📡 Listening on: http://0.0.0.0:${PORT}
🕒 Started at: ${new Date().toISOString()}
            `);
        });
    }
});
