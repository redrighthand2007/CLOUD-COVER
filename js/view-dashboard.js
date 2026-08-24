window.ViewDashboard = {
    render: () => {
        return `
<main style="padding-top: 100px; padding-bottom: 60px;">
        <div class="container" style="display: grid; grid-template-columns: 250px 1fr; gap: 30px;">
            
            <!-- Sidebar -->
            <aside class="card animate-fade-in" style="align-self: start; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid var(--border-color); padding-bottom: 20px;">
                    <div style="width: 80px; height: 80px; background: var(--bg-elevated); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">👤</div>
                    <h3 id="dashUserName" style="font-size: 1.1rem;">Welcome User</h3>
                    <p style="color: var(--text-muted); font-size: 0.85rem;">Premium Member</p>
                </div>
                
                <ul style="list-style: none;">
                    <li style="margin-bottom: 10px;"><a href="#" class="btn btn-outline" style="width: 100%; text-align: left; justify-content: flex-start; border-color: transparent; background: var(--bg-elevated); color: var(--primary-color);">📊 Overview</a></li>
                    <li style="margin-bottom: 10px;"><a href="#" class="btn btn-outline" style="width: 100%; text-align: left; justify-content: flex-start; border-color: transparent;">🛡️ My Policies</a></li>
                    <li style="margin-bottom: 10px;"><a href="#quotes" class="btn btn-outline" style="width: 100%; text-align: left; justify-content: flex-start; border-color: transparent;">🔍 Find Quotes</a></li>
                    <li><a href="#bmi" class="btn btn-outline" style="width: 100%; text-align: left; justify-content: flex-start; border-color: transparent;">❤️ Health Check</a></li>
                </ul>
            </aside>

            <!-- Main Content -->
            <div class="animate-fade-up">
                <h2 style="margin-bottom: 24px;">Dashboard Overview</h2>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
                    <div class="card glass-panel" style="padding: 20px; text-align: center;">
                        <h4 style="color: var(--text-muted); margin-bottom: 10px;">Active Policies</h4>
                        <span style="font-size: 2.5rem; font-weight: 800; color: var(--primary-color);">0</span>
                    </div>
                    <div class="card glass-panel" style="padding: 20px; text-align: center;">
                        <h4 style="color: var(--text-muted); margin-bottom: 10px;">Pending Claims</h4>
                        <span style="font-size: 2.5rem; font-weight: 800; color: var(--accent-color);">0</span>
                    </div>
                    <div class="card glass-panel" style="padding: 20px; text-align: center;">
                        <h4 style="color: var(--text-muted); margin-bottom: 10px;">Saved Quotes</h4>
                        <span id="savedQuotesCount" style="font-size: 2.5rem; font-weight: 800; color: var(--text-main);">2</span>
                    </div>
                </div>

                <div class="card">
                    <h3 style="margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Recent Activity</h3>
                    <ul style="list-style: none;">
                        <li style="padding: 15px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                            <span>Checked BMI Health Score</span>
                            <span style="color: var(--text-muted); font-size: 0.85rem;">Today</span>
                        </li>
                        <li style="padding: 15px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                            <span>Generated Health Insurance Quote</span>
                            <span style="color: var(--text-muted); font-size: 0.85rem;">Yesterday</span>
                        </li>
                        <li style="padding: 15px 0; display: flex; justify-content: space-between;">
                            <span>Account created securely via AWS Cognito</span>
                            <span style="color: var(--text-muted); font-size: 0.85rem;">2 Days Ago</span>
                        </li>
                    </ul>
                </div>

                <!-- AWS Cloud Sync Card -->
                <div class="card" style="margin-top: 30px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 16px;">
                        <div>
                            <h3 style="margin: 0;">☁️ Cloud Sync</h3>
                            <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">AWS Lambda → DynamoDB</p>
                        </div>
                        <button id="syncAwsBtn" class="btn btn-primary" style="padding: 6px 16px; font-size: 0.85rem;">Sync to DynamoDB</button>
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.9rem;" id="syncStatusText">Click the button to securely save your profile data to your AWS Serverless Database.</p>
                </div>
            </div>

        </div>
    </main>
        `;
    },
    init: () => {
        // Enforce Authentication — redirect to Cognito if not logged in
        if (typeof AuthModule !== 'undefined') AuthModule.requireAuth();

        // Display logged-in user's email from decoded JWT
        const email = localStorage.getItem('ic_user_email');
        const nameEl = document.getElementById('dashUserName');
        if (email && nameEl) {
            nameEl.innerText = email;
        }

        // AWS API Gateway + Lambda + DynamoDB Integration
        const syncBtn = document.getElementById('syncAwsBtn');
        const statusText = document.getElementById('syncStatusText');

        if (syncBtn) {
            syncBtn.addEventListener('click', async () => {
                syncBtn.innerText = 'Syncing...';
                syncBtn.disabled = true;

                try {
                    const idToken = localStorage.getItem('ic_session_token');
                    if (!idToken) throw new Error('No session token. Please sign in again.');

                    const response = await fetch('https://nwmdojx1m4.execute-api.ap-south-1.amazonaws.com/prod/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': idToken  // Cognito JWT Authorizer
                        },
                        body: JSON.stringify({
                            email: email || 'unknown',
                            activePolicies: 0,
                            savedQuotes: 2
                        })
                    });

                    if (!response.ok) throw new Error('AWS Error: ' + response.status + ' ' + response.statusText);

                    const data = await response.json();
                    statusText.innerHTML = '<span style="color: #4dbfa8;">✓ Successfully synced to DynamoDB via AWS Lambda!</span>';

                } catch (error) {
                    console.error('Sync error:', error);
                    statusText.innerHTML = `<span style="color: #ef4444;">✗ Sync failed: ${error.message}</span>`;
                } finally {
                    syncBtn.innerText = 'Sync to DynamoDB';
                    syncBtn.disabled = false;
                }
            });
        }
    }
};
