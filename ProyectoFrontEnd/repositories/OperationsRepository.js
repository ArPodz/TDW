export class OperationsRepository {
    constructor(persistence) {
        this.persistence = persistence;
        this.operations = [];
    }

    async initialize(defaultData = []) {
        try {
            const data = await this.persistence.load();
            
            const list = (data && data.operations) ? data.operations : (Array.isArray(data) ? data : []);
            this.operations = list;
            
            if (this.operations.length === 0 && defaultData.length > 0) {
                this.operations = defaultData;
                await this.persistence.save({ operations: this.operations });
                return true;
            }
        } catch (error) {
            this.operations = defaultData;
            throw new Error("Error al inicializar repositorio de operaciones: " + error.message);
        }
    }

    async addOperation(operation) {
        this.operations.push(operation);
        await this.persistence.save({ operations: this.operations });
    }

    async updateOperation(updatedOperation) {
        const index = this.operations.findIndex(o => o.operationId === updatedOperation.operationId);
        if (index !== -1) {
            this.operations[index] = updatedOperation;
            await this.persistence.save({ operations: this.operations });
        } else {
            throw new Error("Operación " + updatedOperation.operationId + " no encontrada");
        }
    }

    async deleteOperation(operationId) {
        this.operations = this.operations.filter(o => o.operationId !== operationId);
        await this.persistence.save({ operations: this.operations });
    }

    getOperations() {
        return this.operations;
    }

    findOperationByCode(code) {
        return this.operations.find(o => o.code === code);
    }

    uniqueCode(code) {
        return !this.operations.some(o => o.code === code);
    }

}