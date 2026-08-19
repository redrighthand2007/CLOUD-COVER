window.ViewQuotes = {
    render: () => {
        return \
<main style="padding-top: 100px; padding-bottom: 60px;">
        <div class="container">
            <div class="card animate-fade-up" style="max-width: 800px; margin: 0 auto 40px;">
                <h2 style="margin-bottom: 24px; text-align: center;">Find Your Perfect Policy</h2>
                
                <form id="quoteForm" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; align-items: end;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Your Age</label>
                        <input type="number" id="clientAge" class="form-input" required min="18" max="100" placeholder="e.g. 25">
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Insurance Type</label>
                        <select id="policyType" class="form-input" required>
                            <option value="health">Health Insurance</option>
                            <option value="auto">Auto Insurance</option>
                        </select>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label class="form-label">Coverage (₹)</label>
                        <input type="number" id="coverageAmount" class="form-input" required min="50000" step="10000" placeholder="500000">
                    </div>

                    <button type="submit" class="btn btn-primary" style="height: 48px;">Calculate</button>
                </form>
            </div>

            <div id="resultsSection" style="display: none;">
                <h3 style="margin-bottom: 24px;">Recommended For You</h3>
                <div id="resultsGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px;">
                    <!-- JS injects cards here -->
                </div>
                
                <div style="text-align: center; margin-top: 40px;">
                    <a href="registrationform.html" class="btn btn-outline">Proceed to Registration →</a>
                </div>
            </div>
        </div>
    </main>
        \;
    },
    init: () => { const policyDatabase = [
    { id: 1, name: "Youth Starter Health", type: "health", minAge: 18, maxAge: 30, rate: 0.012, features: ["Free Teleconsultation", "No Room Rent Capping", "₹500Cr Claim Settled"] },
    { id: 2, name: "Family Comprehensive", type: "health", minAge: 25, maxAge: 55, rate: 0.018, features: ["Maternity Cover", "Free Annual Checkup", "Cashless Hospitals"] },
    { id: 3, name: "Senior Care Plus", type: "health", minAge: 50, maxAge: 100, rate: 0.035, features: ["Pre-existing Disease Cover", "Dedicated Manager", "Home Care Support"] },
    { id: 4, name: "Student Auto Basic", type: "auto", minAge: 18, maxAge: 25, rate: 0.025, features: ["Third Party Liability", "24x7 Roadside Assist", "Zero Paperwork"] },
    { id: 5, name: "Safe Driver Pro", type: "auto", minAge: 26, maxAge: 100, rate: 0.015, features: ["Zero Depreciation", "Engine Protection", "Consumables Cover"] }
]; 
    const quoteForm = document.getElementById('quoteForm');
    const resultsSection = document.getElementById('resultsSection');
    const resultsGrid = document.getElementById('resultsGrid');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const age = parseInt(document.getElementById('clientAge').value);
            const type = document.getElementById('policyType').value;
            const coverage = parseInt(document.getElementById('coverageAmount').value);

            // Filter logic
            const targetedPolicies = policyDatabase.filter(p => p.type === type && age >= p.minAge && age <= p.maxAge);
            
            resultsGrid.innerHTML = ''; // Clear previous

            if (targetedPolicies.length === 0) {
                resultsGrid.innerHTML = `<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center;">No targeted policies found for this criteria.</p>`;
            } else {
                targetedPolicies.forEach((policy, index) => {
                    const premium = Math.round(coverage * policy.rate);
                    
                    const cardHTML = `
                        <div class="card glass-panel animate-fade-up" style="animation-delay: ${index * 100}ms">
                            <h3 style="color: var(--primary-color); margin-bottom: 12px; font-family: 'Outfit';">${policy.name}</h3>
                            <div style="margin-bottom: 16px;">
                                <p style="font-size: 0.85rem; color: var(--text-muted);">Target Age: ${policy.minAge}-${policy.maxAge} yrs</p>
                                <p style="font-size: 0.85rem; color: var(--text-muted);">Coverage: ₹${coverage.toLocaleString()}</p>
                            </div>
                            
                            <ul style="list-style: none; margin-bottom: 24px; font-size: 0.9rem;">
                                ${policy.features.map(f => `<li style="margin-bottom: 6px;"><span style="color:var(--primary-color);">✓</span> ${f}</li>`).join('')}
                            </ul>
                            
                            <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 16px;">
                                <div>
                                    <span style="font-size: 0.8rem; color: var(--text-muted);">Annual Premium</span><br>
                                    <strong style="color: var(--accent-color); font-size: 1.2rem;">₹${premium.toLocaleString()}</strong>
                                </div>
                                <button class="btn btn-primary" onclick="alert('Proceeding with ${policy.name}')" style="padding: 8px 16px; font-size: 0.85rem;">Select</button>
                            </div>
                        </div>
                    `;
                    resultsGrid.innerHTML += cardHTML;
                 }
};



