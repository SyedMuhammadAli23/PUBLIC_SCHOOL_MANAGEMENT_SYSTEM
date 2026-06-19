const jwt = require('jsonwebtoken');
const config = require('../config');
const ApiError = require('../utils/ApiError');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next(new ApiError(401, 'Access token required'));
    }

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) {
            return next(new ApiError(403, 'Invalid or expired token'));
        }
        req.user = user;
        next();
    });
};
