// AWS Cognito login for office users (used when AUTH_PROVIDER=cognito).
// The browser sends us a one-time authorization code + its PKCE verifier. We exchange
// them at Cognito's token endpoint, verify the ID token with AWS's own library, and
// revoke the refresh token straight away: after this, CloudCover's own session
// (with token_version, roles and instant logout) takes over.
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const config = {
    enabled: process.env.AUTH_PROVIDER === 'cognito',
    region: process.env.COGNITO_REGION,
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    clientId: process.env.COGNITO_CLIENT_ID,
    domain: process.env.COGNITO_DOMAIN,
};

if (config.enabled) {
    for (const key of ['region', 'userPoolId', 'clientId', 'domain']) {
        if (!config[key]) throw new Error(`AUTH_PROVIDER=cognito needs COGNITO_${key.replace(/[A-Z]/g, c => '_' + c).toUpperCase()} in .env`);
    }
}

// Checks signature (against the pool's public keys), issuer, audience (our app client),
// token_use = id, and expiry. Public keys are downloaded once and cached.
const verifier = config.enabled
    ? CognitoJwtVerifier.create({ userPoolId: config.userPoolId, clientId: config.clientId, tokenUse: 'id' })
    : null;

// Only these redirect URLs are registered on the app client
function redirectUriFor(origin) {
    return `${origin}/auth-callback.html`;
}

// What the login page needs to start a Cognito login (none of this is secret)
function publicConfig(origin) {
    if (!config.enabled) return { provider: 'local' };
    return {
        provider: 'cognito',
        cognito: { domain: config.domain, clientId: config.clientId, redirectUri: redirectUriFor(origin) },
    };
}

class CognitoLoginError extends Error {}

async function postForm(path, params) {
    return fetch(`https://${config.domain}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(params),
    });
}

// code + PKCE verifier -> verified ID token payload
async function exchangeCode(code, codeVerifier, origin) {
    const res = await postForm('/oauth2/token', {
        grant_type: 'authorization_code',
        client_id: config.clientId,
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUriFor(origin),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || !body.id_token) {
        throw new CognitoLoginError(body.error === 'invalid_grant'
            ? 'This login link has expired or was already used. Please log in again.'
            : 'AWS Cognito login failed. Please try again.');
    }

    // We don't keep Cognito's refresh token; revoke it so it can never be reused
    if (body.refresh_token) {
        postForm('/oauth2/revoke', { token: body.refresh_token, client_id: config.clientId })
            .catch(err => console.error('Cognito refresh token revoke failed:', err.message));
    }

    try {
        return await verifier.verify(body.id_token);
    } catch (err) {
        console.error('Cognito ID token rejected:', err.message);
        throw new CognitoLoginError('AWS Cognito login could not be verified.');
    }
}

// Where to send the browser to also end the Cognito session on logout
function logoutUrl(origin) {
    if (!config.enabled) return null;
    const params = new URLSearchParams({ client_id: config.clientId, logout_uri: `${origin}/login.html` });
    return `https://${config.domain}/logout?${params}`;
}

module.exports = { config, publicConfig, exchangeCode, logoutUrl, CognitoLoginError };
