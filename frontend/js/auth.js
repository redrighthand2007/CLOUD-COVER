const COGNITO_DOMAIN = 'https://ap-south-1iutz7kh5h.auth.ap-south-1.amazoncognito.com';
const CLIENT_ID = '7gp7gvu3vh23k225gr1567k810';

// We want to redirect back to index.html to catch the hash, which routes properly
const REDIRECT_URI = window.location.origin + '/index.html'; 

export const AuthModule = {
    init: () => {
        AuthModule.checkUrlForTokens();
    },

    checkUrlForTokens: () => {
        const hash = window.location.hash.substring(1);
        if (hash.includes('id_token=')) {
            const params = new URLSearchParams(hash);
            const idToken = params.get('id_token');
            const accessToken = params.get('access_token');
            
            if (idToken) {
                localStorage.setItem('cloudcover_token', idToken);
                localStorage.setItem('cloudcover_access', accessToken);
                
                try {
                    const payload = JSON.parse(atob(idToken.split('.')[1]));
                    const mockUser = {
                        name: payload.email ? payload.email.split('@')[0] : 'Office User',
                        role: 'Admin',
                        email: payload.email
                    };
                    localStorage.setItem('cloudcover_user', JSON.stringify(mockUser));
                } catch(e) { console.error("Error decoding JWT", e); }

                window.location.hash = '';
                // Redirect to dashboard after login
                window.location.href = 'dashboard.html';
            }
        }
    },

    isAuthenticated: () => {
        return localStorage.getItem('cloudcover_token') !== null;
    },

    signIn: () => {
        const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=token&scope=email%20openid&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = loginUrl;
    },
    
    signOut: () => {
        localStorage.removeItem('cloudcover_token');
        localStorage.removeItem('cloudcover_access');
        localStorage.removeItem('cloudcover_user');
        
        // AWS Cognito logout redirect MUST match a registered Allowed Sign-Out URL
        // Typically it's the base URL
        const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(window.location.origin)}`;
        window.location.href = logoutUrl;
    }
};

AuthModule.init();
