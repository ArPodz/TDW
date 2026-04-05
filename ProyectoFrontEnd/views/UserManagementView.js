export class UserManagementView {
    constructor() {
        this.container = document.getElementById('admin-users-container');
    }

    // 1. Método para renderizar la tabla inicial
    render(users, onRoleChange) {
        if (!this.container) return;

        this.container.innerHTML = `
            <h2>Gestión de Usuarios y Roles</h2>
            <div class="table-responsive">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Rol Actual</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="users-table-body">
                        <!-- Aquí se insertarán las filas -->
                    </tbody>
                </table>
            </div>
            <div id="user-status-message" class="status"></div>
        `;

        this.updateTable(users, onRoleChange);
    }

    // 2. Método para actualizar solo las filas (sin borrar toda la tabla)
    updateTable(users, onRoleChange) {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        tbody.innerHTML = ''; // Limpiamos las filas anteriores

        users.forEach(user => {
            const tr = document.createElement('tr');
            
            // Lógica para decidir qué botón mostrar
            const isGestor = user.rol === 'GESTOR';
            const actionText = isGestor ? 'Degradar a Público' : 'Promover a Gestor';
            const newRole = isGestor ? 'PUBLICO' : 'GESTOR';
            const buttonClass = isGestor ? 'btn-degrade' : 'btn-promote';

            tr.innerHTML = `
                <td>${user.email}</td>
                <td><span class="badge ${user.rol.toLowerCase()}">${user.rol}</span></td>
                <td>
                    <button class="btn-action ${buttonClass}" data-email="${user.email}">
                        ${actionText}
                    </button>
                </td>
            `;

            // Asignar el evento al botón
            const btn = tr.querySelector('.btn-action');
            btn.onclick = () => onRoleChange(user.email, newRole);

            tbody.appendChild(tr);
        });
    }

    // 3. Método para mostrar errores o mensajes de éxito
    setStatus(message, isError = false) {
        const statusDiv = document.getElementById('user-status-message');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = `status ${isError ? 'error' : 'success'}`;
        }
    }
}