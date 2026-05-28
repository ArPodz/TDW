import { OperatorsRepository } from "../repositories/OperatorsRepository.js";
// import { OperatorFactory } from "../factories/OperatorFactory.js";

export class OperatorController {

    constructor(api) {
        this.operators =  new OperatorsRepository(api);
    }

    async initialize() {
        await this.operators.initialize();
    }

    async createOperator(data){
        return await this.operators.addOperator({
            nombre: data.nombre,
            siglas: data.siglas,
            color: data.color,
            urlIcono: data.urlIcono
        });
    }

    async deleteOperator(operatorId) { 
        await this.operators.deleteOperator(operatorId);
    }

    async updateOperator(operatorId, updatedData) {
        const existingOperator = this.operators.findOperatorById(operatorId);
        if (!existingOperator) {
            throw new Error("Operador no encontrado");
        }
        
        return await this.operators.updateOperator(operatorId, updatedData);
    }

    getOperatorsList(){
        return [...this.operators.getOperators()];
    }

    findOperatorById(operatorId) {
        return this.operators.findOperatorById(operatorId);
    }
    
}