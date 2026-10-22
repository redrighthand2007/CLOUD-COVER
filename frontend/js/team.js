import { fetchAPI, esc, getUser } from './app.js';

// Office team management (Admin only)

let allUsers = [];

export async function loadTeam() {
    try {
        allUsers = await fetchAPI('/users');
        renderTeam(allUsers);
    } catch(err) { console.error(err); }
}

function renderTeam(users) {
    const tbody = document.querySelector('#team-table tbody');
    if(!tbody) return;
    const me = getUser();
    tbody.innerHTML = users.map(u => `<tr>
        <td>${esc(u.full_name)}${me && me.id === u.id ? ' <small>(you)</small>' : ''}</td>
        <td>${esc(u.username)}</td>
        <td>${esc(u.role)}</td>
        <td>${u.is_active ? '<span class="badge badge-success">Active</span>' : '<span class="badge">Off</span>'}</td>
        <td>${u.last_login_at ? esc(new Date(u.last_login_at).toLocaleString('en-IN')) : 'Never'}</td>
        <td><button class="btn btn-secondary btn-sm" onclick="editTeamMember(${u.id})">Edit</button></td>
    </tr>`).join('');
}

function generatePassword() {
    // Easy to read out: no 0/O or 1/l
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    return Array.from(crypto.getRandomValues(new Uint32Array(10)), n => chars[n % chars.length]).join('');
}

export function setupTeamEvents() {
    const modal = document.getElementById('user-modal');
    const form = document.getElementById('user-form');
    if(!modal || !form) return;

    document.getElementById('add-user-btn').onclick = () => {
        form.reset();
        document.getElementById('user-id').value = '';
        document.getElementById('user-modal-title').textContent = 'Add Team Member';
        document.getElementById('user-username').disabled = false;
        document.getElementById('user-active-group').style.display = 'none';
        document.getElementById('user-password').required = true;
        document.getElementById('user-password-label').textContent = 'Password * (at least 8 characters)';
        modal.style.display = 'block';
    };

    document.getElementById('user-generate').onclick = () => {
        document.getElementById('user-password').value = generatePassword();
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('user-id').value;
        const password = document.getElementById('user-password').value;
        const payload = {
            full_name: document.getElementById('user-name').value,
            username: document.getElementById('user-username').value,
            role: document.getElementById('user-role').value,
            is_active: document.getElementById('user-active').checked,
            ...(password ? { password } : {})
        };
        try {
            if(id) {
                await fetchAPI(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
            } else {
                await fetchAPI('/users', { method: 'POST', body: JSON.stringify(payload) });
            }
            modal.style.display = 'none';
            if(password) alert('Saved. Give the new password to this team member. They can change it from "My account".');
            loadTeam();
        } catch(err) {
            alert('Error saving team member: ' + err.message);
        }
    };
}

window.editTeamMember = (id) => {
    const u = allUsers.find(x => x.id === id);
    if(!u) return;
    document.getElementById('user-id').value = u.id;
    document.getElementById('user-name').value = u.full_name;
    document.getElementById('user-username').value = u.username;
    document.getElementById('user-username').disabled = true;
    document.getElementById('user-role').value = u.role;
    document.getElementById('user-active').checked = u.is_active;
    document.getElementById('user-active-group').style.display = 'block';
    document.getElementById('user-password').value = '';
    document.getElementById('user-password').required = false;
    document.getElementById('user-password-label').textContent = 'New password (leave empty to keep the current one)';
    document.getElementById('user-modal-title').textContent = 'Edit Team Member';
    document.getElementById('user-modal').style.display = 'block';
};
