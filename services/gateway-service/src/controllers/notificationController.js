const db = require('../models/db');
const websocketService = require('../services/websocketService');
const asyncHandler = require('../utils/asyncHandler');

exports.getNotifications = asyncHandler(async (req, res, next) => {
    const result = await db.query(
        'SELECT * FROM notifications WHERE user_id IS NULL OR user_id = $1 ORDER BY created_at DESC LIMIT 50',
        [req.user.id]
    );
    res.json(result.rows);
});

exports.createNotification = asyncHandler(async (req, res, next) => {
    const { userId, title, message, type } = req.body;
    const result = await db.query(
        'INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId || null, title, message, type || 'info']
    );
    const newNotif = result.rows[0];
    websocketService.broadcastNotification(newNotif);
    res.status(201).json(newNotif);
});
