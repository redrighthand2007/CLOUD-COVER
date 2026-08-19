document.addEventListener('DOMContentLoaded', () => {
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
                    window.location.href = 'index.html'; // Redirect to Homepage
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
                        window.location.href = 'index.html'; // Redirect to Homepage
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
});