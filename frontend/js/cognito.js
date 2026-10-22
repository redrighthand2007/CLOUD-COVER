// Office login through AWS Cognito (authorization code + PKCE).
// 1. startCognitoLogin(): make a random secret (code_verifier), send only its hash
//    (code_challenge) to Cognito, and remember the secret in this tab.
// 2. Cognito asks for password + MFA code, then returns to auth-callback.html with a code.
// 3. auth-callback.html sends code + secret to our server, which finishes the login.
// Anyone who steals the code alone cannot use it without the secret.

const VERIFIER_KEY = 'cloudcover_pkce_verifier';
const STATE_KEY = 'cloudcover_oauth_state';

function base64url(bytes) {
    return btoa(String.fromCharCode(...new Uint8Array(bytes)))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomString(byteCount) {
    return base64url(crypto.getRandomValues(new Uint8Array(byteCount)));
}

export async function startCognitoLogin(cognito) {
    const verifier = randomString(32);           // 43 characters
    const state = randomString(16);              // protects against forged callbacks
    const challenge = base64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));

    sessionStorage.setItem(VERIFIER_KEY, verifier);
    sessionStorage.setItem(STATE_KEY, state);

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: cognito.clientId,
        redirect_uri: cognito.redirectUri,
        scope: 'openid profile',
        state,
        code_challenge_method: 'S256',
        code_challenge: challenge,
    });
    window.location.assign(`https://${cognito.domain}/oauth2/authorize?${params}`);
}

// Returns { code, verifier } when the callback is genuine, otherwise throws
export function readCallback(search = window.location.search) {
    const params = new URLSearchParams(search);
    const expectedState = sessionStorage.getItem(STATE_KEY);
    const verifier = sessionStorage.getItem(VERIFIER_KEY);
    sessionStorage.removeItem(STATE_KEY);
    sessionStorage.removeItem(VERIFIER_KEY);

    if (params.get('error')) {
        throw new Error(params.get('error_description') || 'AWS login was cancelled or failed.');
    }
    const code = params.get('code');
    if (!code || !verifier || !expectedState || params.get('state') !== expectedState) {
        throw new Error('This login link is not valid in this browser tab. Please start again.');
    }
    return { code, verifier };
}
