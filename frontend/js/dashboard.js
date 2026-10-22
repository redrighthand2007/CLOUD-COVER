import { fetchAPI, esc, formatDate, formatMoney, isAdmin } from './app.js';
import { loadCustomers, setupCustomerEvents } from './customers.js';
import { loadPolicies, setupPolicyEvents } from './policies.js';
import { loadInvestments, setupInvestmentEvents } from './investments.js';
import { loadTeam, setupTeamEvents } from './team.js';
import { setupAccountEvents } from './account.js';
import { setupGlobalSearch } from './search.js';

// Setup navigation
const navLinks = document.querySelectorAll('.nav-links a');
const contentSections = document.querySelectorAll('.content-section');

export function showSection(targetId) {
    navLinks.forEach(l => l.classList.toggle('nav-active', l.getAttribute('data-target') === targetId));
    contentSections.forEach(sec => sec.classList.toggle('active', sec.id === targetId));
    loadSectionData(targetId);
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(e.target.getAttribute('data-target'));
    });
});

function loadSectionData(sectionId) {
    if (sectionId === 'dashboard-content') loadDashboard();
    if (sectionId === 'customers-content') loadCustomers();
    if (sectionId === 'policies-content') loadPolicies();
    if (sectionId === 'investments-content') loadInvestments();
    if (sectionId === 'team-content') loadTeam();
}

// Admin-only parts of the page (the server enforces this too)
if (isAdmin()) {
    document.querySelectorAll('.admin-only').forEach(el => { el.hidden = false; });
}

// Close any modal with its × button, a click on the dark background, or Escape
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });
});
document.querySelectorAll('.close[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => { document.getElementById(btn.dataset.modal).style.display = 'none'; });
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.querySelectorAll('.modal').forEach(m => { m.style.display = 'none'; });
});

// Setup Modal Events
setupCustomerEvents();
setupPolicyEvents();
setupInvestmentEvents();
setupTeamEvents();
setupAccountEvents();
setupGlobalSearch();

export async function loadDashboard() {
    try {
        const [summary, queue] = await Promise.all([fetchAPI('/dashboard'), fetchAPI('/due-queue')]);
        document.getElementById('dash-missed').textContent = summary.missed_dues;
        document.getElementById('dash-upcoming').textContent = summary.upcoming_dues;
        document.getElementById('dash-collected').textContent = formatMoney(summary.collected_this_month);
        document.getElementById('dash-total-customers').textContent = summary.total_customers;
        document.getElementById('dash-active-policies').textContent = summary.active_policies;
        document.getElementById('dash-investments').textContent = summary.active_investments;
        document.getElementById('dash-app-logins').textContent = summary.app_logins;
        renderDueQueue(queue);
    } catch (err) {
        console.error('Error loading dashboard', err);
        document.getElementById('due-queue-list').innerHTML = `<div class="queue-item" style="color:red"><p><b>Error:</b> ${esc(err.message)}</p></div>`;
    }
}

function renderDueQueue(queue) {
    const list = document.getElementById('due-queue-list');
    list.innerHTML = '';

    if (queue.missed.length === 0 && queue.upcoming.length === 0) {
        list.innerHTML = '<div class="queue-item"><p>No dues at the moment.</p></div>';
        return;
    }

    queue.missed.forEach(item => {
        list.innerHTML += `
            <div class="queue-item missed">
                <div class="queue-info">
                    <h4>${esc(item.policy_name)} - ${esc(item.customer_name)}</h4>
                    <p>Missed Due: ${formatDate(item.next_due_date)} · ${formatMoney(item.premium_amount)} · 📞 ${esc(item.primary_phone)}</p>
                </div>
                <button class="btn btn-primary btn-sm mark-paid-btn" data-id="${item.id}">Mark Paid</button>
            </div>
        `;
    });

    queue.upcoming.forEach(item => {
        list.innerHTML += `
            <div class="queue-item upcoming">
                <div class="queue-info">
                    <h4>${esc(item.policy_name)} - ${esc(item.customer_name)}</h4>
                    <p>Upcoming Due: ${formatDate(item.next_due_date)} · ${formatMoney(item.premium_amount)} · 📞 ${esc(item.primary_phone)}</p>
                </div>
                <button class="btn btn-primary btn-sm mark-paid-btn" data-id="${item.id}">Mark Paid</button>
            </div>
        `;
    });

    // Attach listeners
    document.querySelectorAll('.mark-paid-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.getAttribute('data-id');
            if (confirm('Mark this premium as paid?')) {
                e.target.disabled = true;
                try {
                    await fetchAPI(`/policies/${id}/mark-paid`, { method: 'POST' });
                    loadDashboard();
                } catch(err) {
                    alert(err.message);
                    e.target.disabled = false;
                }
            }
        });
    });
}

// Initial load
loadDashboard();
