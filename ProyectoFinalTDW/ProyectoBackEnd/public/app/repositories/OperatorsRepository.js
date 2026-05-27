import { ApiService } from "../services/ApiService.js";

export class OperatorsRepository {

    constructor(api) {
        this.api = api;
        this.operators = [];
    }

    async initialize(defaultData = []) {
        try {
            const data = await this.api.get('operators');

            const raw = data?.operadores ?? data ?? [];
            this.operators = raw.map(item => item.operador ?? item);
            
        } catch (error) {
            this.operators = [];
            console.warn("Error al inicializar repositorio de operadores: " + error.message);
        }
    }

    async addOperator(operatorData) {
        const data = await this.api.post('operators', {
            nombre: operatorData.nombre,
            siglas: operatorData.siglas,
            color: operatorData.color,
            urlIcono: operatorData.urlIcono
        });

        const created = data?.operador ?? data;
        this.operators.push(created);
        return created;
    }

    async deleteOperator(id) {
        await this.api.delete(`operators/${id}`);
        this.operators = this.operators.filter(o => o.id !== id);
    }

    async updateOperator(id, updatedData) {
        const data = await this.api.put(`operators/${id}`, updatedData);
        const updatedOperator = data?.operador ?? data;

        const index = this.operators.findIndex(o => o.id === id);
        if (index !== -1) {
            this.operators[index] = updatedOperator;
        }

        return updatedOperator;
    }

    getOperators() {
        return this.operators;
    }

    findOperatorById(id) {
        return this.operators.find(o => o.id === id);
    }

    /**
    maxOperatorId() {
        return this.operators.reduce((maxId, operator) => Math.max(maxId, operator.operatorId), 0);
    }
    */

}