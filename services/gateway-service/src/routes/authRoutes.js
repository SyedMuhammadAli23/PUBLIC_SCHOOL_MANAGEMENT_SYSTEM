const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { validateBody } = require('../middleware/validator');

router.post('/register', validateBody(['email', 'password', 'role', 'firstName', 'lastName']), authController.register);
router.post('/login', validateBody(['email', 'password']), authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

module.exports = router;
