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
                    <select id = "info-state-filter">
                        <option value = "ALL" ${this.filters.state === 'ALL' ? 'selected' : ''}>Todos los estados</option>
                        <option value = "PROGRAMADO" ${this.filters.state === 'PROGRAMADO' ? 'selected' : ''}>Programado</option>
                        <option value = "EN CURSO" ${this.filters.state === 'EN CURSO' ? 'selected' : ''}>En curso</option>
                        <option value = "RETRASADO" ${this.filters.state === 'RETRASADO' ? 'selected' : ''}>Retrasado</option>
                        <option value = "LLEGADO" ${this.filters.state === 'LLEGADO' ? 'selected' : ''}>Llegado</option>
                        <option value = "CANCELADO" ${this.filters.state === 'CANCELADO' ? 'selected' : ''}>Cancelado</option>
                        <option value = "EMBARCANDO" ${this.filters.state === 'EMBARCANDO' ? 'selected' : ''}>Embarcando</option>
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
        const locHeader = this.currentTab === 'SALIDA' ? 'Destino' : 'Origen';
        const locKey = this.currentTab === 'SALIDA' ? 'destino' : 'origen';

        return `
            <table class="table">
                <thead>
                    <tr>
                        <th id="sort-time" style="cursor:pointer">
                            Hora ${this.getSortIcon('estimatedTime')}
                        </th>
                        <th id="sort-code" style="cursor:pointer">
                            Código ${this.getSortIcon('code')}
                        </th>
                        <th id="sort-location" style="cursor:pointer">
                            ${locHeader} ${this.getSortIcon(locKey)}
                        </th>
                        <th id="sort-operator" style="cursor:pointer">
                            Operador ${this.getSortIcon('operatorId')}
                        </th>
                        <th>Puerta/Vía</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.length > 0 ? data.map(op => {
                        const operator = this.informationController.getOperatorInfo(op.operadorId);
                        return `
                            <tr class="info-row" data-id="${op.operacionId}" style="cursor:pointer">
                                <td><strong>${op.horaEstimada}</strong></td>
                                <td>${op.codigo}</td>
                                <td>${op[locKey]}</td>
                                <td>
                                    <span class="color-box" style="background-color: ${op?.operador?.operador?.color || '#ccc'}"></span>
                                    ${op?.operador?.operador?.siglas || 'N/A'}
                                </td>
                                <td>${op.punto?.punto?.codigo || '---'}</td>
                                <td>
                                    <span class="state-badge state-${op.estado.toUpperCase()}">
                                        ${op.estado}
                                    </span>
                                </td>
                            </tr>
                        `;
                    }).join('') : '<tr><td colspan="6" style="text-align:center">No hay operaciones que mostrar</td></tr>'}
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
        const sortLocation = document.getElementById('sort-location');
        const sortOperator = document.getElementById('sort-operator');

        if (sortTime) {
            sortTime.addEventListener('click', () => this.handleSort('horaEstimada'));
        }
        
        if (sortCode) {
            sortCode.addEventListener('click', () => this.handleSort('codigo'));
        }

        if (sortLocation) {
            sortLocation.addEventListener('click', () => {
                const key = this.currentTab === 'SALIDA' ? 'destino' : 'origen';
                this.handleSort(key);
            });
        }

        if (sortOperator) {
            sortOperator.addEventListener('click', () => this.handleSort('operatorId'));
        }

        const rows = this.container.querySelectorAll('.info-row');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const operacionId = row.getAttribute('data-id');
                this.showDetail(operacionId);
            });
        });
    }

    showDetail(id) {
        const op = this.informationController.operationController.getOperationsList().find(o => o.operacionId === id);
        if (!op) return;


        alert(`
            DETALLE COMPLETO DE LA OPERACIÓN
            ----------------------------------
            Código: ${op.codigo}
            Tipo: ${op.tipo}
            Dirección: ${op.sentido}
            Estado: ${op.estado}
            
            Origen: ${op.origen}
            Destino: ${op.destino}
            
            Hora Programada: ${op.horaProgramada}
            Hora Estimada: ${op.horaEstimada}
            
            Operador: ${op.operador?.operador?.nombre || 'No asignado'} (${op.operador?.operador?.siglas || 'N/A'})
            Puerta/Vía Asignada: ${op.punto?.punto?.codigo || 'Pendiente'}
            ----------------------------------
            ID Interno: ${op.operacionId}
        `);
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