const http = require('http');
const app = require('./app');
const config = require('./config');
const db = require('./models/db');
const websocketService = require('./services/websocketService');

async function startServer() {
    // Connect to DB and migrate
    await db.initDb();

    const server = http.createServer(app);

    // Initialize WebSockets
    websocketService.init(server);

    server.listen(config.port, () => {
        console.log(`Gateway, Auth & Notification Service running on port ${config.port}`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM signal received. Shutting down gracefully...');
        server.close(() => {
            db.pool.end(() => {
                console.log('Postgres pool closed. Server closed.');
                process.exit(0);
            });
        });
    });
}

startServer().catch(console.error);
