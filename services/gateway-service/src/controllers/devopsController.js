const db = require('../models/db');
const http = require('http');
const asyncHandler = require('../utils/asyncHandler');

// Helper to check HTTP health and latency of a service
function pingService(url, timeoutMs = 1500) {
    return new Promise((resolve) => {
        const start = process.hrtime();
        const parsedUrl = new URL(url);
        
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname,
            method: 'GET',
            timeout: timeoutMs
        };

        const req = http.request(options, (res) => {
            const diff = process.hrtime(start);
            const latency = Math.round((diff[0] * 1000) + (diff[1] / 1000000));
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve({ status: 'UP', latency });
            } else {
                resolve({ status: 'DOWN', latency, error: `HTTP ${res.statusCode}` });
            }
        });

        req.on('error', (err) => {
            const diff = process.hrtime(start);
            const latency = Math.round((diff[0] * 1000) + (diff[1] / 1000000));
            resolve({ status: 'DOWN', latency, error: err.message });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ status: 'DOWN', latency: timeoutMs, error: 'Timeout' });
        });

        req.end();
    });
}

// 1. Health Status check for all services
exports.getHealth = asyncHandler(async (req, res) => {
    const ALB = process.env.ALB_URL;

    const services = [
        {
            name: 'Gateway Service',
            url: 'http://localhost:5005/health',
            tech: 'Node.js Express',
            port: 5005
        },
        {
            name: 'Academic Service',
            url: `${ALB}/api/academics/health`,
            tech: 'Go',
            port: 8081
        },
        {
            name: 'Scheduling Service',
            url: `${ALB}/api/schedule/health`,
            tech: 'Go',
            port: 8082
        },
        {
            name: 'Library Service',
            url: `${ALB}/api/library/health`,
            tech: 'Go',
            port: 8083
        },
        {
            name: 'Finance Service',
            url: `${ALB}/api/finance/health`,
            tech: 'Go',
            port: 8084
        },
        {
            name: 'Inventory Service',
            url: `${ALB}/api/inventory/health`,
            tech: 'Go',
            port: 8085
        },
        {
            name: 'Cafe Service',
            url: `${ALB}/api/cafe/health`,
            tech: 'Go',
            port: 8086
        },
        {
            name: 'Assignment & Quiz Service',
            url: `${ALB}/api/assignments/health`,
            tech: 'Python FastAPI',
            port: 8001
        },
        {
            name: 'Research Lab Service',
            url: `${ALB}/api/research/health`,
            tech: 'Python FastAPI',
            port: 8002
        },
        {
            name: 'Parking & Alumni Service',
            url: `${ALB}/api/parking/health`,
            tech: 'Python FastAPI',
            port: 8003
        },
        {
            name: 'Report Service',
            url: `${ALB}/api/report/health`,
            tech: 'Python FastAPI',
            port: 8004
        }
    ];

    // Check Postgres Health
    const pgStart = process.hrtime();
    let pgStatus = 'DOWN';
    let pgLatency = 0;
    try {
        await db.query('SELECT NOW()');
        const pgDiff = process.hrtime(pgStart);
        pgLatency = Math.round((pgDiff[0] * 1000) + (pgDiff[1] / 1000000));
        pgStatus = 'UP';
    } catch (e) {
        pgStatus = 'DOWN';
    }

    const healthResults = await Promise.all(
        services.map(async (s) => {
            const check = await pingService(s.url);
            return {
                name: s.name,
                url: s.url,
                tech: s.tech,
                port: s.port,
                status: check.status,
                latency: check.latency,
                error: check.error || null
            };
        })
    );

    healthResults.unshift({
        name: 'Database (PostgreSQL)',
        url: 'localhost:5432',
        tech: 'Postgres',
        port: 5432,
        status: pgStatus,
        latency: pgLatency,
        error: pgStatus === 'DOWN' ? 'Database connection failure' : null
    });

    res.json(healthResults);
});

// 2. Fetch traffic/flow logs
exports.getTrafficLogs = asyncHandler(async (req, res) => {
    const result = await db.query('SELECT * FROM traffic_logs ORDER BY created_at DESC LIMIT 200');
    res.json(result.rows);
});

// 3. Fetch click telemetry metrics
exports.getClickMetrics = asyncHandler(async (req, res) => {
    const result = await db.query('SELECT * FROM user_click_metrics ORDER BY created_at DESC LIMIT 500');
    res.json(result.rows);
});

// 4. Log a new click metric with simulated geolocation
exports.logClickMetric = asyncHandler(async (req, res) => {
    const { elementId, page, geo } = req.body;
    
    if (!elementId || !page) {
        return res.status(400).json({ error: 'Missing required click telemetry fields' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    
    // Fallback to random mock geolocation points (cities around the world) if not provided
    const mockLocations = [
        { country: 'United States', city: 'San Francisco', lat: 37.7749, lon: -122.4194 },
        { country: 'United Kingdom', city: 'London', lat: 51.5074, lon: -0.1278 },
        { country: 'Japan', city: 'Tokyo', lat: 35.6762, lon: 139.6503 },
        { country: 'United Arab Emirates', city: 'Dubai', lat: 25.2048, lon: 55.2708 },
        { country: 'Germany', city: 'Berlin', lat: 52.5200, lon: 13.4050 },
        { country: 'Australia', city: 'Sydney', lat: -33.8688, lon: 151.2093 }
    ];
    
    const randomLoc = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    
    const country = geo?.country || randomLoc.country;
    const city = geo?.city || randomLoc.city;
    const lat = geo?.latitude || randomLoc.lat;
    const lon = geo?.longitude || randomLoc.lon;

    await db.query(
        'INSERT INTO user_click_metrics (element_id, page, user_ip, country, city, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [elementId, page, ip, country, city, lat, lon]
    );

    res.status(201).json({ message: 'Click telemetry recorded successfully' });
});
