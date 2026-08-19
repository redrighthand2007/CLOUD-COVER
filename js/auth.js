/**
 * AuthModule - Scaffolding for future AWS Cognito Integration
 * Currently uses localStorage to mock session state.
 */
const AuthModule = {
    // 1. Initialize AWS Amplify (Placeholder)
    init: () => {
        console.log("Auth initialized. Ready for AWS Cognito.");
    },

    // 2. Check if user is logged in
    isAuthenticated: () => {
        return localStorage.getItem('ic_session_token') !== null;
    },

    // 3. Sign Up (Mock)
    signUp: (name, email, phone, password, pan) => {
        return new Promise((resolve, reject) => {
            // Mock network delay
            setTimeout(() => {
                if(email && password) {
                    // In AWS, you'd call Auth.signUp()
                    resolve({ userConfirmed: false, user: { username: email } });
                } else {
                    reject(new Error("Invalid sign up data"));
                }
            }, 1000);
        });
    },

    // 4. Sign In (Mock)
    signIn: (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // In AWS, you'd call Auth.signIn()
                localStorage.setItem('ic_session_token', 'mock_jwt_token_123');
                localStorage.setItem('ic_user_email', email);
                resolve({ username: email });
            }, 800);
        });
    },

    // 5. Sign Out (Mock)
    signOut: () => {
        localStorage.removeItem('ic_session_token');
        localStorage.removeItem('ic_user_email');
        window.location.hash = '#home';
    },

    // Helper: Protect Routes
    requireAuth: () => {
        if (!AuthModule.isAuthenticated()) {
            window.location.href = 'signup.html?redirect=' + encodeURIComponent(window.location.pathname);
        }
    }
};

AuthModule.init();
