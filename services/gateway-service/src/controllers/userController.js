const db = require('../models/db');
const asyncHandler = require('../utils/asyncHandler');

exports.getUsers = asyncHandler(async (req, res, next) => {
    const roleFilter = req.query.role;
    let queryStr = 'SELECT id, email, role, first_name, last_name FROM users';
    let params = [];
    if (roleFilter) {
        queryStr += ' WHERE role = $1';
        params.push(roleFilter);
    }
    queryStr += ' ORDER BY first_name, last_name';
    const result = await db.query(queryStr, params);
    res.json(result.rows);
});
