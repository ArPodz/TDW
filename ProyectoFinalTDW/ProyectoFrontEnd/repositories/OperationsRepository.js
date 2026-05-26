import { ApiService } from "../services/ApiService.js";


export class OperationsRepository {
    constructor(api) {
        this.api = api;
        this.operations = [];
    }

    async initialize(defaultData = []) {
        try {
            const data = await this.api.get('operations');

            const raw = data?.operaciones ?? data ?? [];
            this.operations = raw.map(item => item.operacion ?? item);
            
        } catch (error) {
            this.operations = [];
            throw new Error("Error al inicializar repositorio de operaciones: " + error.message);
        }
    }

    async addOperation(operationData) {
        if(!this.uniqueCode(operationData.codigo)){
            throw new Error("El código de la operación ya existe");
        } 
        const data = await this.api.post('operations', {
            tipo: operationData.tipo,
            codigo: operationData.codigo,
            sentido: operationData.sentido,
            origen: operationData.origen,
            destino: operationData.destino,
            horaProgramada: operationData.horaProgramada,
            horaEstimada: operationData.horaEstimada,
            estado: operationData.estado,
            operadorId: operationData.operadorId,
            puntoId: operationData.puntoId
        });

        const created = data?.operacion ?? data;
        this.operations.push(created);

        return created;
    }

    async updateOperation(operacionId, updatedData) {
        const data = await this.api.put(`operations/${operacionId}`, updatedData);
        const updatedOperation = data?.operacion ?? data;


        const index = this.operations.findIndex(o => o.operacionId === operacionId);
        if (index !== -1) {
            this.operations[index] = updatedOperation;
        }

        return updatedOperation;
    }

    async deleteOperation(operationId) {
        await this.api.delete(`operations/${operationId}`);
        this.operations = this.operations.filter(o => o.operacionId !== operationId);
    }

    
    getOperations() {
        return this.operations;
    }

    findOperationByCode(code) {
        return this.operations.find(o => o.codigo === code);
    }

    uniqueCode(code) {
        return !this.operations.some(o => o.codigo === code);
    }

}