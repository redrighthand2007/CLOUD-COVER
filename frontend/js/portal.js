import { fetchAPI, esc, formatDate, formatMoney, updateToken } from './app.js';

// Customer portal: shows only the logged-in customer's own data (read-only)

const empty = (text) => `<p class="item-empty">${esc(text)}</p>`;

function statusBadge(status) {
    const cls = { Active: 'badge-success', Lapsed: 'badge-danger', Cancelled: 'badge-danger', Matured: 'badge' }[status] || 'badge-warning';
    return `<span class="badge ${cls}">${esc(status)}</span>`;
}

function renderDues(dues) {
    document.getElementById('dues-list').innerHTML = dues.length ? dues.map(d => `
        <div class="item ${d.overdue ? 'item-overdue' : ''}">
            <div class="item-row">
                <strong>${esc(d.policy_name)}</strong>
                <span class="item-amount">${formatMoney(d.amount)}</span>
            </div>
            <div class="item-row item-sub">
                <span>${esc(d.insurer_name || '')} · ${esc(d.policy_number)}</span>
                ${d.overdue
                    ? `<span class="badge badge-danger">Overdue since ${formatDate(d.due_date)}</span>`
                    : `<span class="badge badge-warning">Due ${formatDate(d.due_date)}</span>`}
            </div>
        </div>`).join('') : empty('No premiums due. You are all caught up!');
}

function renderPayments(payments) {
    document.getElementById('payments-list').innerHTML = payments.length ? payments.map(p => `
        <div class="item">
            <div class="item-row">
                <span>${esc(p.policy_name)}</span>
                <span class="item-amount">${formatMoney(p.amount)}</span>
            </div>
            <div class="item-row item-sub"><span>Paid on ${formatDate(p.paid_on)}</span></div>
        </div>`).join('') : empty('No payments recorded yet.');
}

function renderPolicies(policies) {
    document.getElementById('policies-list').innerHTML = policies.length ? policies.map(p => `
        <details class="item">
            <summary>
                <div class="item-row">
                    <strong>${esc(p.policy_name)}</strong>
                    ${statusBadge(p.policy_status)}
                </div>
                <div class="item-row item-sub">
                    <span>${esc(p.category)} · ${esc(p.insurer_name || '')}</span>
                    <span class="item-amount">${formatMoney(p.premium_amount)}</span>
                </div>
            </summary>
            <dl class="details-grid">
                <dt>Policy number</dt><dd>${esc(p.policy_number)}</dd>
                <dt>Premium</dt><dd>${formatMoney(p.premium_amount)} · ${esc(p.premium_frequency)}</dd>
                <dt>Next due</dt><dd>${p.next_due_date ? formatDate(p.next_due_date) : 'Nothing due'}</dd>
                <dt>Policy start</dt><dd>${formatDate(p.policy_start_date)}</dd>
                <dt>Policy end</dt><dd>${formatDate(p.policy_end_date)}</dd>
                <dt>Last premium</dt><dd>${formatDate(p.premium_end_date)}</dd>
            </dl>
        </details>`).join('') : empty('No policies yet.');
}

function renderInvestments(investments) {
    document.getElementById('investments-list').innerHTML = investments.length ? investments.map(i => `
        <details class="item">
            <summary>
                <div class="item-row">
                    <strong>${esc(i.scheme_name)}</strong>
                    ${statusBadge(i.status)}
                </div>
                <div class="item-row item-sub">
                    <span>${esc(i.investment_type)} · ${esc(i.amc_company || '')}</span>
                    <span class="item-amount">${formatMoney(i.investment_amount)}</span>
                </div>
            </summary>
            <dl class="details-grid">
                <dt>Folio / account</dt><dd>${esc(i.folio_number)}</dd>
                <dt>Type</dt><dd>${esc(i.frequency || '—')}</dd>
                <dt>Started</dt><dd>${formatDate(i.start_date)}</dd>
            </dl>
        </details>`).join('') : empty('No investments yet.');
}

function renderProfile(profile) {
    document.getElementById('portal-name').textContent = profile.full_name;
    document.getElementById('profile-details').innerHTML = `
        <dl class="details-grid">
            <dt>Name</dt><dd>${esc(profile.full_name)}</dd>
            <dt>Mobile</dt><dd>${esc(profile.primary_phone)}</dd>
            <dt>Email</dt><dd>${esc(profile.email || '—')}</dd>
            <dt>PAN</dt><dd>${esc(profile.pan)}</dd>
            <dt>Date of birth</dt><dd>${formatDate(profile.date_of_birth)}</dd>
            <dt>Address</dt><dd>${esc(profile.address || '—')}</dd>
        </dl>`;
}

async function loadOverview() {
    const loading = document.getElementById('portal-loading');
    try {
        const data = await fetchAPI('/portal/overview');
        renderProfile(data.profile);
        renderDues(data.dues);
        renderPayments(data.payments);
        renderPolicies(data.policies);
        renderInvestments(data.investments);
        document.getElementById('sum-policies').textContent = data.policies.filter(p => p.policy_status === 'Active').length;
        document.getElementById('sum-investments').textContent = data.investments.length;
    } catch (err) {
        document.getElementById('portal-error').textContent = 'Could not load your details. Please check your internet and try again.';
    } finally {
        loading.style.display = 'none';
    }
}

// Bottom tab bar
document.querySelectorAll('.portal-nav button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.portal-nav button').forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.portal-section').forEach(s => s.classList.toggle('active', s.id === btn.dataset.tab));
        window.scrollTo(0, 0);
    });
});

document.getElementById('password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('pw-msg');
    const currentPassword = document.getElementById('pw-current').value;
    const newPassword = document.getElementById('pw-new').value;
    if (newPassword.length < 8) {
        msg.textContent = 'New password must be at least 8 characters.';
        return;
    }
    try {
        const result = await fetchAPI('/auth/change-password', { method: 'POST', body: JSON.stringify({ currentPassword, newPassword }) });
        updateToken(result.token);
        e.target.reset();
        msg.textContent = 'Password changed. You have been logged out on your other devices.';
    } catch (err) {
        msg.textContent = err.message;
    }
});

document.getElementById('logout-all-btn').addEventListener('click', async () => {
    if (!confirm('Log out on all your other phones and computers?')) return;
    try {
        const result = await fetchAPI('/auth/logout-everywhere', { method: 'POST' });
        updateToken(result.token);
        alert('Done. You are still logged in on this phone.');
    } catch (err) {
        alert(err.message);
    }
});

loadOverview();
