export class UserManagementView {
    constructor() {
        this.container = document.getElementById('users-table-container');
    }

    render(users, onRoleChange, onDeleteUser) {
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

        this.updateTable(users, onRoleChange, onDeleteUser);
    }

    updateTable(users, onRoleChange, onDeleteUser) {
        const table = document.getElementById('users-table-body');
        if (!table) return;

        table.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            
            const isGestor = user.role === 'GESTOR';
            const isInactivo = user.role === 'INACTIVO';

            const actionText = isGestor ? 'Degradar a Público' : 'Promover a Gestor';
            const newRole = isGestor ? 'PUBLICO' : 'GESTOR';
            const buttonClass = isGestor ? 'btn-degrade' : 'btn-promote';

            const toggleText = isInactivo ? 'Activar Usuario' : 'Desactivar Usuario';
            const toggleRole = isInactivo ? 'PUBLICO' : 'INACTIVO';
            const toggleClass = isInactivo ? 'btn-promote' : 'btn-degrade';

            tr.innerHTML = 
            `
                <td>${user.email}</td>
                <td><span class= "badge ${user.role}">${user.role}</span></td>
                <td>
                    <button class="btn-action ${buttonClass} btn-role">
                        ${actionText}
                    </button>
                    <button class="btn-action ${toggleClass} btn-toggle">
                        ${toggleText}
                    </button>
                    <button class="btn-action btn-delete">
                        Eliminar Usuario
                    </button>
                </td>
            `
            ;

            tr.querySelector('.btn-role').addEventListener('click', () => {
                onRoleChange(user.id, newRole);
            });

            tr.querySelector('.btn-toggle').addEventListener('click', () => {
                onRoleChange(user.id, toggleRole);
            });

            tr.querySelector('.btn-delete').addEventListener('click', () => {
                if (confirm(`¿Seguro que deseas eliminar al usuario ${user.email}?`)) {
                    onDeleteUser(user.id);
                }
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