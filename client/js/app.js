import { api } from './api.js';

import { AuthModule } from './cognitoAuth.js';

const DOM = {
    authView: document.getElementById('auth-view'),
    mainView: document.getElementById('main-view'),
    cognitoLoginBtn: document.getElementById('cognito-login-btn'),
    loginError: document.getElementById('login-error'),
    logoutBtn: document.getElementById('logout-btn'),
    userInfo: document.getElementById('user-info'),
    navLinks: document.querySelectorAll('.nav-links a'),
    contentSections: document.querySelectorAll('.content-section')
};

// Check Auth state on load
function checkAuth() {
    if (AuthModule.isAuthenticated()) {
        const user = JSON.parse(localStorage.getItem('cloudcover_user') || '{"name": "Admin", "role": "Admin"}');
        showMainView(user);
    } else {
        showAuthView();
    }
}

function showAuthView() {
    DOM.mainView.classList.remove('active');
    DOM.authView.classList.add('active');
}

function showMainView(user) {
    DOM.authView.classList.remove('active');
    DOM.mainView.classList.add('active');
    DOM.userInfo.textContent = `${user.name} (${user.role})`;
    loadDashboard();
}

// Navigation
DOM.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        DOM.navLinks.forEach(l => l.classList.remove('nav-active'));
        e.target.classList.add('nav-active');
        
        const targetId = e.target.getAttribute('data-target');
        DOM.contentSections.forEach(sec => sec.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');
        
        loadSectionData(targetId);
    });
});

function loadSectionData(sectionId) {
    if (sectionId === 'dashboard-content') loadDashboard();
    if (sectionId === 'customers-content') loadCustomers();
    if (sectionId === 'policies-content') loadPolicies();
    if (sectionId === 'investments-content') loadInvestments();
}

// Login
DOM.cognitoLoginBtn.addEventListener('click', () => {
    AuthModule.signIn();
});

// Logout
DOM.logoutBtn.addEventListener('click', () => {
    AuthModule.signOut();
});

// Data Loaders
async function loadDashboard() {
    try {
        const customers = await api.getCustomers();
        document.getElementById('dash-total-customers').textContent = customers.length;
        
        const policies = await api.getPolicies();
        document.getElementById('dash-active-policies').textContent = policies.filter(p => p.policy_status === 'Active').length;
        
        const queue = await api.getDueQueue();
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
                <button class="btn btn-primary btn-sm" onclick="window.markPaid(${item.id})">Mark Paid</button>
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
                <button class="btn btn-primary btn-sm" onclick="window.markPaid(${item.id})">Mark Paid</button>
            </div>
        `;
    });
}

// Attach markPaid to window so inline onclick works
window.markPaid = async (policyId) => {
    if (confirm('Mark this premium as paid?')) {
        try {
            await api.markPaid(policyId);
            loadDashboard(); // reload queue
        } catch(err) {
            alert(err.message);
        }
    }
}

async function loadCustomers() {
    try {
        const customers = await api.getCustomers();
        const tbody = document.querySelector('#customers-table tbody');
        tbody.innerHTML = '';
        customers.forEach(c => {
            tbody.innerHTML += `<tr>
                <td>${c.full_name}</td>
                <td>${c.pan}</td>
                <td>${c.primary_phone}</td>
                <td><button class="btn btn-secondary btn-sm">View</button></td>
            </tr>`;
        });
    } catch(err) { console.error(err); }
}

async function loadPolicies() {
    try {
        const policies = await api.getPolicies();
        const tbody = document.querySelector('#policies-table tbody');
        tbody.innerHTML = '';
        policies.forEach(p => {
            tbody.innerHTML += `<tr>
                <td>${p.policy_name}</td>
                <td>${p.customer_name}</td>
                <td>${p.policy_status}</td>
                <td>${p.next_due_date ? p.next_due_date.split('T')[0] : 'N/A'}</td>
            </tr>`;
        });
    } catch(err) { console.error(err); }
}

async function loadInvestments() {
    try {
        const inv = await api.getInvestments();
        const tbody = document.querySelector('#investments-table tbody');
        tbody.innerHTML = '';
        inv.forEach(i => {
            tbody.innerHTML += `<tr>
                <td>${i.scheme_name}</td>
                <td>${i.customer_name}</td>
                <td>₹${i.investment_amount}</td>
            </tr>`;
        });
    } catch(err) { console.error(err); }
}

// Init
checkAuth();
