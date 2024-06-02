import mysql from 'mysql2/promise';

async function getConnection() {
  const DATABASE_URL = process.env.DATABASE_URL;
  const options = DATABASE_URL
    ? { uri: DATABASE_URL }
    : {
        host: process.env.DATABASE_HOST ?? 'localhost',
        port: parseInt(process.env.DATABASE_PORT ?? '3306'),
        database: process.env.DATABASE_NAME ?? 'game_reseller',
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        waitForConnections: true,
        connectTimeout: 30000,
      };

  const pool = mysql.createPool(options);

  return pool;
}

const pool = await getConnection();

export const db = {
  connection: await pool.getConnection(),
};
