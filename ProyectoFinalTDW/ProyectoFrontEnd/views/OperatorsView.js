export class OperatorsView {
    constructor(operatorController, domElementId) {
        this.operatorController = operatorController;
        this.container = document.getElementById(domElementId);
    }

    render() {
        const operators = this.operatorController.getOperatorsList();
        let html = `
            <div class = "management-operators">
                <h2>Gestión de Operadores</h2>
                <button id = "btn-new-operator">Nuevo Operador</button>
                <table class = "table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Siglas</th>
                            <th>Color</th>
                            <th>URL Icono</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${operators.map(op => `
                            <tr>
                                <td>${op.id}</td>
                                <td>${op.nombre}</td>
                                <td>${op.siglas}</td>
                                <td><span class = "color-box" style = "background-color: ${op.color};"></span> ${op.color}</td>
                                <td><a href="${op.urlIcono}" target = "_blank">Ver Icono</a></td>
                                <td>
                                    <button class = "btn-edit-operator" data-id = "${op.id}">Editar</button>
                                    <button class = "btn-delete-operator" data-id = "${op.id}">Borrar</button>
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

        this.container.querySelectorAll('.btn-delete-operator').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = Number(e.target.getAttribute('data-id'));
                if (confirm(`¿Seguro que deseas eliminar el operador ${id}?`)) {
                    try {
                        await this.operatorController.deleteOperator(id);
                        alert("Operador eliminado");
                        this.render();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });


        this.container.querySelectorAll('.btn-edit-operator').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.renderEditForm(Number(e.target.getAttribute('data-id')));
            });
        });

        document.getElementById('btn-new-operator').addEventListener('click', () => {
            this.renderCreateForm();
        });
    }

    bindCreateEvents() {

        document.getElementById('btn-cancel-create').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-new-operator').addEventListener('click', async () => {
            const newOperatorData = {
                nombre: document.getElementById('new-operator-name').value.trim(),
                siglas: document.getElementById('new-operator-acronym').value.trim(),
                color: document.getElementById('new-operator-color').value,
                urlIcono: document.getElementById('new-operator-urlIcono').value.trim()
            };

            try {
                await this.operatorController.createOperator(newOperatorData);
                alert("Operador creado");
                this.render();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    bindEditEvents(operatorId) {

        document.getElementById('btn-cancel-edit').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-edit').addEventListener('click', async () => {
            const updatedData = {
                nombre: document.getElementById('edit-code').value.trim(),
                siglas: document.getElementById('edit-acronym').value.trim(),
                color: document.getElementById('edit-color').value,
                urlIcono: document.getElementById('edit-urlIcono').value.trim()
            };

            try {
                await this.operatorController.updateOperator(operatorId, updatedData);
                alert("Operador actualizado con éxito");
                this.render();
            } catch (error) {
                alert("Error al actualizar: " + error.message);
            }
        });
    }


    renderCreateForm(){
        this.container.innerHTML = `
            <div class= "gestor-panel">
                <h3>Crear Nuevo Operador</h3>
                <div class = "form-container">
                    <div class = "form-group">
                        <label>Nombre del Operador:</label>
                        <input type = "text" id = "new-operator-name" placeholder= "Ej: Operador">
                    </div>

                    <div class = "form-group">
                        <label>Acrónimo:</label>
                        <input type = "text" id = "new-operator-acronym" placeholder= "Ej: OP1">
                    </div>

                    <div class = "form-group">
                        <label>Color:</label>
                        <input type = "color" id = "new-operator-color">
                    </div>

                    <div class = "form-group">
                        <label>URL del Icono:</label>
                        <input type = "url" id = "new-operator-urlIcono" placeholder= "Ej: https://example.com/logo.png">
                    </div>

                    <div style = "margin-top: 1.5rem; display: flex; gap: 1rem;">
                        <button id= "btn-save-new-operator" class = "btn-action btn-promote">Crear Operador</button>
                        <button id= "btn-cancel-create" class = "btn-action btn-degrade">Cancelar</button>
                    </div>
                </div>
            </div>
        `;

        this.bindCreateEvents();
    }

    renderEditForm(operatorId){
        const operator = this.operatorController.findOperatorById(operatorId);
        if (!operator) return;

        this.container.innerHTML = `
            <div class = "form-edit-card">
                <h3>Editando Operador: ${operator.id} - ${operator.nombre}</h3>
                <label>Nombre:
                    <input type = "text" id = "edit-code" value="${operator.nombre}">
                </label>
                <label>Acrónimo:
                    <input type = "text" id = "edit-acronym" value = "${operator.siglas}">
                </label>
                <label>Color:
                    <input type = "color" id = "edit-color" value = "${operator.color}">
                </label>
                <label>URL del Icono:
                    <input type = "url" id = "edit-urlIcono" value = "${operator.urlIcono}">
                </label>

                <button id="btn-save-edit">Guardar Cambios</button>
                <button id="btn-cancel-edit">Cancelar</button>
            </div>
        `;
        
        this.bindEditEvents(operator.id);
    }

}
