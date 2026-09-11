import { fetchAPI, isAdmin } from './app.js';

let allPolicies = [];

export async function loadPolicies() {
    try {
        allPolicies = await fetchAPI('/policies');
        renderPolicies(allPolicies);
    } catch(err) { console.error(err); }
}

function renderPolicies(policies) {
    const tbody = document.querySelector('#policies-table tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    policies.forEach(p => {
        let actions = `<button class="btn btn-secondary btn-sm" onclick="editPolicy(${p.id})">Edit</button>`;
        if(isAdmin()) {
            actions += ` <button class="btn btn-sm" style="background:#e74c3c;color:white;" onclick="deletePolicy(${p.id})">Delete</button>`;
        }
        tbody.innerHTML += `<tr>
            <td>${p.policy_name}</td>
            <td>${p.customer_name}</td>
            <td>${p.policy_status}</td>
            <td>${p.next_due_date ? p.next_due_date.split('T')[0] : 'N/A'}</td>
            <td>${actions}</td>
        </tr>`;
    });
}

export function setupPolicyEvents() {
    const modal = document.getElementById('policy-modal');
    const btn = document.getElementById('add-policy-btn');
    const span = document.querySelector('.close[data-modal="policy-modal"]');
    const form = document.getElementById('policy-form');

    if(btn) {
        btn.onclick = async () => {
            form.reset();
            document.getElementById('policy-id').value = '';
            document.getElementById('policy-modal-title').textContent = 'Add Policy';
            await loadCustomersIntoSelect('policy-customer');
            await loadInsurersIntoSelect('policy-insurer');
            modal.style.display = 'block';
        }
    }

    if(span) {
        span.onclick = () => { modal.style.display = 'none'; }
    }

    const searchInput = document.getElementById('search-policies');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allPolicies.filter(p => 
                p.policy_name.toLowerCase().includes(term) || 
                p.customer_name.toLowerCase().includes(term) || 
                p.policy_number.toLowerCase().includes(term) ||
                (p.insurer_name && p.insurer_name.toLowerCase().includes(term))
            );
            renderPolicies(filtered);
        });
    }

    if(form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('policy-id').value;
            const payload = {
                customer_id: document.getElementById('policy-customer').value,
                policyholder_pan: document.getElementById('policy-pan').value,
                category: document.getElementById('policy-category').value,
                insurer_id: document.getElementById('policy-insurer').value,
                policy_name: document.getElementById('policy-name').value,
                policy_number: document.getElementById('policy-number').value,
                premium_amount: document.getElementById('policy-premium').value,
                total_tenure_years: document.getElementById('policy-tenure').value || null,
                policy_start_date: document.getElementById('policy-start').value,
                policy_end_date: document.getElementById('policy-end').value || null,
                premium_start_date: document.getElementById('policy-prem-start').value,
                premium_end_date: document.getElementById('policy-prem-end').value || null,
                premium_frequency: document.getElementById('policy-frequency').value,
                policy_status: document.getElementById('policy-status').value,
                notes: document.getElementById('policy-notes').value
            };

            try {
                if(id) {
                    await fetchAPI(`/policies/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
                } else {
                    await fetchAPI('/policies', { method: 'POST', body: JSON.stringify(payload) });
                }
                modal.style.display = 'none';
                loadPolicies();
                import('./dashboard.js').then(module => module.loadDashboard()); // update due queue
            } catch(err) {
                alert('Error saving policy: ' + err.message);
            }
        };
    }
}

async function loadCustomersIntoSelect(selectId) {
    try {
        const customers = await fetchAPI('/customers');
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select Customer</option>';
        customers.forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.full_name} (${c.pan})</option>`;
        });
    } catch(err) { console.error('Error loading customers for select', err); }
}

async function loadInsurersIntoSelect(selectId) {
    // Hardcoding for MVP as per DB seed, since no API route exists yet
    const insurers = [
        { id: 1, name: 'LIC of India' },
        { id: 2, name: 'HDFC Life' },
        { id: 3, name: 'Star Health' },
        { id: 4, name: 'ICICI Lombard' },
        { id: 5, name: 'SBI Life' }
    ];
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Select Insurer</option>';
    insurers.forEach(i => {
        select.innerHTML += `<option value="${i.id}">${i.name}</option>`;
    });
}

window.editPolicy = async (id) => {
    try {
        const p = await fetchAPI(`/policies/${id}`);
        document.getElementById('policy-id').value = p.id;
        
        await loadCustomersIntoSelect('policy-customer');
        await loadInsurersIntoSelect('policy-insurer');

        document.getElementById('policy-customer').value = p.customer_id;
        document.getElementById('policy-pan').value = p.policyholder_pan || '';
        document.getElementById('policy-category').value = p.category;
        document.getElementById('policy-insurer').value = p.insurer_id;
        document.getElementById('policy-name').value = p.policy_name;
        document.getElementById('policy-number').value = p.policy_number;
        document.getElementById('policy-premium').value = p.premium_amount;
        document.getElementById('policy-tenure').value = p.total_tenure_years || '';
        document.getElementById('policy-start').value = p.policy_start_date ? p.policy_start_date.split('T')[0] : '';
        document.getElementById('policy-end').value = p.policy_end_date ? p.policy_end_date.split('T')[0] : '';
        document.getElementById('policy-prem-start').value = p.premium_start_date ? p.premium_start_date.split('T')[0] : '';
        document.getElementById('policy-prem-end').value = p.premium_end_date ? p.premium_end_date.split('T')[0] : '';
        document.getElementById('policy-frequency').value = p.premium_frequency;
        document.getElementById('policy-status').value = p.policy_status;
        document.getElementById('policy-notes').value = p.notes || '';
        
        document.getElementById('policy-modal-title').textContent = 'Edit Policy';
        document.getElementById('policy-modal').style.display = 'block';
    } catch(err) {
        alert('Error loading policy: ' + err.message);
    }
};

window.deletePolicy = async (id) => {
    if(!confirm('Are you sure you want to delete this policy?')) return;
    try {
        await fetchAPI(`/policies/${id}`, { method: 'DELETE' });
        loadPolicies();
        import('./dashboard.js').then(module => module.loadDashboard()); // update due queue
    } catch(err) {
        alert('Error deleting policy: ' + err.message);
    }
};
