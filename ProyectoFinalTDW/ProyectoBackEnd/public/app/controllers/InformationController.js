export class InformationController {
    constructor(operationController, operatorController) {
        this.operationController = operationController;
        this.operatorController = operatorController;
    }

    getProcessedData(configuration) {

        const {direction, search, state, sort } = configuration;

        let data = this.operationController.getOperationsList().filter(op => op.sentido?.toUpperCase() === direction);

        if (search) {
            const query = search.toLowerCase();
            data = data.filter(op => op.codigo.toLowerCase().includes(query));
        }

        if (state !== "ALL") {
            data = data.filter(op => op.estado === state);
        }

        data.sort((a, b) => {
            let fieldA = a[sort.key];
            let fieldB = b[sort.key];
            if(fieldA < fieldB) return sort.direction === 'asc' ? -1 : 1;
            if(fieldA > fieldB) return sort.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return data;
    }

    getOperatorInfo(operadorId) {
        return this.operatorController.findOperatorById(operadorId);
    }

}