const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const { pool } = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        const client = await pool.connect();
        console.log('Database connection successful');
        client.release();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('Shutting down...');
    pool.end(() => {
        process.exit(0);
    });
});

startServer();
