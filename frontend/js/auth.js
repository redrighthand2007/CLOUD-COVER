import { fetchAPI, saveSession, clearSession, getUser } from './app.js';

// Which page each kind of user lands on after login
const HOME = {
    Admin: 'dashboard.html',
    Staff: 'dashboard.html',
    Customer: 'portal.html',
};

export const AuthModule = {
    getUser,

    isAuthenticated: () => getUser() !== null,

    homeFor: (user) => HOME[user && user.role] || 'login.html',

    // type: 'staff' (username) or 'customer' (phone)
    signIn: async (type, identifier, password) => {
        const body = type === 'staff'
            ? { type, username: identifier, password }
            : { type, phone: identifier, password };
        const { token, user } = await fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(body) });
        saveSession(token, user);
        return user;
    },

    signOut: () => {
        clearSession();
        window.location.href = 'login.html';
    },

    // Call at the top of a page: sends the visitor to login, or to their own home page,
    // if they are not allowed here. Returns the user when allowed.
    requireRole: (...roles) => {
        const user = getUser();
        if (!user) {
            window.location.replace('login.html');
            return null;
        }
        if (!roles.includes(user.role)) {
            window.location.replace(AuthModule.homeFor(user));
            return null;
        }
        return user;
    },
};

// Register the service worker so the app can be installed on phones and PCs
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.warn('Service worker not registered', err));
    });
}
