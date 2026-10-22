// Same server serves the pages and the API, so a relative URL works locally and when hosted
const API_URL = '/api';

const TOKEN_KEY = 'cloudcover_token';
const USER_KEY = 'cloudcover_user';

function getAuthHeaders() {
    const token = localStorage.getItem(TOKEN_KEY);
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
            if (response.status === 401 && !endpoint.startsWith('/auth/login')) {
                // Session expired or invalid, force logout
                clearSession();
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

export function saveSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// After a password change or "log out everywhere" the server sends this device a new token
export function updateToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
}

// Today's date on this device as 'YYYY-MM-DD'
export function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function getUser() {
    if (!localStorage.getItem(TOKEN_KEY)) return null;
    try {
        return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
        return null;
    }
}

export function isAdmin() {
    const user = getUser();
    return !!user && user.role === 'Admin';
}

// Escape text before putting it into innerHTML, so names or notes can never inject HTML/scripts
export function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

// 'YYYY-MM-DD' -> '25 Oct 2026'
export function formatDate(value) {
    if (!value) return '—';
    const [y, m, d] = String(value).split('T')[0].split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatMoney(value) {
    if (value === null || value === undefined || value === '') return '—';
    return '₹' + Number(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });
}
