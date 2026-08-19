window.ViewHome = {
    render: () => {
        return \
<main style="flex: 1; padding-top: 80px; display: flex; align-items: center; justify-content: center;">
        <div class="container text-center animate-fade-up" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <h1 style="font-size: 3.5rem; margin-bottom: 15px; line-height: 1.2;">
                Instant Quotes.<br>
                <span style="color: var(--primary-color);">Zero Agent Bias.</span>
            </h1>
            <p style="color: var(--text-muted); font-size: 1.2rem; max-width: 600px; margin: 0 auto 30px;">
                Discover the perfect insurance policy in seconds using our client-side algorithm. No spam calls, just pure data.
            </p>
            <div style="display: flex; justify-content: center;">
                <a href="#quotes" class="btn btn-primary">Get Started</a>
            </div>
        </div>
    </main>
        \;
    },
    init: () => {
        // Initialization logic for home goes here
        console.log("home view initialized");
    }
};

