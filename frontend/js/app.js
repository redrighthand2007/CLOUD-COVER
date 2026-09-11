const API_URL = 'http://localhost:3000/api';

function getAuthHeaders() {
    const token = localStorage.getItem('cloudcover_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
}

export async function fetchAPI(endpoint, options = {}) {
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
                // Token invalid, force logout
                localStorage.removeItem('cloudcover_token');
                window.location.href = 'login.html';
            }
            throw new Error(data.error || 'API Request Failed');
        }

        return data;
    } catch (err) {
        console.error('API Error:', err);
        throw err;
    }
}

export function isAdmin() {
    const user = JSON.parse(localStorage.getItem('cloudcover_user') || '{}');
    return user.role === 'Admin';
}
