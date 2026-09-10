const COGNITO_DOMAIN = 'https://ap-south-1iutz7kh5h.auth.ap-south-1.amazoncognito.com';
const CLIENT_ID = '7gp7gvu3vh23k225gr1567k810';

const REDIRECT_URI = window.location.origin + window.location.pathname;

export const AuthModule = {
    init: () => {
        console.log("Auth initialized. Connected to AWS Cognito.");
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
                // Reload to let app.js handle state cleanly
                window.location.reload();
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
        
        const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(REDIRECT_URI)}`;
        window.location.href = logoutUrl;
    }
};

AuthModule.init();
