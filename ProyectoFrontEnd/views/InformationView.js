export class InformationView {
    constructor(informationController, domElementId) {
        this.informationController = informationController;
        this.container = document.getElementById(domElementId);
        
        this.currentTab = 'SALIDA';

        this.filters = {
            search: '',
            state: 'ALL'
        };

        this.sortConfig = {
            key: 'estimatedTime',
            direction: 'asc'
        };

        this.refreshInterval = null;
    }

    render() {
        this.stopAutoRefresh();

        const data = this.informationController.getProcessedData({
            direction: this.currentTab,
            search: this.filters.search,
            state: this.filters.state,
            sort: this.sortConfig
        });

        this.container.innerHTML = `
            <div class = "information-tables">
                <h2>Tablero de Información</h2>

                <div class = "tabs-container">
                    <button id = "tab-departures" class = "btn-tab ${this.currentTab === 'SALIDA' ? 'active' : ''}">SALIDAS</button>
                    <button id = "tab-arrivals" class = "btn-tab ${this.currentTab === 'LLEGADA' ? 'active' : ''}">LLEGADAS</button>
                </div>

                <div class = "controls-panel">
                    <input type = "text" id = "operation-code" placeholder = "Buscar por código..." value="${this.filters.search}">
                    <select id = "info-status-filter">
                        <option value = "ALL" ${this.filters.status === 'ALL' ? 'selected' : ''}>Todos los estados</option>
                        <option value = "PROGRAMADO" ${this.filters.status === 'PROGRAMADO' ? 'selected' : ''}>Programado</option>
                        <option value = "EN CURSO" ${this.filters.status === 'EN CURSO' ? 'selected' : ''}>En curso</option>
                        <option value = "RETRASADO" ${this.filters.status === 'RETRASADO' ? 'selected' : ''}>Retrasado</option>
                        <option value = "LLEGADO" ${this.filters.status === 'LLEGADO' ? 'selected' : ''}>Completado</option>
                        <option value = "CANCELADO" ${this.filters.status === 'CANCELADO' ? 'selected' : ''}>Cancelado</option>
                        <option value = "EMBARCANDO" ${this.filters.status === 'EMBARCANDO' ? 'selected' : ''}>Embarcando</option>
                    </select>
                </div>

                <div id = "board-content">
                    ${this.generateTableHtml(data)}
                </div>
            </div>
        `;

        this.bindEvents();
        this.startAutoRefresh();
    }

     generateTableHtml(data) {
        return `
            <table class = "table">
                <thead>
                    <tr>
                        <th id = "sort-time">Hora ${this.getSortIcon('estimatedTime')}</th>
                        <th id = "sort-code">Código ${this.getSortIcon('code')}</th>
                        <th id = "sort-location">${this.currentTab === 'SALIDA' ? 'Destino' : 'Origen'}</th>
                        <th>Operador</th>
                        <th>Puerta/Vía</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.length > 0 ? data.map(op => {
                        const operator = this.informationController.getOperatorInfo(op.operatorId);
                        return `
                            <tr class = "info-row" data-id = "${op.operationId}">
                                <td><strong>${op.estimatedTime}</strong></td>
                                <td>${op.code}</td>
                                <td>${this.currentTab === 'SALIDA' ? op.destination : op.origin}</td>
                                <td>
                                    <span class = "color-box" style = "background-color: ${operator?.color || '#ccc'}"></span>
                                    ${operator?.acronyms || 'N/A'}
                                </td>
                                <td>
                                <td><span class = "state-badge state-${op.state.toLowerCase()}">${op.state}</span></td>
                            </tr>
                        `;
                    }).join('') : '<tr><td colspan="5">No hay operaciones que mostrar</td></tr>'}
                </tbody>
            </table>
        `;
    }

    bindEvents() {

        const tabDepartures = document.getElementById('tab-departures');
        const tabArrivals = document.getElementById('tab-arrivals');

        if(tabDepartures) {
            tabDepartures.addEventListener('click', () => {
                this.currentTab = 'SALIDA';
                this.render();
            });
        }

        if(tabArrivals) {
            tabArrivals.addEventListener('click', () => {
                this.currentTab = 'LLEGADA';
                this.render();
            });
        }

        const searchInput = document.getElementById('operation-code');
        if(searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value;
                this.updateTableOnly();
            });
            searchInput.focus();
            searchInput.setSelectionRange(this.filters.search.length, this.filters.search.length);
        }

        const stateFilter = document.getElementById('info-state-filter');
        if(stateFilter) {
            stateFilter.addEventListener('change', (e) => {
                this.filters.state = e.target.value;
                this.updateTableOnly();
            });
        }

        const sortTime = document.getElementById('sort-time');
        const sortCode = document.getElementById('sort-code');

        if(sortTime) sortTime.addEventListener('click', () => this.handleSort('estimatedTime'));
        if(sortCode) sortCode.addEventListener('click', () => this.handleSort('code'));

        this.container.querySelectorAll('.info-row').forEach(row => {
            row.addEventListener('click', () => console.log("Mostrar detalle de operación:", row.dataset.id));
        });
    }

    updateTableOnly() {
        const data = this.informationController.getProcessedData({
            direction: this.currentTab,
            search: this.filters.search,
            state: this.filters.state,
            sort: this.sortConfig
        });

        document.getElementById('board-content').innerHTML = this.generateTableHtml(data);
        this.bindEvents();
    }

    getSortIcon(key) {
        if (this.sortConfig.key !== key) {
          return '↕️';  
        }
        return this.sortConfig.direction === 'asc' ? '🔼' : '🔽';
    }

    handleSort(key) {
        if (this.sortConfig.key === key) {
            this.sortConfig.direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortConfig.key = key;
            this.sortConfig.direction = 'asc';
        }
        this.render(); 
    }

    startAutoRefresh() {
        this.refreshInterval = setInterval(() => this.render(), 60000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) clearInterval(this.refreshInterval);
    }
}