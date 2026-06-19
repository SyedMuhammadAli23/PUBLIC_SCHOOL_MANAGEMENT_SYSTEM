module.exports = {
    port: process.env.PORT || 5005,
    jwtSecret: process.env.JWT_SECRET || 'asst-jwt-secret-key-987654321',
    databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/auth_db'
};
