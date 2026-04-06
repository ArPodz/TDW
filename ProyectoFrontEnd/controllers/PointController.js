import { Point } from "../models/Point";
import { PointFactory } from "../models/PointFactory.js";
import { PointsRepository } from "../models/PointsRepository.js";

export class PointController {
    constructor() {
        this.points = new PointsRepository();
    }

    validCode(code) {
        const codeRegex = /^[A-Z0-9]{6}$/;
        return codeRegex.test(code);
    }

    async createPoint(data) {
        if(this.validCode(data.code)){
            const newPoint = PointFactory(data.pointId, data.type, data.code);
            await this.points.addPoint(newPoint);
        } else {
            throw new Error("Datos de punto no válidos");
        }
    }
}