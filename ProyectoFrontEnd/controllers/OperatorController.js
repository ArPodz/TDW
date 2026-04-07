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

}