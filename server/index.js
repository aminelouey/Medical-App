require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Sync database without altering existing tables to avoid constraint errors
        await sequelize.sync();
        console.log('Database synced successfully.');

        app.listen(PORT, () => {
        });

        // Keep alive
        setInterval(() => {
            // Heartbeat
        }, 10000);

    } catch (error) {
        console.error('Unable to start server:', error);
    }
}

startServer();
