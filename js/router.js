const routes = {
    '': window.ViewHome,
    '#home': window.ViewHome,
    '#quotes': window.ViewQuotes,
    '#bmi': window.ViewBmi,
    '#dashboard': window.ViewDashboard,
    '#contact': window.ViewContact,
    '#auth': window.ViewAuth,
    '#registration': window.ViewRegistration
};

const router = () => {
    let hash = window.location.hash;

    // Redirect auth routes to Cognito Hosted UI
    if (hash === '#auth') {
        AuthModule.signIn();
        return;
    }
    if (hash === '#registration') {
        AuthModule.signUp();
        return;
    }

    let view = routes[hash] || window.ViewNotfound || routes['#home'];
    
    const app = document.getElementById('app');
    
    // Inject the HTML
    app.innerHTML = view.render();
    
    // Run page specific logic
    if (view.init) {
        view.init();
    }
    
    // Run global utilities
    if(window.updateAuthUI) window.updateAuthUI();
    if(window.initScrollObserver) window.initScrollObserver();
    
    // Trigger the pure CSS fade-in animation
    app.classList.remove('animate-fade-in');
    void app.offsetWidth; // Trigger reflow
    app.classList.add('animate-fade-in');
    
    // Update active navbar link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if(link.getAttribute('href') === hash) {
            link.classList.add('active');
        } else if (hash === '' && link.getAttribute('href') === '#home') {
            link.classList.add('active');
        }
    });
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

