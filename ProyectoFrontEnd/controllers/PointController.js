import { Point } from "../models/Point.js";
import { PointFactory } from "../models/PointFactory.js";
import { PointsRepository } from "../models/PointsRepository.js";

export class PointController {
    constructor(persistence) {
        this.points = new PointsRepository(persistence);
    }

    validCode(code) {
        const codeRegex = /^[a-zA-Z0-9][\sáéíóúÁÉÍÓÚa-zA-Z0-9-]{1,11}$/;

        if (!codeRegex.test(code)) {
            throw new Error("El código debe tener entre 2 y 12 caracteres y no contener símbolos especiales (excepto guiones).");
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

    async createPoint(data) {
        if(this.validCode(data.code) && this.validType(data.type)){
            if(this.points.uniqueCode(data.code)){
                let pointId = this.points.maxPointId() + 1;
                const newPoint = PointFactory(pointId, data.type, data.code);
                await this.points.addPoint(newPoint);
            } else {
                throw new Error("El código del punto ya está en uso");
            }
        } else {
            throw new Error("Datos del punto no válidos");
        }
    }

    async deletePoint(pointId) {
        await this.points.deletePoint(pointId);
    }

    async updatePoint(pointId, updatedData) {
        const existingPoint = this.points.getPoints().find(p => p.pointId === pointId);
        if (!existingPoint) {
            throw new Error("Punto no encontrado");
        }
        const updatedPoint = {
            ...existingPoint,
            ...updatedData,
            code: this.validCode(updatedData.code || existingPoint.code),
            type: this.validType(updatedData.type || existingPoint.type)
        };
        await this.points.updatePoit(updatedPoint);
    }

}