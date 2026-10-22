import { fetchAPI, getUser, updateToken } from './app.js';

// "My account" for office users: change own password, log out other devices

export function setupAccountEvents() {
    const modal = document.getElementById('account-modal');
    const btn = document.getElementById('account-btn');
    if(!modal || !btn) return;

    btn.onclick = () => {
        const user = getUser();
        document.getElementById('account-name').textContent = `${user.name} (${user.username}, ${user.role})`;
        document.getElementById('account-password-form').reset();
        document.getElementById('account-msg').textContent = '';
        modal.style.display = 'block';
    };

    document.getElementById('account-password-form').onsubmit = async (e) => {
        e.preventDefault();
        const msg = document.getElementById('account-msg');
        try {
            const result = await fetchAPI('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    currentPassword: document.getElementById('account-current').value,
                    newPassword: document.getElementById('account-new').value
                })
            });
            updateToken(result.token);
            e.target.reset();
            msg.textContent = result.message;
        } catch(err) {
            msg.textContent = err.message;
        }
    };

    document.getElementById('account-logout-all').onclick = async () => {
        if(!confirm('Log out on all other PCs and phones?')) return;
        try {
            const result = await fetchAPI('/auth/logout-everywhere', { method: 'POST' });
            updateToken(result.token);
            alert(result.message);
        } catch(err) {
            alert(err.message);
        }
    };
}
