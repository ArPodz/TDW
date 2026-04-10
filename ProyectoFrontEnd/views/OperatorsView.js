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
                                <td><span class="color-box" style="background-color: ${op.color};"></span> ${op.color}</td>
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
}