//import { PointFactory } from "../factories/PointFactory.js";
import { PointsRepository } from "../repositories/PointsRepository.js";


export class PointController {

    constructor(api) {
        this.spots = new PointsRepository(api);
    }

    validCode(code) {
        const codeRegex = /^[a-zA-Z0-9][\sáéíóúÁÉÍÓÚa-zA-Z0-9-]{1,17}$/;

        if (!codeRegex.test(code)) {
            throw new Error("El código debe tener entre 2 y 18 caracteres y no contener símbolos especiales (excepto guiones).");
        }
        return code.trim();
    }

    validType(type) {
        const normalizedType = type.trim().toUpperCase();

        if (normalizedType === "PUERTA" || normalizedType === "VIA") {
            return normalizedType;
        } else {
            throw new Error("El tipo de punto debe ser 'PUERTA' o 'VIA'");
        }
    }


    async initialize() {
        await this.spots.initialize();
    }

    async createPoint(data) {
        const validatedCode = this.validCode(data.codigo);
        const validatedType = this.validType(data.tipo);

        return await this.spots.addPoint({
            tipo: validatedType,
            codigo: validatedCode
        });
    }

    async deletePoint(pointId) {
        await this.spots.deletePoint(pointId);
    }

    async updatePoint(pointId, updatedData) {
        const existingPoint = this.spots.getPoints().find(p => p.puntoId === pointId);

        if (!existingPoint) {
            throw new Error("Punto no encontrado");
        }

        const payload = {};

        if(updatedData.codigo){
            payload.codigo = this.validCode(updatedData.codigo);
        }

        if(updatedData.tipo){
            payload.tipo = this.validType(updatedData.tipo);
        }

        return await this.spots.updatePoint(pointId, payload);
    }

    getPointsList(){
        return [...this.spots.getPoints()];
    }

    findPointByCode(code) {
        return this.spots.findPointByCode(code);
    }
}