const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'jobboard_user',
    password: process.env.DB_PASSWORD || 'JobBoardSecretPass_2026!',
    database: process.env.DB_NAME || 'job_board_db',
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

async function query(sql, params = []) {
    const [rows, fields] = await pool.query(sql, params);
    return rows;
}

async function checkConnection(maxRetries = 30, delayMs = 2000) {
    for (let i = 1; i <= maxRetries; i++) {
        try {
            const connection = await pool.getConnection();
            console.log(`[Database] Successfully connected to MySQL at ${process.env.DB_HOST || 'db'}:${process.env.DB_PORT || '3306'}`);
            connection.release();
            return true;
        } catch (err) {
            console.log(`[Database] Connection attempt ${i}/${maxRetries} failed: ${err.message}. Retrying in ${delayMs / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    throw new Error('[Database] Could not connect to MySQL after maximum retries');
}

module.exports = {
    pool,
    query,
    checkConnection
};
