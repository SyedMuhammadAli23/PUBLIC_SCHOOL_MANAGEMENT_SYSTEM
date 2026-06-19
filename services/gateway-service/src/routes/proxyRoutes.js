const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createProxyMiddleware } = require('http-proxy-middleware');

const setupProxy = (path, targetEnv) => {
    const target = process.env[targetEnv] || 'http://localhost:8080';
    router.use(path, authMiddleware, createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite: (pathStr) => {
            const segment = path.replace('/api', '');
            return pathStr.replace(path, segment);
        },
        onProxyReq: (proxyReq, req) => {
            if (req.user) {
                proxyReq.setHeader('X-User-Id', req.user.id.toString());
                proxyReq.setHeader('X-User-Role', req.user.role);
                proxyReq.setHeader('X-User-Email', req.user.email);
                proxyReq.setHeader('X-User-Name', encodeURIComponent(req.user.name));
            }
        },
        onError: (err, req, res) => {
            console.error(`Proxy error at ${path} -> ${target}:`, err.message);
            res.status(502).json({ error: `Service temporarily unavailable (${path})` });
        }
    }));
};

setupProxy('/api/academics', 'ACADEMIC_SERVICE_URL');
setupProxy('/api/schedule', 'SCHEDULING_SERVICE_URL');
setupProxy('/api/library', 'LIBRARY_SERVICE_URL');
setupProxy('/api/finance', 'FINANCE_SERVICE_URL');
setupProxy('/api/inventory', 'INVENTORY_SERVICE_URL');
setupProxy('/api/cafe', 'CAFE_SERVICE_URL');
setupProxy('/api/assignments', 'ASSIGNMENT_QUIZ_SERVICE_URL');
setupProxy('/api/quizzes', 'ASSIGNMENT_QUIZ_SERVICE_URL');
setupProxy('/api/research', 'RESEARCH_LAB_SERVICE_URL');
setupProxy('/api/labs', 'RESEARCH_LAB_SERVICE_URL');
setupProxy('/api/parking', 'PARKING_ALUMNI_SERVICE_URL');
setupProxy('/api/alumni', 'PARKING_ALUMNI_SERVICE_URL');

module.exports = router;
