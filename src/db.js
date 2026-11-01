const { Pool } = require('pg');
const config = require('./config');
const { UUID_RE } =require('./utils');

const pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.dbSsl === 'false' ? false : { rejectUnauthorized: false },
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS passes (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      document TEXT NOT NULL,
      issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      status TEXT NOT NULL DEFAULT 'ACTIVE'
    )`);
}

async function getCountsAll() {
    const {rows} = await pool.query('SELECT count(*)::int AS total from passes')
    return rows[0]
}

async function getCountsActive() {
    const { rows } = await pool.query(`SELECT count(*)::int AS total FROM passes WHERE status = 'ACTIVE'`)
    return rows[0]
}

async function getPass(id) {
    if (!UUID_RE.test(id)) return undefined;
    const { rows } = await pool.query('SELECT * from passes where id = $1', [id])
    return rows[0];
}

async function listPasses() {
    const { rows } = await pool.query('SELECT * from passes ORDER BY issued_at DESC');
    return rows;
}

async function cancelPass(id) {
    if (!UUID_RE.test(id)) return undefined;
    const { rows } = await pool.query(`UPDATE passes set status = 'CANCELLED' WHERE id = $1`, [id]);
}

async function deletePass(id) {
    if (!UUID_RE.test(id)) return undefined;
    const { rows } = await pool.query(`DELETE from passes where id = $1`, [id]);
}

module.exports = { pool, initDb, getCountsAll, getCountsActive, getPass, listPasses, cancelPass, deletePass };