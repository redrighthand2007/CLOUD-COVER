import { fetchAPI } from './app.js';

export async function loadPolicies() {
    try {
        const policies = await fetchAPI('/policies');
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
