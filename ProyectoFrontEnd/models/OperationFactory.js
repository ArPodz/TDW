import { Operation } from "./Operation.js";
import { ulid } from "ulid";

export function OperationFactory(type, code, direction, origin, destination, scheduledTime, estimatedTime, state, operatorId, pointId) {
    let operationId = ulid();
    return new Operation(operationId, type, code, direction, origin, destination, scheduledTime, estimatedTime, state, operatorId, pointId);
}   
