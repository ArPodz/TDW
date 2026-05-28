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
                                <td>${p.puntoId}</td>
                                <td>${p.codigo}</td>
                                <td>${p.tipo}</td>
                                <td>
                                    <button class = "btn-edit-point" data-id = "${p.codigo}">Editar</button>
                                    <button class = "btn-delete-point" data-id = "${p.puntoId}">Borrar</button>
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

        this.container.querySelectorAll('.btn-delete-point').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const puntoId = Number(e.target.getAttribute('data-id'));
                if (confirm(`¿Seguro que deseas eliminar el punto ${puntoId}?`)) {
                    try {
                        await this.pointController.deletePoint(puntoId);
                        alert("Punto eliminado");
                        this.render();
                    } catch (error) {
                        alert(error.message);
                    }
                }
            });
        });


        this.container.querySelectorAll('.btn-edit-point').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.renderEditForm(e.target.getAttribute('data-id'));
            });
        });

        document.getElementById('btn-new-point').addEventListener('click', () => {
            this.renderCreateForm();
        });
    }


    bindCreateEvents() {

        document.getElementById('btn-cancel-create').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-new-point').addEventListener('click', async () => {
            const newPointData = {
                codigo: document.getElementById('new-point-code').value.trim(),
                tipo: document.getElementById('new-point-type').value
            };

            try {
                await this.pointController.createPoint(newPointData);
                alert("Punto creado");
                this.render();
            } catch (error) {
                alert(error.message);
            }
        });
    }


    bindEditEvents(puntoId) {

        document.getElementById('btn-cancel-edit').addEventListener('click', () => {
            this.render();
        });

        document.getElementById('btn-save-edit').addEventListener('click', async () => {
            const updatedData = {
                codigo: document.getElementById('edit-code').value.trim(),
                tipo: document.getElementById('edit-type').value
            };

            try {
                await this.pointController.updatePoint(puntoId, updatedData);
                alert("Punto actualizado con éxito");
                this.render();
            } catch (error) {
                alert("Error al actualizar: " + error.message);
            }
        });
    }

    renderEditForm(codigo){
        const point = this.pointController.findPointByCode(codigo);
        if (!point) return;

        this.container.innerHTML = `
            <div class= "form-edit-card">
                <h3>Editando Punto: ${point.codigo}</h3>
                <label>Tipo:
                    <select id="edit-type">
                        <option value="PUERTA" ${point.tipo === 'PUERTA' ? 'selected' : ''}>Puerta</option>
                        <option value="VIA" ${point.tipo === 'VIA' ? 'selected' : ''}>Vía</option>
                    </select>
                </label>
                <label>Código:
                    <input type="text" id="edit-code" value="${point.codigo}">
                </label>
                <button id="btn-save-edit">Guardar Cambios</button>
                <button id="btn-cancel-edit">Cancelar</button>
            </div>
        `;
        this.bindEditEvents(point.puntoId);
    }

    renderCreateForm(){
        this.container.innerHTML = `
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
        
        this.bindCreateEvents();
    }
}
      

      