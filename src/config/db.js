const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: {
        rejectUnauthorized: false // <--- ESTO ES LO MÁS IMPORTANTE
    }
});

pool.on('connect', () => console.log('¡Conexión exitosa a la DB de Render!'));

module.exports = pool;