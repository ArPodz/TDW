export class InformationView {
    constructor(operationController, operatorsController, pointsController, domElementId) {
        this.operationController = operationController;
        this.operatorsController = operatorsController;
        this.pointsController = pointsController;
        this.container = document.getElementById(domElementId);

        this.currentTab = 'SALIDA'; // Por defecto empezamos en Salidas
    
        this.filters = { search: '', status: 'ALL' };
        this.sortConfig = { key: 'estimatedTime', direction: 'asc' };
        this.refreshInterval = null;
    }

    render() {
        this.stopAutoRefresh();
        
        const html = `
            <div class="info-view-container">
                <h2>Tablero de Información</h2>
                
                <div class="tabs-container">
                    <button id="tab-departures" class="tab-btn ${this.currentTab === 'SALIDA' ? 'active' : ''}">
                        🛫 SALIDAS
                    </button>
                    <button id="tab-arrivals" class="tab-btn ${this.currentTab === 'LLEGADA' ? 'active' : ''}">
                        🛬 LLEGADAS
                    </button>
                </div>

                <div class="controls-panel">
                    <input type="text" id="search-input" placeholder="Buscar código..." value="${this.filters.search}">
                    <select id="status-filter">
                        <option value="ALL">Todos los estados</option>
                        <option value="PROGRAMADO">Programado</option>
                        <option value="EN CURSO">En curso</option>
                        <option value="RETRASADO">Retrasado</option>
                        <option value="COMPLETADO">Completado</option>
                    </select>
                </div>

                <div id="info-board">
                    ${this.generateTableHtml(this.currentTab)}
                </div>
            </div>
        `;

        this.container.innerHTML = html;
        this.bindEvents();
        this.startAutoRefresh();
    }
}
