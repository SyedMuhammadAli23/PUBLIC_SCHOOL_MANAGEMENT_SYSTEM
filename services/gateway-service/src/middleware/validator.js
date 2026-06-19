const ApiError = require('../utils/ApiError');
module.exports = {
    validateBody: (schema) => (req, res, next) => {
        for (const key of schema) {
            if (req.body[key] === undefined) {
                return next(new ApiError(400, `Missing required field: ${key}`));
            }
        }
        next();
    }
};
