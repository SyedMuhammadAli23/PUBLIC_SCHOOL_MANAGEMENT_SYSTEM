const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool({
    connectionString: config.databaseUrl,
});

async function initDb() {
    let retries = 5;
    while (retries) {
        try {
            await pool.query('SELECT NOW()');
            console.log('Connected to auth_db database successfully.');
            break;
        } catch (err) {
            console.error(`Database connection failed. Retries left: ${retries - 1}. Error:`, err.message);
            retries -= 1;
            await new Promise(res => setTimeout(res, 2000));
        }
    }

    if (retries === 0) {
        console.error('Could not connect to postgres database. Exiting.');
        process.exit(1);
    }

    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(50) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            profile_details JSONB,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id INT,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) DEFAULT 'info',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);

    const result = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(result.rows[0].count) === 0) {
        console.log('Seeding default users...');
        const bcrypt = require('bcryptjs');
        const adminHash = await bcrypt.hash('admin123', 10);
        const teacherHash = await bcrypt.hash('teacher123', 10);
        const studentHash = await bcrypt.hash('student123', 10);

        await pool.query(`
            INSERT INTO users (email, password_hash, role, first_name, last_name, profile_details) VALUES
            ('admin@asst.edu', $1, 'admin', 'System', 'Admin', '{"department": "Administration"}'::jsonb),
            ('teacher@asst.edu', $2, 'teacher', 'John', 'Doe', '{"department": "Computer Science", "designation": "Professor"}'::jsonb),
            ('student@asst.edu', $3, 'student', 'Alex', 'Smith', '{"roll_number": "ASST-2026-0042", "grade": "12th", "major": "Software Engineering"}'::jsonb)
        `, [adminHash, teacherHash, studentHash]);
        console.log('Default users seeded.');
    }
}

module.exports = {
    pool,
    query: (text, params) => pool.query(text, params),
    initDb
};
