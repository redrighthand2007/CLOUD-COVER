import { fetchAPI, isAdmin, esc, formatDate, formatMoney } from './app.js';

let allCustomers = [];

export async function loadCustomers() {
    try {
        allCustomers = await fetchAPI('/customers');
        renderCustomers(allCustomers);
    } catch(err) { console.error(err); }
}

function renderCustomers(customers) {
    const tbody = document.querySelector('#customers-table tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    customers.forEach(c => {
        let actions = `<button class="btn btn-primary btn-sm" onclick="viewCustomer(${c.id})">View</button>
            <button class="btn btn-secondary btn-sm" onclick="editCustomer(${c.id})">Edit</button>
            <button class="btn btn-secondary btn-sm" onclick="manageAppAccount(${c.id})">App login</button>`;
        if(isAdmin()) {
            actions += ` <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id})">Delete</button>`;
        }
        const appLogin = c.has_app_login
            ? '<span class="badge badge-success">On</span>'
            : '<span class="badge">Off</span>';
        tbody.innerHTML += `<tr>
            <td>${esc(c.full_name)}</td>
            <td>${esc(c.pan)}</td>
            <td>${esc(c.primary_phone)}</td>
            <td>${appLogin}</td>
            <td>${actions}</td>
        </tr>`;
    });
}

export function setupCustomerEvents() {
    const modal = document.getElementById('customer-modal');
    const btn = document.getElementById('add-customer-btn');
    const span = document.querySelector('.close[data-modal="customer-modal"]');
    const form = document.getElementById('customer-form');

    if(btn) {
        btn.onclick = () => {
            form.reset();
            document.getElementById('customer-id').value = '';
            document.getElementById('customer-modal-title').textContent = 'Add Customer';
            modal.style.display = 'block';
        }
    }

    if(span) {
        span.onclick = () => { modal.style.display = 'none'; }
    }

    const searchInput = document.getElementById('search-customers');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allCustomers.filter(c =>
                c.full_name.toLowerCase().includes(term) ||
                c.pan.toLowerCase().includes(term) ||
                c.primary_phone.includes(term.replace(/\D/g, '') || term)
            );
            renderCustomers(filtered);
        });
    }

    if(form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('customer-id').value;
            const payload = {
                full_name: document.getElementById('customer-name').value,
                pan: document.getElementById('customer-pan').value.toUpperCase(),
                primary_phone: document.getElementById('customer-phone').value,
                email: document.getElementById('customer-email').value,
                address: document.getElementById('customer-address').value,
                date_of_birth: document.getElementById('customer-dob').value || null
            };

            try {
                if(id) {
                    await fetchAPI(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
                } else {
                    await fetchAPI('/customers', { method: 'POST', body: JSON.stringify(payload) });
                }
                modal.style.display = 'none';
                loadCustomers();
            } catch(err) {
                alert('Error saving customer: ' + err.message);
            }
        };
    }

    setupAppAccountEvents();
}

// ---- Customer app login (portal access) ----

function setupAppAccountEvents() {
    const modal = document.getElementById('app-account-modal');
    const form = document.getElementById('app-account-form');
    if(!modal || !form) return;

    document.querySelector('.close[data-modal="app-account-modal"]').onclick = () => { modal.style.display = 'none'; };

    document.getElementById('app-account-generate').onclick = () => {
        // Easy to read out over the phone: no 0/O or 1/l
        const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
        const random = crypto.getRandomValues(new Uint32Array(10));
        document.getElementById('app-account-password').value = Array.from(random, n => chars[n % chars.length]).join('');
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('app-account-id').value;
        const payload = {
            phone: document.getElementById('app-account-phone').value,
            password: document.getElementById('app-account-password').value
        };
        try {
            await fetchAPI(`/customers/${id}/app-account`, { method: 'PUT', body: JSON.stringify(payload) });
            modal.style.display = 'none';
            alert('Login saved. The customer can now log in with this mobile number and password.');
            loadCustomers();
        } catch(err) {
            alert('Error saving login: ' + err.message);
        }
    };

    document.getElementById('app-account-disable').onclick = async () => {
        const id = document.getElementById('app-account-id').value;
        if(!confirm('Turn off this customer\'s app login? They will not be able to log in until you set a new password.')) return;
        try {
            await fetchAPI(`/customers/${id}/app-account`, { method: 'DELETE' });
            modal.style.display = 'none';
            loadCustomers();
        } catch(err) {
            alert('Error turning off login: ' + err.message);
        }
    };
}

window.manageAppAccount = async (id) => {
    try {
        const c = await fetchAPI(`/customers/${id}`);
        const account = c.app_account;
        document.getElementById('app-account-id').value = c.id;
        document.getElementById('app-account-customer').textContent = c.full_name;
        document.getElementById('app-account-phone').value = account ? account.phone : (c.primary_phone || '').replace(/\D/g, '');
        document.getElementById('app-account-password').value = '';

        let status = 'No app login yet.';
        if(account && account.is_active) {
            status = 'Login is ON. ' + (account.last_login_at
                ? `Last login: ${new Date(account.last_login_at).toLocaleString('en-IN')}.`
                : 'Not logged in yet.') + ' Saving sets a new password.';
        } else if(account) {
            status = 'Login is OFF. Save a new password to turn it back on.';
        }
        document.getElementById('app-account-status').textContent = status;
        document.getElementById('app-account-disable').style.display = (account && account.is_active && isAdmin()) ? 'inline-block' : 'none';
        document.getElementById('app-account-modal').style.display = 'block';
    } catch(err) {
        alert('Error loading customer: ' + err.message);
    }
};

// Full customer view: details, app login, policies and investments in one place
window.viewCustomer = async (id) => {
    try {
        const c = await fetchAPI(`/customers/${id}`);
        const account = c.app_account;
        const appLogin = account && account.is_active
            ? `<span class="badge badge-success">On</span> ${esc(account.phone)}${account.last_login_at ? ' · last login ' + esc(new Date(account.last_login_at).toLocaleDateString('en-IN')) : ' · never logged in'}`
            : '<span class="badge">Off</span>';

        const policies = c.policies.length ? `<div class="table-container"><table>
            <thead><tr><th>Policy</th><th>Insurer</th><th>Premium</th><th>Next due</th><th>Status</th><th></th></tr></thead>
            <tbody>${c.policies.map(p => `<tr>
                <td>${esc(p.policy_name)}<br><small>${esc(p.policy_number)} · ${esc(p.category)}</small></td>
                <td>${esc(p.insurer_name || '—')}</td>
                <td>${formatMoney(p.premium_amount)}<br><small>${esc(p.premium_frequency)}</small></td>
                <td>${p.next_due_date ? formatDate(p.next_due_date) : '—'}</td>
                <td>${esc(p.policy_status)}</td>
                <td><button class="btn btn-secondary btn-sm" onclick="closeCustomerView(); showPayments(${p.id})">Payments</button></td>
            </tr>`).join('')}</tbody></table></div>` : '<p class="modal-note">No policies yet.</p>';

        const investments = c.investments.length ? `<div class="table-container"><table>
            <thead><tr><th>Scheme</th><th>Folio</th><th>Amount</th><th>Started</th><th>Status</th></tr></thead>
            <tbody>${c.investments.map(v => `<tr>
                <td>${esc(v.scheme_name)}<br><small>${esc(v.investment_type)} · ${esc(v.amc_company || '')}</small></td>
                <td>${esc(v.folio_number)}</td>
                <td>${formatMoney(v.investment_amount)}<br><small>${esc(v.frequency || '')}</small></td>
                <td>${formatDate(v.start_date)}</td>
                <td>${esc(v.status)}</td>
            </tr>`).join('')}</tbody></table></div>` : '<p class="modal-note">No investments yet.</p>';

        document.getElementById('customer-view-name').textContent = c.full_name;
        document.getElementById('customer-view-body').innerHTML = `
            <dl class="info-grid">
                <dt>PAN</dt><dd>${esc(c.pan)}</dd>
                <dt>Mobile</dt><dd>${esc(c.primary_phone)}</dd>
                <dt>Email</dt><dd>${esc(c.email || '—')}</dd>
                <dt>Date of birth</dt><dd>${formatDate(c.date_of_birth)}</dd>
                <dt>Address</dt><dd>${esc(c.address || '—')}</dd>
                <dt>App login</dt><dd>${appLogin}</dd>
            </dl>
            <div class="modal-actions">
                <button class="btn btn-secondary btn-sm" onclick="closeCustomerView(); editCustomer(${c.id})">Edit details</button>
                <button class="btn btn-secondary btn-sm" onclick="closeCustomerView(); manageAppAccount(${c.id})">App login</button>
            </div>
            <h3>Insurance policies (${c.policies.length})</h3>
            ${policies}
            <h3>Investments (${c.investments.length})</h3>
            ${investments}`;
        document.getElementById('customer-view-modal').style.display = 'block';
    } catch(err) {
        alert('Error loading customer: ' + err.message);
    }
};

window.closeCustomerView = () => {
    document.getElementById('customer-view-modal').style.display = 'none';
};

window.editCustomer = async (id) => {
    try {
        const c = await fetchAPI(`/customers/${id}`);
        document.getElementById('customer-id').value = c.id;
        document.getElementById('customer-name').value = c.full_name;
        document.getElementById('customer-pan').value = c.pan;
        document.getElementById('customer-phone').value = c.primary_phone;
        document.getElementById('customer-email').value = c.email || '';
        document.getElementById('customer-address').value = c.address || '';
        document.getElementById('customer-dob').value = c.date_of_birth ? c.date_of_birth.split('T')[0] : '';

        document.getElementById('customer-modal-title').textContent = 'Edit Customer';
        document.getElementById('customer-modal').style.display = 'block';
    } catch(err) {
        alert('Error loading customer: ' + err.message);
    }
};

window.deleteCustomer = async (id) => {
    if(!confirm('Are you sure you want to delete this customer? This will also delete related policies and investments.')) return;
    try {
        await fetchAPI(`/customers/${id}`, { method: 'DELETE' });
        loadCustomers();
    } catch(err) {
        alert('Error deleting customer: ' + err.message);
    }
};
