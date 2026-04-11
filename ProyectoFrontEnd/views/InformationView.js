export class InformationView {
    constructor(operationController, operatorsController, pointsController, domElementId) {
        this.operationController = operationController;
        this.operatorsController = operatorsController;
        this.pointsController = pointsController;
        this.container = document.getElementById(domElementId);
    }

    render() {
        const operations = this.operationController.getOperationsList();
        const operators = this.operatorsController.getOperatorsList();
        const points = this.pointsController.getPointsList();

    }
}
