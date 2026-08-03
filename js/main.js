document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(11, 17, 26, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        } else {
            navbar.style.background = 'rgba(11, 17, 26, 0.85)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 2. Auth State UI Update
    const updateAuthUI = () => {
        const authBtnContainer = document.getElementById('auth-btn-container');
        if(!authBtnContainer) return;
        
        // Ensure AuthModule is loaded before calling
        if (typeof AuthModule !== 'undefined') {
            if (AuthModule.isAuthenticated()) {
                authBtnContainer.innerHTML = `
                    <a href="dashboard.html" class="nav-item" data-page="dashboard" style="color: white; text-decoration: none; padding: 8px 16px; font-weight: 500;">Dashboard</a>
                    <button onclick="AuthModule.signOut()" class="btn btn-outline" style="padding: 6px 16px; margin-left: 8px;">Log Out</button>
                `;
            } else {
                authBtnContainer.innerHTML = `
                    <a href="signup.html" class="nav-item" data-page="signup" style="color: white; text-decoration: none; padding: 8px 16px; font-weight: 500;">Sign In</a>
                `;
            }
        }
    };
    updateAuthUI();

    // 3. Scroll Reveal Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // 4. Set Active Nav Link Based on Current Page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
    });
});