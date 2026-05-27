// import { OperationFactory } from "../factories/OperationFactory.js";
import { OperationsRepository } from "../repositories/OperationsRepository.js";

export class OperationController {

    constructor(api) {
        this.operations = new OperationsRepository(api);
    }

    validType(type) {
        const normalizedType = type.trim().toUpperCase();

        if (normalizedType === "VUELO" || normalizedType === "TREN") {
            return normalizedType;
        } else {
            throw new Error("El tipo de reserva debe ser 'VUELO' o 'TREN'");
        }
    }

    validDirection(direction) {
        const normalizedDirection = direction.trim().toUpperCase();

        if (normalizedDirection === "SALIDA" || normalizedDirection === "LLEGADA") {
            return normalizedDirection;
        } else {
            throw new Error("El tipo de sentido debe ser 'SALIDA' o 'LLEGADA'");
        }
    }

    validState(state) {
        const normalizedState = state.trim().toUpperCase();
        const validStates = ["PROGRAMADO", "EMBARCANDO", "RETRASADO", "EN_RUTA", "CANCELADO", "LLEGADO"];

        if (validStates.includes(normalizedState)) {
            return normalizedState;
        } else {
            throw new Error(`El estado de la operación debe ser uno de: ${validStates.join(", ")}`);
        }
    }


    async initialize() {
        await this.operations.initialize();
    }

    async createOperation(data) {
        const payload = {
            tipo: this.validType(data.type),
            codigo: data.codigo,
            sentido: this.validDirection(data.direction),
            origen: data.origen,
            destino: data.destino,
            horaProgramada: data.horaProgramada,
            horaEstimada: data.horaEstimada,
            estado: this.validState(data.state),
            operadorId: data.operadorId,
            puntoId: data.puntoId
        };

        return await this.operations.addOperation(payload);
    }

    async deleteOperation(operationId) {
        await this.operations.deleteOperation(operationId);
    }

    async updateOperation(operationId, updatedData) {
        const existingOperation = this.operations.getOperations().find(op => op.operacionId === operationId);

        if (!existingOperation) {
            throw new Error("Operación no encontrada");
        }

        const payload = { ...updatedData };

        if(payload.tipo){
            payload.tipo = this.validType(updatedData.tipo);
        }
        if(payload.sentido){
            payload.sentido = this.validDirection(updatedData.sentido);
        }
        if(payload.estado){
            payload.estado = this.validState(updatedData.estado);
        }

        return await this.operations.updateOperation(operacionId, payload);
    }

    getOperationsList() {
        return [...this.operations.getOperations()];
    }

    findOperationByCode(code) {
        return this.operations.findOperationByCode(code);
    }
    
}
