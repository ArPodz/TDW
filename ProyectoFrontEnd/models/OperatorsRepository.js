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

    getOperators() {
        return this.operators;
    }

    findOperatorByName(name) {
        return this.operators.find(o => o.name === name);
    }

    maxOperatorId() {
        return this.operators.reduce((maxId, operator) => Math.max(maxId, operator.operatorId), 0);
    }

}