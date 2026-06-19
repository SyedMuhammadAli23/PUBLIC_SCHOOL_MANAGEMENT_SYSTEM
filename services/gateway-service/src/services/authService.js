const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

module.exports = {
    hashPassword: (password) => bcrypt.hash(password, 10),
    comparePassword: (password, hash) => bcrypt.compare(password, hash),
    generateToken: (user) => {
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: `${user.first_name} ${user.last_name}` },
            config.jwtSecret,
            { expiresIn: '24h' }
        );
    }
};
