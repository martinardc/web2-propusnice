require('dotenv').config()

module.exports = {
    port: process.env.PORT || 3000,
    baseUrl: process.env.BASE_URL,
    databaseUrl: process.env.DATABASE_URL,
    dbSsl: process.env.DB_SSL,
    sessionSecret: process.env.SESSION_SECRET,
    auth0Domain: process.env.AUTH0_DOMAIN,
    webClientId: process.env.AUTH0_WEB_CLIENT_ID,
    webClientSecret: process.env.AUTH0_WEB_CLIENT_SECRET,
};