const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const config = require('../config');

let wss = null;
const clients = new Map();

function init(server) {
    wss = new WebSocket.Server({ noServer: true });

    wss.on('connection', (ws, request) => {
        console.log('New WebSocket connection established.');

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                if (data.type === 'auth') {
                    jwt.verify(data.token, config.jwtSecret, (err, decoded) => {
                        if (!err) {
                            ws.userId = decoded.id;
                            ws.userRole = decoded.role;
                            clients.set(decoded.id, ws);
                            ws.send(JSON.stringify({ type: 'auth_success', message: `Authenticated as ${decoded.email}` }));
                        } else {
                            ws.send(JSON.stringify({ type: 'auth_fail', message: 'Authentication failed' }));
                        }
                    });
                }
            } catch (e) {
                console.error('WS Error:', e.message);
            }
        });

        ws.on('close', () => {
            if (ws.userId) {
                clients.delete(ws.userId);
            }
            console.log('WebSocket connection closed.');
        });
    });

    server.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    });
}

function broadcastNotification(notification) {
    if (!wss) return;
    const payload = JSON.stringify({ type: 'notification', data: notification });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            if (notification.user_id === null || client.userId === notification.user_id) {
                client.send(payload);
            }
        }
    });
}

module.exports = {
    init,
    broadcastNotification
};
