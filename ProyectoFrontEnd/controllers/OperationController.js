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

        if (normalizedState === "PROGRAMADO" || normalizedState === "EMBARCANDO" || normalizedState === "RETRASADO" || normalizedState === "EN_RUTA" || normalizedState === "CANCELADO" || normalizedState === "LLEGADO") {
            return normalizedState;
        } else {
            throw new Error("El estado de la reserva debe ser 'PROGRAMADO', 'EMBARCANDO', 'RETRASADO', 'EN_RUTA', 'CANCELADO' o 'LLEGADO'");
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




}
