import { Operation } from "../models/Operation.js";
import { OperationFactory } from "../models/OperationFactory.js";
import { OperationsRepository } from "../models/OperationsRepository.js";

export class OperationController {
    constructor(persistence) {
        this.operations = new OperationsRepository(persistence);
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

    async createOperation(data) {
        if(this.validType(data.type) && this.validDirection(data.direction) && this.validState(data.state)){
            if(this.operations.uniqueCode(data.code)){
                const newOperation = OperationFactory(data.type, data.code, data.direction, data.origin, data.destination, data.scheduledTime, data.estimatedTime, data.state, data.operatorId, data.pointId);
                await this.operations.addOperation(newOperation);
            } else {
                throw new Error("El código de la operación ya está en uso");
            }
        } else {
            throw new Error("Datos de la operación no válidos");
        }
    }

    async deleteOperation(operationId) {
        await this.operations.deleteOperation(operationId);
    }

    async updateOperation(operationId, updatedData) {
        const existingOperation = this.operations.getOperations().find(op => op.operationId === operationId);
        if (!existingOperation) {
            throw new Error("Operación no encontrada");
        }
        const updatedOperation = {
            ...existingOperation,
            ...updatedData, 
            type: this.validType(updatedData.type || existingOperation.type),
            direction: this.validDirection(updatedData.direction || existingOperation.direction),
            state: this.validState(updatedData.state || existingOperation.state)
        };
        await this.operations.updateOperation(updatedOperation);
    }

    getOperationsList() {
        return [...this.operations.getOperations()];
    }

}
