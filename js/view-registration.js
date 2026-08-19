window.ViewRegistration = {
    render: () => {
        return ` 
<main style="padding-top: 100px; padding-bottom: 60px;">
        <div class="container" style="max-width: 800px;">
            <div class="card glass-panel animate-fade-up">
                <h2 style="margin-bottom: 30px; border-bottom: 1px solid var(--border-color); padding-bottom: 16px;">Applicant Details</h2>
                
                <div id="formErrors" style="display:none; color: #ef4444; background: rgba(239, 68, 68, 0.1); padding: 12px; border-radius: var(--radius-sm); margin-bottom: 20px; font-size: 0.85rem;"></div>

                <form id="applicantForm">
                    <!-- Grid Layout for Fields -->
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label">First Name *</label>
                            <input type="text" id="fName" class="form-input" required>
                        </div>
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label">Last Name</label>
                            <input type="text" id="lName" class="form-input">
                        </div>
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label">Mobile Number *</label>
                            <input type="number" id="phoneInput" class="form-input" placeholder="10 digits" required>
                        </div>
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label">Date of Birth</label>
                            <input type="date" class="form-input">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Full Address</label>
                        <input type="text" class="form-input" placeholder="Street name, Flat no.">
                    </div>

                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label">City</label>
                            <input type="text" class="form-input">
                        </div>
                        <div class="form-group" style="margin: 0;">
                            <label class="form-label">PIN Code *</label>
                            <input type="number" id="pinInput" class="form-input" placeholder="6 digits" required>
                        </div>
                    </div>

                    <div style="display: flex; gap: 16px; justify-content: flex-end;">
                        <button type="button" class="btn btn-outline" onclick="history.back()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Submit Application</button>
                    </div>
                </form>
            </div>
        </div>
    </main>
        `;
    },
    init: () => {

    const form = document.getElementById('applicantForm');
    const errorBox = document.getElementById('formErrors');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            errorBox.style.display = 'none';
            
            const fName = document.getElementById('fName').value.trim();
            const phone = document.getElementById('phoneInput').value.trim();
            const pin = document.getElementById('pinInput').value.trim();
            
            let errors = [];

            if(!fName) errors.push("First name is required.");
            if(phone.length !== 10) errors.push("Phone must be 10 digits.");
            if(pin.length !== 6) errors.push("PIN code must be 6 digits.");

            if(errors.length > 0) {
                errorBox.innerHTML = errors.map(err => `<div>• ${err}</div>`).join('');
                errorBox.style.display = 'block';
            } else {
                alert("Application Submitted Successfully!");
                window.location.hash = '#home';
            }
        });
    }

    }
};
