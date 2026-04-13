export class OperationsView {
    constructor(operationController, domElementId) {
        this.operationController = operationController;
        this.container = document.getElementById(domElementId); 
    }

    render() {
        const operations = this.operationController.getOperationsList();
        let html = `
            <div class="management-operations">
                <h2>Gestión de Operaciones</h2>
                <button id = "btn-new-operation">Nueva Operación</button>
                <table class = "table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Código</th>
                            <th>Tipo</th>
                            <th>Sentido</th>
                            <th>Origen</th>
                            <th>Destino</th>
                            <th>Hora Programada</th>
                            <th>Hora Estimada</th>
                            <th>Estado</th>
                            <th>Operador</th>
                            <th>Punto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    ${operations.map(o => `
                            <tr>
                                <td>${o.operationId}</td>
                                <td>${o.code}</td>
                                <td>${o.type}</td>
                                <td>${o.direction}</td>
                                <td>${o.origin}</td>
                                <td>${o.destination}</td>
                                <td>${o.scheduledTime}</td>
                                <td>${o.estimatedTime}</td>
                                <td>${o.state}</td>
                                <td>${o.operatorId}</td>
                                <td>${o.pointId}</td>
                                <td>
                                    <button class = "btn-edit-operation" data-id = "${o.code}">Editar</button>
                                    <button class = "btn-delete-operation" data-id = "${o.code}">Borrar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.container.innerHTML = html;
        this.bindEvents();
    }


    bindEvents() {
        const deleteButtons = this.container.querySelectorAll('.btn-delete-operation');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const code = e.target.getAttribute('data-id');
                if (confirm(`¿Seguro que deseas eliminar la operación ${code}?`)) {
                    try {
                        const operationId = this.operationController.findOperationByCode(code).operationId;
                        await this.operationController.deleteOperation(operationId);
                        alert("Operación eliminada");
                        this.render();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });

        const editButtons = this.container.querySelectorAll('.btn-edit-operation');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.getAttribute('data-id');
                this.renderEditForm(code);
            });
        });

        document.getElementById('btn-new-operation').addEventListener('click', () => {
            console.log("Mostrar formulario de creación");
            this.renderCreateForm();
        });
    }

    bindCreateEvents() {

        document.getElementById('btn-cancel-create').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-new-operation').addEventListener('click', async () => {
            const newOperationData = {
                type: document.getElementById('new-operation-type').value.trim(),
                code: document.getElementById('new-operation-code').value.trim(),
                direction: document.getElementById('new-operation-direction').value.trim(),
                origin: document.getElementById('new-operation-origin').value.trim(),
                destination: document.getElementById('new-operation-destination').value.trim(),
                scheduledTime: document.getElementById('new-operation-scheduledTime').value,
                estimatedTime: document.getElementById('new-operation-estimatedTime').value,
                state: document.getElementById('new-operation-state').value.trim(),
                operatorId: parseInt(document.getElementById('new-operation-operatorId').value),
                pointId: parseInt(document.getElementById('new-operation-pointId').value)
            };

            try {
                await this.operationController.createOperation(newOperationData);
                alert("Operación creada");
                this.render();
            } catch (error) {
                alert(error.message);
                return;
            }
        });
    }


    bindEditEvents(operationId) {

        document.getElementById('btn-cancel-edit').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-edit').addEventListener('click', async () => {
            const updatedData = {
                state: document.getElementById('edit-state').value.trim(),
                estimatedTime: document.getElementById('edit-estimatedTime').value,
                operatorId: parseInt(document.getElementById('edit-operatorId').value),
                pointId: parseInt(document.getElementById('edit-pointId').value)
            };  

            try {
                await this.operationController.updateOperation(operationId, updatedData);
                alert("Operación actualizada con éxito");
                this.render();
            } catch (error) {
                alert("Error al actualizar: " + error.message);
            }
        });
    }

    renderEditForm(code){
        const operation = this.operationController.findOperationByCode(code);
        if (!operation) return;

        const formHtml = `
            <div class = "form-edit-card">
                <h3>Editando Operación: ${operation.code}</h3>
                <label>Estado:
                    <select id = "edit-state">
                        <option value="PROGRAMADO" ${operation.state === 'PROGRAMADO' ? 'selected' : ''}>Programado</option>
                        <option value="EMBARCANDO" ${operation.state === 'EMBARCANDO' ? 'selected' : ''}>Embarcando</option>
                        <option value="RETRASADO" ${operation.state === 'RETRASADO' ? 'selected' : ''}>Retrasado</option>
                        <option value="EN_RUTA" ${operation.state === 'EN_RUTA' ? 'selected' : ''}>En Ruta</option>
                        <option value="CANCELADO" ${operation.state === 'CANCELADO' ? 'selected' : ''}>Cancelado</option>
                        <option value="LLEGADO" ${operation.state === 'LLEGADO' ? 'selected' : ''}>Llegado</option>
                    </select>
                </label>
                <label>Hora Estimada:
                    <input type = "time" id = "edit-estimatedTime" value = "${operation.estimatedTime || ''}">
                </label>
                <label>ID Operador:
                    <input type = "number" id = "edit-operatorId" value = "${operation.operatorId}">
                </label>
                <label>ID Punto:
                    <input type = "number" id = "edit-pointId" value = "${operation.pointId}">
                </label>
                <button id = "btn-save-edit">Guardar Cambios</button>
                <button id = "btn-cancel-edit">Cancelar</button>
            </div>
        `;
        this.container.innerHTML = formHtml;
        this.bindEditEvents(operation.operationId);
    }

    renderCreateForm(){
        const formHtml = `
            <div class= "gestor-panel">
                <h3>Crear Nueva Operación</h3>
                <div class = "form-container">
                    <div class = "form-group">
                        <label>Tipo de Operación:</label>
                        <select id = "new-operation-type">
                            <option value="TREN">Tren</option>
                            <option value="VUELO">Vuelo</option>
                        </select>
                    </div>
                    <div class = "form-group">
                        <label>Código de la Operación:</label>
                        <input type = "text" id = "new-operation-code" placeholder= "Ej: OP123">
                    </div>
                    <div class = "form-group">
                        <label>Sentido:</label>
                        <select id = "new-operation-direction">
                            <option value="SALIDA">Salida</option>
                            <option value="LLEGADA">Llegada</option>
                        </select>
                    </div>
                    <div class = "form-group">
                        <label>Origen:</label>
                        <input type = "text" id = "new-operation-origin" placeholder= "Ej: Madrid">
                    </div>
                    <div class = "form-group">
                        <label>Destino:</label>
                        <input type = "text" id = "new-operation-destination" placeholder= "Ej: Barcelona">
                    </div>
                    <div class = "form-group">
                        <label>Hora Programada:</label>
                        <input type = "datetime-local" id = "new-operation-scheduledTime">
                    </div>
                    <div class = "form-group">
                        <label>Hora Estimada:</label>
                        <input type = "datetime-local" id = "new-operation-estimatedTime">
                    </div>
                    <div class = "form-group">
                        <label>Estado:</label>
                        <select id = "new-operation-state">
                            <option value="PROGRAMADO">Programado</option> 
                            <option value="EMBARCANDO">Embarcando</option>
                            <option value="RETRASADO">Retrasado</option>
                            <option value="EN_RUTA">En Ruta</option>
                            <option value="CANCELADO">Cancelado</option>
                            <option value="LLEGADO">Llegado</option>
                        </select>
                    </div>
                    <div class = "form-group">
                        <label>ID del Operador:</label>
                        <input type = "number" id = "new-operation-operatorId" placeholder= "Ej: 1">
                    </div>
                    <div class = "form-group">
                        <label>ID del Punto:</label>
                        <input type = "number" id = "new-operation-pointId" placeholder= "Ej: 1">
                    </div>
                    <div style = "margin-top: 1.5rem; display: flex; gap: 1rem;">
                        <button id= "btn-save-new-operation" class = "btn-action btn-promote">Crear Operación</button>
                        <button id= "btn-cancel-create" class = "btn-action btn-degrade">Cancelar</button>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = formHtml;
        this.bindCreateEvents();
    }
}


