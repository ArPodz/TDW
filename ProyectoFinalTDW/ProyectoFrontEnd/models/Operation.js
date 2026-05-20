export class Operation {
    constructor(operationId, type, code, direction, origin, destination, scheduledTime, estimatedTime, state, operatorId, pointId) {
        this.operationId = operationId;
        this.type = type;
        this.code = code;
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

    getType() {
        return this.type;
    }

    getDirection() {
        return this.direction;
    }   

    getOrigin() {  
        return this.origin;
    }

    getDestination() {
        return this.destination;
    }

    getScheduledTime() {
        return this.scheduledTime;
    }

    getEstimatedTime() { 
        return this.estimatedTime;
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