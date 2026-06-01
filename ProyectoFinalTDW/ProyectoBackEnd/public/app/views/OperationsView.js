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
                                <td>${o.operacionId}</td>
                                <td>${o.codigo}</td>
                                <td>${o.tipo.toUpperCase()}</td>
                                <td>${o.sentido.toUpperCase()}</td>
                                <td>${o.origen}</td>
                                <td>${o.destino}</td>
                                <td>${o.horaProgramada}</td>
                                <td>${o.horaEstimada}</td>
                                <td>${o.estado.toUpperCase()}</td>
                                <td>${o.operador?.operador?.nombre ?? o.operadorId ?? '-'}</td>
                                <td>${o.punto?.punto?.codigo ?? o.puntoId ?? '-'}</td>
                                <td>
                                    <button class = "btn-edit-operation" data-id = "${o.codigo}">Editar</button>
                                    <button class = "btn-delete-operation" data-id = "${o.codigo}">Borrar</button>
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
        this.container.querySelectorAll('.btn-delete-operation').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const codigo = e.target.getAttribute('data-id');
                if (confirm(`¿Seguro que deseas eliminar la operación ${codigo}?`)) {
                    try {
                        const operation = this.operationController.findOperationByCode(codigo);
                        
                        await this.operationController.deleteOperation(operation.operacionId);
                        alert("Operación eliminada");
                        this.render();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });


        this.container.querySelectorAll('.btn-edit-operation').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.renderEditForm(e.target.getAttribute('data-id'));
            });
        });


        document.getElementById('btn-new-operation').addEventListener('click', () => {
            this.renderCreateForm();
        });
    }


    bindCreateEvents() {

        document.getElementById('btn-cancel-create').addEventListener('click', () => {
            this.render();
        });


        document.getElementById('btn-save-new-operation').addEventListener('click', async () => {

            const formatDateTime = (value) => {
                if (!value) return null;
                return value.replace('T', ' ');
            };
                        
            const newOperationData = {
                tipo: document.getElementById('new-operation-type').value.trim(),
                codigo: document.getElementById('new-operation-code').value.trim(),
                sentido: document.getElementById('new-operation-direction').value.trim(),
                origen: document.getElementById('new-operation-origin').value.trim(),
                destino: document.getElementById('new-operation-destination').value.trim(),
                horaProgramada: formatDateTime(document.getElementById('new-operation-scheduledTime').value),
                horaEstimada: formatDateTime(document.getElementById('new-operation-estimatedTime').value),
                estado: document.getElementById('new-operation-state').value.trim(),
                operadorId: parseInt(document.getElementById('new-operation-operatorId').value),
                puntoId: parseInt(document.getElementById('new-operation-pointId').value)
            };

            try {
                await this.operationController.createOperation(newOperationData);
                alert("Operación creada");
                this.render();
            } catch (error) {
                alert(error.message);
            }
        });
    }


    bindEditEvents(operacionId) {

        document.getElementById('btn-cancel-edit').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-edit').addEventListener('click', async () => {
            const updatedData = {
                estado: document.getElementById('edit-state').value.trim(),
                horaEstimada: document.getElementById('edit-estimatedTime').value,
                operadorId: parseInt(document.getElementById('edit-operatorId').value),
                puntoId: parseInt(document.getElementById('edit-pointId').value)
            };  

            try {
                await this.operationController.updateOperation(operacionId, updatedData);
                alert("Operación actualizada con éxito");
                this.render();
            } catch (error) {
                alert("Error al actualizar: " + error.message);
            }
        });
    }

    renderEditForm(codigo){
        const operation = this.operationController.findOperationByCode(codigo);
        if (!operation) return;

        this.container.innerHTML = `
            <div class = "form-edit-card">
                <h3>Editando Operación: ${operation.codigo}</h3>
                <label>Estado:
                    <select id = "edit-state">
                        <option value="PROGRAMADO" ${operation.estado === 'PROGRAMADO' ? 'selected' : ''}>Programado</option>
                        <option value="EMBARCANDO" ${operation.estado === 'EMBARCANDO' ? 'selected' : ''}>Embarcando</option>
                        <option value="RETRASADO" ${operation.estado === 'RETRASADO' ? 'selected' : ''}>Retrasado</option>
                        <option value="EN_RUTA" ${operation.estado === 'EN_RUTA' ? 'selected' : ''}>En Ruta</option>
                        <option value="CANCELADO" ${operation.estado === 'CANCELADO' ? 'selected' : ''}>Cancelado</option>
                        <option value="LLEGADO" ${operation.estado === 'LLEGADO' ? 'selected' : ''}>Llegado</option>
                    </select>
                </label>
                <label>Hora Estimada:
                    <input type = "datetime-local" id = "edit-estimatedTime" value = "${operation.horaEstimada || ''}">
                </label>
                <label>ID Operador:
                    <input type = "number" id = "edit-operatorId" value = "${operation.operadorId}">
                </label>
                <label>ID Punto:
                    <input type = "number" id = "edit-pointId" value = "${operation.puntoId}">
                </label>
                <button id = "btn-save-edit">Guardar Cambios</button>
                <button id = "btn-cancel-edit">Cancelar</button>
            </div>
        `;
        this.bindEditEvents(operation.operacionId);
    }

    renderCreateForm(){
        this.container.innerHTML = `
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
        this.bindCreateEvents();
    }
}


