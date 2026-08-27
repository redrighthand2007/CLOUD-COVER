window.ViewNotfound = {
    render: () => {
        return ` 
<main style="width: 100%; max-width: 100%;">
        <div class="container animate-fade-up">
            <h1 style="font-size: 8rem; color: var(--primary-color); margin-bottom: 10px; line-height: 1;">404</h1>
            <h2 style="font-size: 2rem; margin-bottom: 20px;">Out of Coverage Area</h2>
            <p style="color: var(--text-muted); font-size: 1.2rem; max-width: 500px; margin: 0 auto 40px;">
                Looks like the page you are looking for isn't covered by our policy. Let's get you back to safety.
                <br><br>
                <small style="color: red;">DEBUG LOG:<br>
                Hash: \${window.location.hash}<br>
                ViewDashboard type: \${typeof window.ViewDashboard}
                </small>
            </p>
            <a href="#home" class="btn btn-primary pulse-btn">Return Home</a>
        </div>
    </main>
        `;
    },
    init: () => {
        console.log("notfound view initialized");
    }
};



