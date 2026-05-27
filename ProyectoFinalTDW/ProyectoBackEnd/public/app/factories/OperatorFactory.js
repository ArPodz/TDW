import { Operator } from "../models/Operator.js";

export function OperatorFactory(operatorId, name, acronym, color, urlIcono) {
    return new Operator(operatorId, name, acronym, color, urlIcono);
}