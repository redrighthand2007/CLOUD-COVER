window.ViewDashboard = {
    render: () => {
        return `
<main style="width: 100%; max-width: 100%;">
        <div class="container" style="max-width: 900px; margin: 0 auto; width: 100%;">
            
            <div class="animate-fade-up">
                
                <!-- Horizontal Profile Card (25% PFP / 75% Info) -->
                <div class="card glass-panel" style="display: flex; align-items: center; padding: 30px; margin-bottom: 30px; gap: 24px;">
                    <!-- 25% Left Side -->
                    <div style="flex: 0 0 25%; display: flex; justify-content: center;">
                        <div style="width: 100px; height: 100px; background: var(--bg-elevated); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; border: 2px solid var(--border-color);">
                            &#128100;
                        </div>
                    </div>
                    <!-- 75% Right Side -->
                    <div style="flex: 1;">
                        <h2 id="dashUserName" style="font-size: 1.8rem; margin-bottom: 4px;">Welcome User</h2>
                        <p id="dashUserEmail" style="color: var(--text-muted); font-size: 1.05rem;">user@example.com</p>
                        <span style="display: inline-block; margin-top: 12px; padding: 4px 12px; background: rgba(77, 191, 168, 0.1); color: var(--primary-color); border-radius: 20px; font-size: 0.8rem; border: 1px solid rgba(77, 191, 168, 0.2);">Premium Member</span>
                    </div>
                </div>

                <!-- 3 Stats Boxes -->
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

                <!-- Recent Activity -->
                <div class="card" style="margin-bottom: 30px;">
                    <h3 style="margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px;">Recent Activity</h3>
                    <ul style="list-style: none; max-height: 200px; overflow-y: auto; padding-right: 10px;" class="custom-scroll">
                        <li style="padding: 15px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                            <span>Checked BMI Health Score</span>
                            <span style="color: var(--text-muted); font-size: 0.85rem;">Today</span>
                        </li>
                        <li style="padding: 15px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                            <span>Generated Health Insurance Quote</span>
                            <span style="color: var(--text-muted); font-size: 0.85rem;">Yesterday</span>
                        </li>
                        <li style="padding: 15px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                            <span>Account created securely via AWS Cognito</span>
                            <span style="color: var(--text-muted); font-size: 0.85rem;">2 Days Ago</span>
                        </li>
                        <li style="padding: 15px 0; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between;">
                            <span>Browsed Auto Insurance Catalog</span>
                            <span style="color: var(--text-muted); font-size: 0.85rem;">3 Days Ago</span>
                        </li>
                        <li style="padding: 15px 0; display: flex; justify-content: space-between;">
                            <span>Updated Contact Preferences</span>
                            <span style="color: var(--text-muted); font-size: 0.85rem;">Last Week</span>
                        </li>
                    </ul>
                </div>

                <!-- AWS Cloud Sync Card -->
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 16px;">
                        <div>
                            <h3 style="margin: 0;">Cloud Sync</h3>
                            <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">AWS Lambda -> DynamoDB</p>
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
        if (typeof AuthModule !== 'undefined') AuthModule.requireAuth();

        const email = localStorage.getItem('ic_user_email');
        const nameEl = document.getElementById('dashUserName');
        const emailEl = document.getElementById('dashUserEmail');
        
        if (email) {
            if (nameEl) {
                let firstName = email.split('@')[0].split(/[._-]/)[0];
                firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
                nameEl.innerText = firstName;
            }
            if (emailEl) {
                emailEl.innerText = email;
            }
        }

        const syncBtn = document.getElementById('syncAwsBtn');
        const statusText = document.getElementById('syncStatusText');

        if (syncBtn) {
            syncBtn.addEventListener('click', async () => {
                syncBtn.innerText = 'Syncing...';
                syncBtn.disabled = true;

                try {
                    const idToken = localStorage.getItem('ic_session_token');
                    if (!idToken) throw new Error('No session token. Please sign in again.');

                    const response = await fetch('https://1gj1qu9yai.execute-api.ap-south-1.amazonaws.com/prod/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': idToken
                        },
                        body: JSON.stringify({
                            email: email || 'unknown',
                            activePolicies: 0,
                            savedQuotes: 2
                        })
                    });

                    if (!response.ok) throw new Error('AWS Error: ' + response.status + ' ' + response.statusText);

                    const data = await response.json();
                    statusText.innerHTML = '<span style="color: #4dbfa8;">Successfully synced to DynamoDB via AWS Lambda!</span>';

                } catch (error) {
                    console.error('Sync error:', error);
                    statusText.innerHTML = '<span style="color: #ef4444;">Sync failed.</span>';
                } finally {
                    syncBtn.innerText = 'Sync to DynamoDB';
                    syncBtn.disabled = false;
                }
            });
        }
    }
};
