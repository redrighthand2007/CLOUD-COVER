window.ViewDashboard = {
    render: () => {
        return \
<main style="width: 100%; max-width: 100%;">
        <div class="container" style="max-width: 900px; margin: 0 auto; width: 100%;">
            
            <div class="animate-fade-up">
                
                <!-- Horizontal Profile Card (25% PFP / 75% Info) -->
                <div class="card glass-panel" style="padding: 30px; margin-bottom: 30px; position: relative;">
                    <div style="display: flex; align-items: center; gap: 24px;">
                        <!-- 25% Left Side -->
                        <div style="flex: 0 0 100px; display: flex; justify-content: center;">
                            <div style="width: 100px; height: 100px; background: var(--bg-elevated); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 3rem; border: 2px solid var(--border-color);">
                                &#128100;
                            </div>
                        </div>
                        <!-- 75% Right Side -->
                        <div style="flex: 1;">
                            <h2 id="dashUserName" style="font-size: 1.8rem; margin-bottom: 4px;">Loading...</h2>
                            <p id="dashUserEmail" style="color: var(--text-muted); font-size: 1.05rem;">loading@example.com</p>
                        </div>
                        <!-- Expand Icon -->
                        <div id="expandProfileBtn" style="position: absolute; right: 20px; top: 20px; cursor: pointer; padding: 10px; font-size: 1.2rem; color: var(--primary-color); background: rgba(77, 191, 168, 0.1); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                            &#9660;
                        </div>
                    </div>

                    <!-- Hidden Full Profile Info -->
                    <div id="profileDetails" style="display: none; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color); animation: fadeIn 0.3s ease;">
                        <h4 style="margin-bottom: 15px; color: var(--primary-color);">Customer Information</h4>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; color: var(--text-main); font-size: 0.95rem;">
                            <div><strong style="color: var(--text-muted);">Full Name:</strong> <span id="detName"></span></div>
                            <div><strong style="color: var(--text-muted);">Email ID:</strong> <span id="detEmail"></span></div>
                            <div><strong style="color: var(--text-muted);">Phone No:</strong> <span id="detPhone">Not Provided</span></div>
                            <div><strong style="color: var(--text-muted);">DOB:</strong> <span>01 Jan 1990 (Sample)</span></div>
                            <div><strong style="color: var(--text-muted);">PAN No:</strong> <span>ABCDE1234F (Sample)</span></div>
                            <div><strong style="color: var(--text-muted);">Address:</strong> <span>Mumbai, MH (Sample)</span></div>
                            <div><strong style="color: var(--text-muted);">Password:</strong> <span>********</span></div>
                        </div>
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

                <!-- SWAPPED: AWS Cloud Sync Card is now BEFORE Recent Activity -->
                <div class="card" style="margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; margin-bottom: 16px;">
                        <div>
                            <h3 style="margin: 0;">Cloud Sync</h3>
                            <p style="color: var(--text-muted); font-size: 0.8rem; margin-top: 4px;">AWS Lambda -> DynamoDB</p>
                        </div>
                        <button id="syncAwsBtn" class="btn btn-primary" style="padding: 6px 16px; font-size: 0.85rem;">Sync to DynamoDB</button>
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.9rem;" id="syncStatusText">Click the button to securely save your profile data to your AWS Serverless Database.</p>
                </div>

                <!-- Recent Activity -->
                <div class="card">
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

            </div>

        </div>
    </main>
        \;
    },
    init: () => {
        if (typeof AuthModule !== 'undefined') AuthModule.requireAuth();

        const idToken = localStorage.getItem('ic_session_token');
        const email = localStorage.getItem('ic_user_email') || 'unknown@example.com';
        
        let fullName = 'Welcome User';
        let phoneNo = 'Not Provided';

        if (idToken) {
            try {
                // Decode JWT to get first name, last name, phone, etc.
                const payload = JSON.parse(atob(idToken.split('.')[1]));
                
                const given = payload.given_name || '';
                const family = payload.family_name || '';
                
                if (given || family) {
                    fullName = (given + ' ' + family).trim();
                } else if (payload.name) {
                    fullName = payload.name;
                } else {
                    let first = email.split('@')[0].split(/[._-]/)[0];
                    fullName = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
                }

                if (payload.phone_number) {
                    phoneNo = payload.phone_number;
                }
            } catch(e) {
                console.error('Error decoding JWT for profile data');
            }
        }

        const nameEl = document.getElementById('dashUserName');
        const emailEl = document.getElementById('dashUserEmail');
        if (nameEl) nameEl.innerText = fullName;
        if (emailEl) emailEl.innerText = email;

        // Populate expanded profile details
        document.getElementById('detName').innerText = fullName;
        document.getElementById('detEmail').innerText = email;
        document.getElementById('detPhone').innerText = phoneNo;

        // Expand profile card logic
        const expandBtn = document.getElementById('expandProfileBtn');
        const profileDetails = document.getElementById('profileDetails');
        if (expandBtn && profileDetails) {
            expandBtn.addEventListener('click', () => {
                if (profileDetails.style.display === 'none') {
                    profileDetails.style.display = 'block';
                    expandBtn.innerHTML = '&#9650;'; // Up arrow
                    expandBtn.style.transform = 'rotate(180deg)';
                } else {
                    profileDetails.style.display = 'none';
                    expandBtn.innerHTML = '&#9660;'; // Down arrow
                    expandBtn.style.transform = 'rotate(0deg)';
                }
            });
        }

        const syncBtn = document.getElementById('syncAwsBtn');
        const statusText = document.getElementById('syncStatusText');

        if (syncBtn) {
            syncBtn.addEventListener('click', async () => {
                syncBtn.innerText = 'Syncing...';
                syncBtn.disabled = true;

                try {
                    if (!idToken) throw new Error('No session token. Please sign in again.');

                    const response = await fetch('https://1gj1qu9yai.execute-api.ap-south-1.amazonaws.com/prod/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': idToken
                        },
                        body: JSON.stringify({
                            email: email,
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
