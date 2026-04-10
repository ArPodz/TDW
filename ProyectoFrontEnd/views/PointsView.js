export class PointsView {
    constructor(pointController, domElementId) {
        this.pointController = pointController;
        this.container = document.getElementById(domElementId);
    }

    render() {
        const points = this.pointController.getPointsList();
        let html = `
            <div class = "management-points">
                <h2>Gestión de Puntos</h2>
                <button id = "btn-new-point">Nuevo Punto</button>
                <table class = "table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Código</th>
                            <th>Tipo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${points.map(p => `
                            <tr>
                                <td>${p.pointId}</td>
                                <td>${p.code}</td>
                                <td>${p.type}</td>
                                <td>
                                    <button class = "btn-edit-point" data-id = "${p.code}">Editar</button>
                                    <button class = "btn-delete-point" data-id = "${p.code}">Borrar</button>
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

        const deleteButtons = this.container.querySelectorAll('.btn-delete-point');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const code = e.target.getAttribute('data-id');
                if (confirm(`¿Seguro que deseas eliminar el punto ${code}?`)) {
                    try {
                        const point = this.pointController.findPointByCode(code);
                        await this.pointController.deletePoint(point.pointId);
                        alert("Punto eliminado");
                        this.render();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });

        const editButtons = this.container.querySelectorAll('.btn-edit-point');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.target.getAttribute('data-id');
                this.renderEditForm(code);
            });
        });

        document.getElementById('btn-new-point').addEventListener('click', () => {
            console.log("Mostrar formulario de creación");
            this.renderCreateForm();
        });
    }

    bindCreateEvents() {

        document.getElementById('btn-cancel-create').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-new-point').addEventListener('click', async () => {
            const newPointData = {
                code: document.getElementById('new-point-code').value.trim(),
                type: document.getElementById('new-point-type').value
            };

            try {
                await this.pointController.createPoint(newPointData);
                alert("Punto creado");
                this.render();
            } catch (error) {
                alert(error.message);
                return;
            }
        });
    }

    bindEditEvents(pointId) {

        document.getElementById('btn-cancel-edit').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-edit').addEventListener('click', async () => {
            const updatedData = {
                code: document.getElementById('edit-code').value.trim(),
                type: document.getElementById('edit-type').value
            };

            try {
                await this.pointController.updatePoint(pointId, updatedData);
                alert("Punto actualizado con éxito");
                this.render();
            } catch (error) {
                alert("Error al actualizar: " + error.message);
            }
        });
    }

    renderEditForm(code){
        const point = this.pointController.findPointByCode(code);
        if (!point) return;

        const formHtml = `
            <div class= "modal">
                <h3>Editando Punto: ${point.code}</h3>
                <label>Tipo:
                    <select id="edit-type">
                        <option value="PUERTA" ${point.type === 'PUERTA' ? 'selected' : ''}>Puerta</option>
                        <option value="VIA" ${point.type === 'VIA' ? 'selected' : ''}>Vía</option>
                    </select>
                </label>
                <label>Código:
                    <input type="text" id="edit-code" value="${point.code}">
                </label>
                <button id="btn-save-edit">Guardar Cambios</button>
                <button id="btn-cancel-edit">Cancelar</button>
            </div>
        `;
        this.container.innerHTML = formHtml;
        this.bindEditEvents(point.pointId);
    }

    renderCreateForm(){
        const formHtml = `
            <div class= "gestor-panel">
                <h3>Crear Nuevo Punto</h3>
                <div class = "form-container">
                    <div class = "form-group">
                        <label>Código del Punto:</label>
                        <input type = "text" id = "new-point-code" placeholder= "Ej: T1-G12, Vía 4">
                    </div>

                    <div class = "form-group">
                        <label>Tipo de Punto:</label>
                        <select id = "new-point-type">
                            <option value="PUERTA">Puerta</option>
                            <option value="VIA">Vía</option>
                        </select>
                    </div>

                    <div style = "margin-top: 1.5rem; display: flex; gap: 1rem;">
                        <button id= "btn-save-new-point" class = "btn-action btn-promote">Crear Punto</button>
                        <button id= "btn-cancel-create" class = "btn-action btn-degrade">Cancelar</button>
                    </div>
                </div>
            </div>
        `;

        this.container.innerHTML = formHtml;
        this.bindCreateEvents();
    }
}
      

      