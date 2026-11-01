const { auth } = require('express-openid-connect');
const config = require('./config');

const oidc = auth({
    authRequired: false,
    auth0Logout: true,
    baseURL: config.baseUrl,
    issuerBaseURL: config.auth0Domain,
    clientID: config.webClientId,
    clientSecret: config.webClientSecret,
    secret: config.sessionSecret,
    authorizationParams: { response_type: 'code', scope: 'openid profile email' },    
});

module.exports = { oidc };