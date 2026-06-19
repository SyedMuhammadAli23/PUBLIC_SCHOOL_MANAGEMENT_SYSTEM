const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');
const { validateBody } = require('../middleware/validator');

router.get('/', authMiddleware, notificationController.getNotifications);
router.post('/', authMiddleware, validateBody(['title', 'message']), notificationController.createNotification);

module.exports = router;
