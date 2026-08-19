const policyDatabase = [
    { id: 1, name: "Youth Starter Health", type: "health", minAge: 18, maxAge: 30, rate: 0.012, features: ["Free Teleconsultation", "No Room Rent Capping", "₹500Cr Claim Settled"] },
    { id: 2, name: "Family Comprehensive", type: "health", minAge: 25, maxAge: 55, rate: 0.018, features: ["Maternity Cover", "Free Annual Checkup", "Cashless Hospitals"] },
    { id: 3, name: "Senior Care Plus", type: "health", minAge: 50, maxAge: 100, rate: 0.035, features: ["Pre-existing Disease Cover", "Dedicated Manager", "Home Care Support"] },
    { id: 4, name: "Student Auto Basic", type: "auto", minAge: 18, maxAge: 25, rate: 0.025, features: ["Third Party Liability", "24x7 Roadside Assist", "Zero Paperwork"] },
    { id: 5, name: "Safe Driver Pro", type: "auto", minAge: 26, maxAge: 100, rate: 0.015, features: ["Zero Depreciation", "Engine Protection", "Consumables Cover"] }
];

document.addEventListener('DOMContentLoaded', () => {
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
                });
            }
            
            resultsSection.style.display = 'block';
        });
    }
});