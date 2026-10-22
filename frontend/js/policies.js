import { fetchAPI, isAdmin, esc, formatDate, formatMoney, todayISO } from './app.js';

let allPolicies = [];

export async function loadPolicies() {
    try {
        allPolicies = await fetchAPI('/policies');
        applyFilters();
    } catch(err) { console.error(err); }
}

const INACTIVE = ['Lapsed', 'Matured', 'Cancelled'];

// 'missed' | 'upcoming' (next 5 days) | 'none', same rules as the due queue
function dueState(p) {
    if (!p.next_due_date || p.current_payment_state === 'Paid' || INACTIVE.includes(p.policy_status)) return 'none';
    const today = todayISO();
    const in5 = new Date();
    in5.setDate(in5.getDate() + 5);
    const limit = `${in5.getFullYear()}-${String(in5.getMonth() + 1).padStart(2, '0')}-${String(in5.getDate()).padStart(2, '0')}`;
    if (p.next_due_date < today) return 'missed';
    if (p.next_due_date <= limit) return 'upcoming';
    return 'none';
}

// Search box + dropdown filters, all applied together
function applyFilters() {
    const term = (document.getElementById('search-policies').value || '').toLowerCase();
    const due = document.getElementById('filter-policy-due').value;
    const status = document.getElementById('filter-policy-status').value;
    const category = document.getElementById('filter-policy-category').value;
    const frequency = document.getElementById('filter-policy-frequency').value;

    const filtered = allPolicies.filter(p =>
        (!term || p.policy_name.toLowerCase().includes(term) ||
            p.customer_name.toLowerCase().includes(term) ||
            p.policy_number.toLowerCase().includes(term) ||
            (p.insurer_name && p.insurer_name.toLowerCase().includes(term))) &&
        (!due || dueState(p) === due) &&
        (!status || p.policy_status === status) &&
        (!category || p.category === category) &&
        (!frequency || p.premium_frequency === frequency)
    );
    renderPolicies(filtered);
    document.getElementById('policy-count').textContent = `${filtered.length} of ${allPolicies.length} policies`;
}

function renderPolicies(policies) {
    const tbody = document.querySelector('#policies-table tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    policies.forEach(p => {
        let actions = `<button class="btn btn-secondary btn-sm" onclick="editPolicy(${p.id})">Edit</button>
            <button class="btn btn-secondary btn-sm" onclick="showPayments(${p.id})">Payments</button>`;
        if(isAdmin()) {
            actions += ` <button class="btn btn-danger btn-sm" onclick="deletePolicy(${p.id})">Delete</button>`;
        }
        tbody.innerHTML += `<tr>
            <td>${esc(p.policy_name)}<br><small>${esc(p.policy_number)}</small></td>
            <td>${esc(p.customer_name)}</td>
            <td>${esc(p.policy_status)}</td>
            <td>${p.next_due_date ? formatDate(p.next_due_date) : 'N/A'}</td>
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
    const paymentsClose = document.querySelector('.close[data-modal="payments-modal"]');
    if(paymentsClose) {
        paymentsClose.onclick = () => { document.getElementById('payments-modal').style.display = 'none'; }
    }

    ['search-policies', 'filter-policy-due', 'filter-policy-status', 'filter-policy-category', 'filter-policy-frequency']
        .forEach(id => {
            const el = document.getElementById(id);
            if(el) el.addEventListener(id === 'search-policies' ? 'input' : 'change', applyFilters);
        });

    const addInsurerBtn = document.getElementById('add-insurer-btn');
    if(addInsurerBtn) {
        addInsurerBtn.onclick = async () => {
            const name = prompt('New insurance company name:');
            if(!name || !name.trim()) return;
            try {
                const insurer = await fetchAPI('/insurers', { method: 'POST', body: JSON.stringify({ name }) });
                await loadInsurersIntoSelect('policy-insurer');
                document.getElementById('policy-insurer').value = insurer.id;
            } catch(err) {
                alert(err.message);
            }
        };
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
            select.innerHTML += `<option value="${c.id}">${esc(c.full_name)} (${esc(c.pan)})</option>`;
        });
    } catch(err) { console.error('Error loading customers for select', err); }
}

async function loadInsurersIntoSelect(selectId) {
    try {
        const insurers = await fetchAPI('/insurers');
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Select Insurer</option>';
        insurers.forEach(i => {
            select.innerHTML += `<option value="${i.id}">${esc(i.name)}</option>`;
        });
    } catch(err) { console.error('Error loading insurers for select', err); }
}

window.showPayments = async (id) => {
    try {
        const policy = allPolicies.find(p => p.id === id) || await fetchAPI(`/policies/${id}`);
        const payments = await fetchAPI(`/policies/${id}/payments`);
        document.getElementById('payments-policy').textContent = policy
            ? `${policy.policy_name} (${policy.policy_number})${policy.customer_name ? ' - ' + policy.customer_name : ''}` : '';
        const tbody = document.querySelector('#payments-table tbody');
        tbody.innerHTML = payments.length ? '' : '<tr><td colspan="4">No payments recorded yet.</td></tr>';
        payments.forEach(pay => {
            tbody.innerHTML += `<tr>
                <td>${formatDate(pay.paid_on)}</td>
                <td>${formatDate(pay.due_date)}</td>
                <td>${formatMoney(pay.amount)}</td>
                <td>${esc(pay.recorded_by_name || '—')}</td>
            </tr>`;
        });
        document.getElementById('payments-modal').style.display = 'block';
    } catch(err) {
        alert('Error loading payments: ' + err.message);
    }
};

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
