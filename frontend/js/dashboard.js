import { fetchAPI } from './app.js';
import { loadCustomers } from './customers.js';
import { loadPolicies } from './policies.js';

// Setup navigation
const navLinks = document.querySelectorAll('.nav-links a');
const contentSections = document.querySelectorAll('.content-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('nav-active'));
        e.target.classList.add('nav-active');
        
        const targetId = e.target.getAttribute('data-target');
        contentSections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        
        loadSectionData(targetId);
    });
});

function loadSectionData(sectionId) {
    if (sectionId === 'dashboard-content') loadDashboard();
    if (sectionId === 'customers-content') loadCustomers();
    if (sectionId === 'policies-content') loadPolicies();
    // Investments left as a stub for V1
}

export async function loadDashboard() {
    try {
        const customers = await fetchAPI('/customers');
        document.getElementById('dash-total-customers').textContent = customers.length;
        
        const policies = await fetchAPI('/policies');
        document.getElementById('dash-active-policies').textContent = policies.filter(p => p.policy_status === 'Active').length;
        
        const queue = await fetchAPI('/due-queue');
        renderDueQueue(queue);
    } catch (err) {
        console.error('Error loading dashboard', err);
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
                    <h4>${item.policy_name} - ${item.customer_name}</h4>
                    <p>Missed Due: ${item.next_due_date.split('T')[0]}</p>
                </div>
                <button class="btn btn-primary btn-sm mark-paid-btn" data-id="${item.id}">Mark Paid</button>
            </div>
        `;
    });

    queue.upcoming.forEach(item => {
        list.innerHTML += `
            <div class="queue-item upcoming">
                <div class="queue-info">
                    <h4>${item.policy_name} - ${item.customer_name}</h4>
                    <p>Upcoming Due: ${item.next_due_date.split('T')[0]}</p>
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
                try {
                    await fetchAPI(`/policies/${id}/mark-paid`, { method: 'POST' });
                    loadDashboard();
                } catch(err) { alert(err.message); }
            }
        });
    });
}

// Initial load
loadDashboard();
