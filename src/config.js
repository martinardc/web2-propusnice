require('dotenv').config()

module.exports = {
  port: process.env.PORT || 3000,
  baseUrl: process.env.BASE_URL,
  databaseUrl: process.env.DATABASE_URL,
  dbSsl: process.env.DB_SSL,
};