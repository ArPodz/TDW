export class OperationsView {
    constructor(operationController, domElementId) {
        this.controller = operationController;
        // El contenedor principal en tu HTML donde se renderizará esta vista
        this.container = document.getElementById(domElementId); 
    }

    // Método principal para renderizar la tabla
    render() {
        const operations = this.controller.operations.getOperations();
        
        let html = `
            <div class="gestor-panel">
                <h2>Gestión de Operaciones</h2>
                <button id="btn-nueva-operacion">Nueva Operación</button>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Hora Estimada</th>
                            <th>Operador</th>
                            <th>Punto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        operations.forEach(op => {
            html += `
                <tr>
                    <td>${op.code}</td>
                    <td>${op.type}</td>
                    <td>${op.state}</td>
                    <td>${op.estimatedTime || 'N/A'}</td>
                    <td>${op.operatorId}</td>
                    <td>${op.pointId}</td>
                    <td>
                        <button class="btn-edit" data-code="${op.code}">Editar / Reasignar</button>
                        <button class="btn-delete" data-code="${op.code}">Eliminar</button>
                    </td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        this.container.innerHTML = html;

        // Una vez inyectado el HTML, asignamos los eventos
        this.bindEvents();
    }

    bindEvents() {
        // Evento para Eliminar
        const deleteButtons = this.container.querySelectorAll('.btn-delete');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const code = e.target.getAttribute('data-code');
                if (confirm(`¿Seguro que deseas eliminar la operación ${code}?`)) {
                    try {
                        await this.controller.deleteOperation(code);
                        alert("Operación eliminada");
                        this.render(); // Recargar la vista
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });

        // Evento para Editar (Llamaría a un formulario o Modal)
        const editButtons = this.container.querySelectorAll('.btn-edit');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.getAttribute('data-code');
                this.renderEditForm(code);
            });
        });

        // Evento para Crear Nueva
        document.getElementById('btn-nueva-operacion').addEventListener('click', () => {
            // Lógica para mostrar formulario de creación
            console.log("Mostrar formulario de creación");
        });
    }

    // Renderiza un formulario simple para editar lo que pide el ejercicio
    renderEditForm(code) {
        const operation = this.controller.operations.findOperationByCode(code);
        if (!operation) return;

        const formHtml = `
            <div class="modal">
                <h3>Editando Operación: ${operation.code}</h3>
                <label>Estado:
                    <select id="edit-state">
                        <option value="PROGRAMADO" ${operation.state === 'PROGRAMADO' ? 'selected' : ''}>Programado</option>
                        <option value="EN_RUTA" ${operation.state === 'EN_RUTA' ? 'selected' : ''}>En Ruta</option>
                        <option value="CANCELADO" ${operation.state === 'CANCELADO' ? 'selected' : ''}>Cancelado</option>
                        <!-- Añade el resto de estados válidos -->
                    </select>
                </label>
                <label>Hora Estimada:
                    <input type="time" id="edit-time" value="${operation.estimatedTime || ''}">
                </label>
                <label>ID Operador:
                    <input type="number" id="edit-operator" value="${operation.operatorId}">
                </label>
                <label>ID Punto:
                    <input type="number" id="edit-point" value="${operation.pointId}">
                </label>
                <button id="btn-save-edit">Guardar Cambios</button>
                <button id="btn-cancel-edit">Cancelar</button>
            </div>
        `;

        this.container.innerHTML = formHtml;

        // Bindear eventos del formulario
        document.getElementById('btn-cancel-edit').addEventListener('click', () => this.render());
        
        document.getElementById('btn-save-edit').addEventListener('click', async () => {
            const updates = {
                state: document.getElementById('edit-state').value,
                estimatedTime: document.getElementById('edit-time').value,
                operatorId: parseInt(document.getElementById('edit-operator').value),
                pointId: parseInt(document.getElementById('edit-point').value)
            };

            try {
                await this.controller.updateOperationSpecifics(code, updates);
                alert("Operación actualizada con éxito");
                this.render(); // Volver a la tabla
            } catch (error) {
                alert("Error al actualizar: " + error.message);
            }
        });
    }
}