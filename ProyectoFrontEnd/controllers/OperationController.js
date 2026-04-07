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



}
