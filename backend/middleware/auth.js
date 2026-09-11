const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Cache JWKS clients based on issuer URL
const clients = {};

function getJwksClient(issuer) {
    if (!clients[issuer]) {
        clients[issuer] = jwksClient({
            jwksUri: `${issuer}/.well-known/jwks.json`,
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 10
        });
    }
    return clients[issuer];
}

function getKey(header, callback) {
    // If we don't know the issuer, we can't securely get the key. 
    // We expect the issuer to be passed, but since jsonwebtoken's verify doesn't pass the payload to getKey, 
    // we'll extract it dynamically inside the middleware first.
}

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    
    // 1. Decode token to find issuer
    const decodedUnverified = jwt.decode(token, { complete: true });
    if (!decodedUnverified || !decodedUnverified.payload || !decodedUnverified.payload.iss) {
        return res.status(401).json({ error: 'Invalid token structure' });
    }
    
    const issuer = decodedUnverified.payload.iss;
    // Basic safety check: ensure it's an AWS Cognito issuer
    if (!issuer.includes('cognito-idp')) {
        return res.status(401).json({ error: 'Untrusted token issuer' });
    }

    // 2. Fetch the key and verify
    const client = getJwksClient(issuer);
    client.getSigningKey(decodedUnverified.header.kid, (err, key) => {
        if (err || !key) {
            console.error('Error fetching signing key:', err);
            return res.status(401).json({ error: 'Invalid token signature' });
        }

        const signingKey = key.getPublicKey();
        jwt.verify(token, signingKey, { issuer }, (verifyErr, decoded) => {
            if (verifyErr) {
                return res.status(401).json({ error: 'Invalid or expired token' });
            }
            
            // Map Cognito user to our app
            req.user = {
                id: decoded.sub,
                email: decoded.email,
                username: decoded['cognito:username'] || decoded.email,
                role: 'Admin', // Default to Admin for project review purposes
                name: decoded.email ? decoded.email.split('@')[0] : 'Office User'
            };
            next();
        });
    });
};

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        return res.status(403).json({ error: 'Admin privileges required' });
    }
};

module.exports = { authenticate, requireAdmin };
