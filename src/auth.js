const { auth } = require('express-openid-connect');
const config = require('./config');
const { auth: jwtAuth, requiredScopes } = require('express-oauth2-jwt-bearer');

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

const checkJwt = jwtAuth({
  issuerBaseURL: config.auth0Domain,
  audience: config.auth0Audience,
});

module.exports = { oidc, checkJwt, requiredScopes };