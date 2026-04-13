export class UserManagementView {
    constructor() {
        this.container = document.getElementById('users-table-container');
    }

    render(users, onRoleChange) {
        if (!this.container) return;

        this.container.innerHTML = 
        `
            <h2>Gestión de Usuarios y Roles</h2>
            <div class="table-responsive">
                <table class="users-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Rol Actual</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id = "users-table-body">

                    </tbody>
                </table>
            </div>

            <div id="user-status-message" class="status"></div>
        `
        ;

        this.updateTable(users, onRoleChange);
    }

    updateTable(users, onRoleChange) {
        const table = document.getElementById('users-table-body');
        if (!table) return;

        table.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            
            const isGestor = user.rol === 'GESTOR';
            const actionText = isGestor ? 'Degradar a Público' : 'Promover a Gestor';
            const newRole = isGestor ? 'PUBLICO' : 'GESTOR';
            const buttonClass = isGestor ? 'btn-degrade' : 'btn-promote';

            tr.innerHTML = 
            `
                <td>${user.email}</td>
                <td><span class= "badge ${user.rol}">${user.rol}</span></td>
                <td>
                    <button class="btn-action ${buttonClass}" data-email="${user.email}">
                        ${actionText}
                    </button>
                </td>
            `
            ;

            const button = tr.querySelector('.btn-action');
            button.addEventListener('click', () => {
                onRoleChange(user.email, newRole);
            });

            table.appendChild(tr);
        });
    }

    setStatus(message, isError = false) {
        const statusDiv = document.getElementById('user-status-message');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = `status ${isError ? 'error' : 'success'}`;
        }
    }
}