import { fetchAPI, isAdmin } from './app.js';

let allInvestments = [];

export async function loadInvestments() {
    try {
        allInvestments = await fetchAPI('/investments');
        renderInvestments(allInvestments);
    } catch(err) { console.error(err); }
}

function renderInvestments(investments) {
    const tbody = document.querySelector('#investments-table tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    investments.forEach(inv => {
        let actions = `<button class="btn btn-secondary btn-sm" onclick="editInvestment(${inv.id})">Edit</button>`;
        if(isAdmin()) {
            actions += ` <button class="btn btn-sm" style="background:#e74c3c;color:white;" onclick="deleteInvestment(${inv.id})">Delete</button>`;
        }
        tbody.innerHTML += `<tr>
            <td>${inv.scheme_name}</td>
            <td>${inv.customer_name}</td>
            <td>${inv.investment_amount}</td>
            <td>${actions}</td>
        </tr>`;
    });
}

export function setupInvestmentEvents() {
    const modal = document.getElementById('investment-modal');
    const btn = document.getElementById('add-investment-btn');
    const span = document.querySelector('.close[data-modal="investment-modal"]');
    const form = document.getElementById('investment-form');

    if(btn) {
        btn.onclick = async () => {
            form.reset();
            document.getElementById('investment-id').value = '';
            document.getElementById('investment-modal-title').textContent = 'Add Investment';
            await loadCustomersIntoSelect('investment-customer');
            modal.style.display = 'block';
        }
    }

    if(span) {
        span.onclick = () => { modal.style.display = 'none'; }
    }

    const searchInput = document.getElementById('search-investments');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allInvestments.filter(inv => 
                inv.scheme_name.toLowerCase().includes(term) || 
                inv.customer_name.toLowerCase().includes(term) ||
                (inv.amc_company && inv.amc_company.toLowerCase().includes(term)) ||
                (inv.folio_number && inv.folio_number.toLowerCase().includes(term))
            );
            renderInvestments(filtered);
        });
    }

    if(form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const id = document.getElementById('investment-id').value;
            const payload = {
                customer_id: document.getElementById('investment-customer').value,
                investment_type: document.getElementById('investment-type').value,
                amc_company: document.getElementById('investment-amc').value,
                scheme_name: document.getElementById('investment-scheme').value,
                folio_number: document.getElementById('investment-folio').value,
                investment_amount: document.getElementById('investment-amount').value,
                start_date: document.getElementById('investment-start').value,
                frequency: document.getElementById('investment-frequency').value,
                status: document.getElementById('investment-status').value,
                notes: document.getElementById('investment-notes').value
            };

            try {
                if(id) {
                    await fetchAPI(`/investments/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
                } else {
                    await fetchAPI('/investments', { method: 'POST', body: JSON.stringify(payload) });
                }
                modal.style.display = 'none';
                loadInvestments();
            } catch(err) {
                alert('Error saving investment: ' + err.message);
            }
        };
    }
}

async function loadCustomersIntoSelect(selectId) {
    try {
        const customers = await fetchAPI('/customers');
        const select = document.getElementById(selectId);
        if(!select) return;
        select.innerHTML = '<option value="">Select Customer</option>';
        customers.forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.full_name} (${c.pan})</option>`;
        });
    } catch(err) { console.error('Error loading customers for select', err); }
}

window.editInvestment = async (id) => {
    try {
        const inv = await fetchAPI(`/investments/${id}`);
        document.getElementById('investment-id').value = inv.id;
        
        await loadCustomersIntoSelect('investment-customer');

        document.getElementById('investment-customer').value = inv.customer_id;
        document.getElementById('investment-type').value = inv.investment_type;
        document.getElementById('investment-amc').value = inv.amc_company || '';
        document.getElementById('investment-scheme').value = inv.scheme_name;
        document.getElementById('investment-folio').value = inv.folio_number;
        document.getElementById('investment-amount').value = inv.investment_amount;
        document.getElementById('investment-start').value = inv.start_date ? inv.start_date.split('T')[0] : '';
        document.getElementById('investment-frequency').value = inv.frequency || '';
        document.getElementById('investment-status').value = inv.status || 'Active';
        document.getElementById('investment-notes').value = inv.notes || '';
        
        document.getElementById('investment-modal-title').textContent = 'Edit Investment';
        document.getElementById('investment-modal').style.display = 'block';
    } catch(err) {
        alert('Error loading investment: ' + err.message);
    }
};

window.deleteInvestment = async (id) => {
    if(!confirm('Are you sure you want to delete this investment?')) return;
    try {
        await fetchAPI(`/investments/${id}`, { method: 'DELETE' });
        loadInvestments();
    } catch(err) {
        alert('Error deleting investment: ' + err.message);
    }
};
