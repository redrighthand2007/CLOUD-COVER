document.addEventListener('DOMContentLoaded', () => {
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
                window.location.href = 'index.html';
            }
        });
    }
});