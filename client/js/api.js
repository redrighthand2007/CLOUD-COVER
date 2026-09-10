const API_URL = 'http://localhost:3000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('cloudcover_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...getAuthHeaders(),
                ...options.headers
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401) {
                // Handle unauthorized globally
                localStorage.removeItem('cloudcover_token');
                localStorage.removeItem('cloudcover_user');
                window.location.reload();
            }
            throw new Error(data.error || 'API Request Failed');
        }

        return data;
    } catch (err) {
        console.error('API Error:', err);
        throw err;
    }
}

export const api = {
    login: (username, password) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
    getCustomers: () => fetchAPI('/customers'),
    getPolicies: () => fetchAPI('/policies'),
    getInvestments: () => fetchAPI('/investments'),
    getDueQueue: () => fetchAPI('/due-queue'),
    markPaid: (policyId) => fetchAPI(`/policies/${policyId}/mark-paid`, { method: 'POST' }),
};
