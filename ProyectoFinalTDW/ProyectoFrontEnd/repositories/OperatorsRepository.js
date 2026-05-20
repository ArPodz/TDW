export class OperatorsRepository {
    constructor(persistence) {
        this.persistence = persistence;
        this.operators = [];
    }

    async initialize(defaultData = []) {
        try {
            const data = await this.persistence.load();
            
            const list = (data && data.operators) ? data.operators : (Array.isArray(data) ? data : []);
            this.operators = list;
            
            if (this.operators.length === 0 && defaultData.length > 0) {
                this.operators = defaultData;
                await this.persistence.save({ operators: this.operators });
                return true;
            }
        } catch (error) {
            this.operators = defaultData;
            throw new Error("Error al inicializar repositorio de operadores: " + error.message);
        }
    }

    async addOperator(operator) {
        this.operators.push(operator);
        await this.persistence.save({ operators: this.operators });
    }

    async deleteOperator(operatorId) {
        this.operators = this.operators.filter(o => o.operatorId !== operatorId);
        await this.persistence.save({ operators: this.operators });
    }

    async updateOperator(updatedOperator) {
        const index = this.operators.findIndex(o => o.operatorId === updatedOperator.operatorId);
        if (index !== -1) {
            this.operators[index] = updatedOperator;
            await this.persistence.save({ operators: this.operators });
        } else {
            throw new Error("Operador " + updatedOperator.operatorId + " no encontrado");
        }
    }

    getOperators() {
        return this.operators;
    }

    findOperatorById(operatorId) {
        return this.operators.find(o => o.operatorId === operatorId);
    }

    maxOperatorId() {
        return this.operators.reduce((maxId, operator) => Math.max(maxId, operator.operatorId), 0);
    }

}