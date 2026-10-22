import { fetchAPI, esc, formatDate } from './app.js';

// Global search box at the top of the office pages

export function setupGlobalSearch() {
    const input = document.getElementById('global-search');
    const panel = document.getElementById('global-search-results');
    if(!input || !panel) return;

    let timer = null;
    let lastQuery = '';

    input.addEventListener('input', () => {
        clearTimeout(timer);
        const q = input.value.trim();
        if(q.length < 2) { panel.hidden = true; return; }
        // Wait until typing pauses, so we don't call the server on every key
        timer = setTimeout(() => runSearch(q), 250);
    });

    input.addEventListener('keydown', (e) => {
        if(e.key === 'Escape') { panel.hidden = true; input.blur(); }
    });

    document.addEventListener('click', (e) => {
        if(!panel.contains(e.target) && e.target !== input) panel.hidden = true;
    });

    async function runSearch(q) {
        lastQuery = q;
        try {
            const results = await fetchAPI(`/search?q=${encodeURIComponent(q)}`);
            if(q !== lastQuery) return; // a newer search is already running
            render(results);
        } catch(err) {
            panel.innerHTML = `<p class="search-empty">${esc(err.message)}</p>`;
            panel.hidden = false;
        }
    }

    function render({ customers, policies, investments }) {
        const groups = [];
        if(customers.length) groups.push(`<h4>Customers</h4>` + customers.map(c => `
            <button type="button" class="search-hit" data-action="customer" data-id="${c.id}">
                <strong>${esc(c.full_name)}</strong><span>${esc(c.pan)} · ${esc(c.primary_phone)}</span>
            </button>`).join(''));
        if(policies.length) groups.push(`<h4>Policies</h4>` + policies.map(p => `
            <button type="button" class="search-hit" data-action="customer" data-id="${p.customer_id}">
                <strong>${esc(p.policy_name)} · ${esc(p.policy_number)}</strong>
                <span>${esc(p.customer_name)} · ${esc(p.insurer_name || '')} · ${esc(p.policy_status)}${p.next_due_date ? ' · due ' + formatDate(p.next_due_date) : ''}</span>
            </button>`).join(''));
        if(investments.length) groups.push(`<h4>Investments</h4>` + investments.map(v => `
            <button type="button" class="search-hit" data-action="customer" data-id="${v.customer_id}">
                <strong>${esc(v.scheme_name)} · ${esc(v.folio_number)}</strong>
                <span>${esc(v.customer_name)} · ${esc(v.amc_company || '')}</span>
            </button>`).join(''));

        panel.innerHTML = groups.length ? groups.join('') : '<p class="search-empty">No matches.</p>';
        panel.hidden = false;

        // Every result opens the customer's full view (their policies and investments)
        panel.querySelectorAll('.search-hit').forEach(btn => {
            btn.addEventListener('click', () => {
                panel.hidden = true;
                window.viewCustomer(Number(btn.dataset.id));
            });
        });
    }
}
