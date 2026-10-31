const express = require('express');
const config = require('./config');
const { pool, initDb } = require('./db');

const app = express();

app.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT now() AS vrijeme');
  res.send(`OK: ${rows[0].vrijeme}`);
});

initDb()
  .then(() => {
    app.listen(config.port, () => console.log(`Server na portu ${config.port}`));
  })
  .catch((err) => {
    console.error('Greška:', err.message);
    process.exit(1);
  });