export const InformationView = {

    renderInformation: (containerId, operations) => {
        const container = document.getElementById('information-table-container');
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th onclick="sortData('scheduledTime')">Hora</th>
                        <th onclick="sortData('code')">Código</th>
                        <th onclick="sortData('origin')">Origen/Destino</th>
                        <th>Operador</th>
                        <th>Puerta/Vía</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${operations.map(op => `
                        <tr onclick="showDetail('${op.operationId}')">
                            <td>${new Date(op.estimatedTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                            <td>**${op.code}**</td>
                            <td>${op.direction === 'SALIDA' ? op.destination : op.origin}</td>
                            <td>${op.operatorName}</td>
                            <td>${op.pointCode}</td>
                            <td class="status-${op.state.toLowerCase()}">${op.state}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
};

