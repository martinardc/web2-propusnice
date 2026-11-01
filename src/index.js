const express = require('express');
const config = require('./config');
const { initDb } = require('./db');
const webRouter = require('./routes/web');
const { oidc } = require('./auth')

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(oidc); // dodaje rute /login, /logout, /callback 

app.use('/', webRouter);

initDb()
  .then(() => {
    app.listen(config.port, () => console.log(`Server na portu ${config.port}`));
  })
  .catch((err) => {
    console.error('Greška pri spajanju na bazu:', err.message);
    process.exit(1);
  });