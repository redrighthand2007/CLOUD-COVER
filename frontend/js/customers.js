import { fetchAPI, isAdmin } from './app.js';

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
        let actions = `<button class="btn btn-secondary btn-sm" onclick="editCustomer(${c.id})">Edit</button>`;
        if(isAdmin()) {
            actions += ` <button class="btn btn-sm" style="background:#e74c3c;color:white;" onclick="deleteCustomer(${c.id})">Delete</button>`;
        }
        tbody.innerHTML += `<tr>
            <td>${c.full_name}</td>
            <td>${c.pan}</td>
            <td>${c.primary_phone}</td>
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
                c.primary_phone.includes(term)
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
                pan: document.getElementById('customer-pan').value,
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
}

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
