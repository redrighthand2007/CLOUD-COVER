window.ViewAuth = {
    render: () => {
        return ` 
<div class="auth-container">
        <div class="auth-left animate-fade-in">
            <div style="text-align: center; max-width: 400px;">
                <a href="#home" class="logo" style="justify-content: center; margin-bottom: 40px; font-size: 2rem;">Cloud<span>Cover</span></a>
                <h2 style="margin-bottom: 20px; font-size: 2.5rem;">Protect what matters.</h2>
                <p style="color: var(--text-muted); font-size: 1.1rem;">Secure, bias-free, and lightning fast. Powered by modern web architecture.</p>
            </div>
        </div>

        <div class="auth-right">
            <div class="card animate-fade-up" style="width: 100%; max-width: 450px; position: relative; overflow: hidden;">
                
                <!-- Feedback Messages -->
                <div id="formErrors" class="glass-panel" style="display:none; color: #ef4444; padding: 12px; border-color: rgba(239, 68, 68, 0.3); margin-bottom: 20px; font-size: 0.85rem;"></div>
                <div id="successMessage" class="glass-panel" style="display:none; color: #10b981; padding: 12px; border-color: rgba(16, 185, 129, 0.3); margin-bottom: 20px; font-size: 0.85rem;">Success! Redirecting...</div>

                <!-- SIGN IN FORM -->
                <div id="loginSection">
                    <h2 style="margin-bottom: 24px;">Sign In</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label class="form-label">Email or Phone</label>
                            <input type="text" id="loginId" class="form-input" placeholder="name@example.com or 9876543210" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" id="loginPassword" class="form-input" required>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Sign In</button>
                    </form>
                    <p style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: var(--text-muted);">
                        Don't have an account? <span class="toggle-link" id="showSignup">Create Account</span>
                    </p>
                    <p style="text-align: center; margin-top: 10px; font-size: 0.9rem;">
                        <a href="#home" style="color: var(--text-muted); text-decoration: none;">← Back to Home</a>
                    </p>
                </div>

                <!-- SIGN UP FORM (Hidden initially) -->
                <div id="signupSection" style="display: none;">
                    <h2 style="margin-bottom: 24px;">Create Account</h2>
                    <form id="signupForm">
                        <div class="form-group">
                            <label class="form-label">Full Name (As per PAN)</label>
                            <input type="text" id="fullName" class="form-input" placeholder="John Doe" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" id="emailId" class="form-input" placeholder="name@example.com" required>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">Mobile Number</label>
                                <input type="tel" id="phoneNum" class="form-input" placeholder="10 digits" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">PAN Number</label>
                                <input type="text" id="panNum" class="form-input" placeholder="ABCDE1234F" maxlength="10" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Password</label>
                            <input type="password" id="password" class="form-input" placeholder="Min 8 chars, 1 Uppercase, 1 Number" required>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Sign Up & Verify</button>
                    </form>
                    <p style="text-align: center; margin-top: 20px; font-size: 0.9rem; color: var(--text-muted);">
                        Already have an account? <span class="toggle-link" id="showLogin">Sign In</span>
                    </p>
                </div>

            </div>
        </div>
        `;
    },
    init: () => {

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    
    const errorContainer = document.getElementById('formErrors');
    const successMsg = document.getElementById('successMessage');

    // --- UI Toggle Logic ---
    if(showSignupBtn && showLoginBtn) {
        showSignupBtn.addEventListener('click', () => {
            errorContainer.style.display = 'none';
            loginSection.style.display = 'none';
            signupSection.style.display = 'block';
        });

        showLoginBtn.addEventListener('click', () => {
            errorContainer.style.display = 'none';
            signupSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }

    // --- Login Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorContainer.style.display = 'none';
            
            const loginId = document.getElementById('loginId').value.trim();
            const password = document.getElementById('loginPassword').value;

            if(!loginId || !password) {
                errorContainer.innerHTML = '<div>• Please enter email/phone and password.</div>';
                errorContainer.style.display = 'block';
                return;
            }

            try {
                const btn = loginForm.querySelector('button');
                btn.innerHTML = "Signing in...";
                btn.disabled = true;

                await AuthModule.signIn(loginId, password);
                
                successMsg.innerHTML = "Signed in successfully!";
                successMsg.style.display = 'block';
                
                setTimeout(() => {
                    window.location.hash = '#home'; // Redirect to Homepage
                }, 1000);

            } catch (err) {
                errorContainer.innerHTML = `<div>• Invalid credentials. Try again.</div>`;
                errorContainer.style.display = 'block';
                const btn = loginForm.querySelector('button');
                btn.innerHTML = "Sign In";
                btn.disabled = false;
            }
        });
    }
    
    // --- Signup Logic ---
    const patterns = {
        name: /^[a-zA-Z\s]{3,50}$/,
        phone: /^[6-9]\d{9}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/ // Min 8 chars, 1 uppercase, 1 lowercase, 1 number
    };

    if (signupForm) {
        // Force PAN uppercase
        const panInput = document.getElementById('panNum');
        if(panInput) {
            panInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
            });
        }

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorContainer.innerHTML = '';
            errorContainer.style.display = 'none';
            successMsg.style.display = 'none';

            const name = document.getElementById('fullName').value.trim();
            const phone = document.getElementById('phoneNum').value.trim();
            const email = document.getElementById('emailId').value.trim();
            const pan = panInput.value.trim();
            const password = document.getElementById('password').value;

            let errors = [];

            if (!patterns.name.test(name)) errors.push("Name must be 3-50 letters.");
            if (!patterns.phone.test(phone)) errors.push("Valid 10-digit Indian mobile required.");
            if (!patterns.email.test(email)) errors.push("Invalid email format.");
            if (!patterns.pan.test(pan)) errors.push("Invalid PAN format (e.g. ABCDE1234F).");
            if (!patterns.password.test(password)) errors.push("Password must be 8+ chars with 1 uppercase, 1 lowercase, 1 number.");

            if (errors.length > 0) {
                errorContainer.innerHTML = errors.map(err => `<div>• ${err}</div>`).join('');
                errorContainer.style.display = 'block';
                return;
            }

            try {
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = "Creating Account...";
                submitBtn.disabled = true;

                await AuthModule.signUp(name, email, phone, password, pan);
                
                successMsg.innerHTML = "Account Created! Logging you in...";
                successMsg.style.display = 'block';
                
                setTimeout(() => {
                    // Auto login and redirect to Homepage
                    AuthModule.signIn(email, password).then(() => {
                        window.location.hash = '#home'; // Redirect to Homepage
                    });
                }, 1500);

            } catch (error) {
                errorContainer.innerHTML = `<div>• Registration failed. Please try again.</div>`;
                errorContainer.style.display = 'block';
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = "Sign Up & Verify";
                submitBtn.disabled = false;
            }
        });
    }

    }
};
