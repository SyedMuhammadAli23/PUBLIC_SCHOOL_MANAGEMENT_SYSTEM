const rateLimit = {};
module.exports = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    if (!rateLimit[ip]) {
        rateLimit[ip] = [];
    }
    rateLimit[ip] = rateLimit[ip].filter(timestamp => now - timestamp < 60000);
    if (rateLimit[ip].length >= 100) {
        return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    rateLimit[ip].push(now);
    next();
};
