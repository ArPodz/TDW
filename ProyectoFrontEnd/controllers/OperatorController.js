import { OperatorsRepository } from "../models/OperatorsRepository.js";

export class OperatorController {
    constructor(persistence) {
        this.operators =  new OperatorsRepository(persistence);
    }

    async createOperator(data){
        let operatorId = this.operators.maxOperatorId() + 1;
        const newOperator = OperatorFactory(operatorId, data.name, data.acronyms, data.color, data.urlIcono);
        await this.operators.addOperator(newOperator);
    }

    async deleteOperator(operatorId) { 
        await this.operators.deleteOperator(operatorId);
    }

    async updateOperator(operatorId, updatedData) {
        const existingOperator = this.operators.getOperators().find(o => o.operatorId === operatorId);
        if (!existingOperator) {
            throw new Error("Operador no encontrado");
        }
        const updatedOperator = {
            ...existingOperator,
            ...updatedData
        };
        await this.operators.updateOperator(updatedOperator);
    }

}