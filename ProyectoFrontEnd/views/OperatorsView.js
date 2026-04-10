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
                            <th>URL Logo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${operators.map(op => `
                            <tr>
                                <td>${op.operatorId}</td>
                                <td>${op.name}</td>
                                <td>${op.acronym}</td>
                                <td><span class = "color-box" style="background-color: ${op.color};"></span> ${op.color}</td>
                                <td><a href="${op.logoUrl}" target="_blank">Ver Logo</a></td>
                                <td>
                                    <button class = "btn-edit-operator" data-id = "${op.operatorId}">Editar</button>
                                    <button class = "btn-delete-operator" data-id = "${op.operatorId}">Borrar</button>
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

        const deleteButtons = this.container.querySelectorAll('.btn-delete-operator');
        deleteButtons.forEach(btn => {
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

        const editButtons = this.container.querySelectorAll('.btn-edit-operator');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.renderEditForm(id);
            });
        });

        document.getElementById('btn-new-operator').addEventListener('click', () => {
            console.log("Mostrar formulario de creación");
            this.renderCreateForm();
        });
    }

    bindCreateEvents() {

        document.getElementById('btn-cancel-create').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-new-operator').addEventListener('click', async () => {
            const newOperatorData = {
                name: document.getElementById('new-operator-name').value.trim(),
                acronym: document.getElementById('new-operator-acronym').value.trim(),
                color: document.getElementById('new-operator-color').value,
                urlIcono: document.getElementById('new-operator-urlIcono').value.trim()
            };

            try {
                await this.operatorController.createOperator(newOperatorData);
                alert("Operador creado");
                this.render();
            } catch (error) {
                alert(error.message);
                return;
            }
        });
    }

    bindEditEvents(operatorId) {

        document.getElementById('btn-cancel-edit').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-edit').addEventListener('click', async () => {
            const updatedData = {
                name: document.getElementById('edit-code').value.trim(),
                acronym: document.getElementById('edit-acronym').value.trim(),
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
        const formHtml = `
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
                        <label>URL del Logo:</label>
                        <input type = "url" id = "new-operator-urlIcono" placeholder= "Ej: https://example.com/logo.png">
                    </div>

                    <div style = "margin-top: 1.5rem; display: flex; gap: 1rem;">
                        <button id= "btn-save-new-operator" class = "btn-action btn-promote">Crear Operador</button>
                        <button id= "btn-cancel-create" class = "btn-action btn-degrade">Cancelar</button>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = formHtml;
        this.bindCreateEvents();
    }

    renderEditForm(operatorId){
        const operator = this.operatorController.findOperatorById(operatorId);
        if (!operator) return;

        const formHtml = `
            <div class= "modal">
                <h3>Editando Operador: ${operator.name}</h3>
                <label>Tipo:
                    <select id="edit-type">
                        <option value="PUERTA" ${operator.type === 'PUERTA' ? 'selected' : ''}>Puerta</option>
                        <option value="VIA" ${operator.type === 'VIA' ? 'selected' : ''}>Vía</option>
                    </select>
                </label>
                <label>Código:
                    <input type="text" id="edit-code" value="${operator.name}">
                </label>
                <button id="btn-save-edit">Guardar Cambios</button>
                <button id="btn-cancel-edit">Cancelar</button>
            </div>
        `;

        this.container.innerHTML = formHtml;
        this.bindEditEvents(operator.operatorId);
    }





}
