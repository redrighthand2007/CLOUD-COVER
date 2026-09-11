import { fetchAPI } from './app.js';

export async function loadCustomers() {
    try {
        const customers = await fetchAPI('/customers');
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
