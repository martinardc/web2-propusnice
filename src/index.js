const express = require('express');
const config = require('./config');
const { initDb } = require('./db');
const webRouter = require('./routes/web');
const { oidc } = require('./auth')
const apiRouter = require('./routes/api');

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(oidc); // dodaje rute /login, /logout, /callback 

app.use('/', webRouter);
app.use('/', apiRouter);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: status >= 500 ? 'Greška na serveru' : err.message });
});

initDb()
  .then(() => {
    app.listen(config.port, () => console.log(`Server na portu ${config.port}`));
  })
  .catch((err) => {
    console.error('Greška pri spajanju na bazu:', err.message);
    process.exit(1);
  });