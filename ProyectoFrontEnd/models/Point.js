export class Point {
    constructor(pointId, type, code) {
        this.pointId = pointId;
        this.type = type;
        this.code = code;
    }

    validType(type){
        const upperType = tipo.trim().toUpperCase();

        if(upperType === "PUERTA" || upperType === "VIA"){
            return true;
        } else {
            throw new Error("Tipo de Punto incorrecto");
        }
    }
}