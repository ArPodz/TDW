export class Booking {
    constructor(operationId, type, direction, origin, destination, scheduledTime, estimatedTime, state, operatorId, pointId) {
        this.operationId = operationId;
        this.type = type;
        this.direction = direction;
        this.origin = origin;
        this.destination = destination;
        this.scheduledTime = scheduledTime;
        this.estimatedTime = estimatedTime;
        this.state = state;
        this.operatorId = operatorId;
        this.pointId = pointId;
    }

    getOperationId() {
        return this.operationId;
    }

    setOperationId(operationId) {
        this.operationId = operationId;
    }  

    setEstimatedTime(estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    setState(state) {
        this.state = state;
    }   

    
}