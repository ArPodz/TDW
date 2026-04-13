import { Point } from "../models/Point.js";

export function PointFactory(pointId, type, code) {
    return new Point(pointId, type, code);
}