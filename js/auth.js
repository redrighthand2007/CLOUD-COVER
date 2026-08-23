/**
 * AuthModule - Real AWS Cognito Integration (Vanilla JS)
 * Uses Cognito Hosted UI and Implicit Grant flow
 */
const COGNITO_DOMAIN = 'https://ap-south-1iutz7kh5h.auth.ap-south-1.amazoncognito.com';
const CLIENT_ID = '7gp7gvu3vh23k225gr1567k810';

// We dynamically grab the current URL so it works both locally (127.0.0.1:5500) and on GitHub Pages
const REDIRECT_URI = window.location.origin + window.location.pathname;

const AuthModule = {
    init: () => {
        console.log("Auth initialized. Connected to AWS Cognito in Mumbai.");
        AuthModule.checkUrlForTokens();
    },

    // Catch the token when Cognito redirects back to our site
    checkUrlForTokens: () => {
        const hash = window.location.hash.substring(1);
        if (hash.includes('id_token=')) {
            const params = new URLSearchParams(hash);
            const idToken = params.get('id_token');
            const accessToken = params.get('access_token');
            
            if (idToken) {
                // Save tokens
                localStorage.setItem('ic_session_token', idToken);
                localStorage.setItem('ic_access_token', accessToken);
                
                // Optional: Extract email from JWT payload
                try {
                    const payload = JSON.parse(atob(idToken.split('.')[1]));
                    if (payload.email) localStorage.setItem('ic_user_email', payload.email);
                } catch(e) { console.error("Error decoding JWT", e); }

                // Clean the URL hash and go to dashboard
                window.location.hash = '#dashboard';
                if(window.updateAuthUI) window.updateAuthUI();
            }
        }
    },

    isAuthenticated: () => {
        return localStorage.getItem('ic_session_token') !== null;
    },

    // Redirect to Cognito Hosted UI for Login/Signup
    signIn: () => {
        const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=token&scope=email%20openid&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = loginUrl;
    },
    
    signUp: () => {
        const signupUrl = `${COGNITO_DOMAIN}/signup?client_id=${CLIENT_ID}&response_type=token&scope=email%20openid&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = signupUrl;
    },

    signOut: () => {
        localStorage.removeItem('ic_session_token');
        localStorage.removeItem('ic_access_token');
        localStorage.removeItem('ic_user_email');
        
        // Tell Cognito to invalidate the session and redirect back
        const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = logoutUrl;
    },

    // Helper: Protect Routes
    requireAuth: () => {
        if (!AuthModule.isAuthenticated()) {
            AuthModule.signIn(); // Force login if trying to access secure route
        }
    }
};

AuthModule.init();
