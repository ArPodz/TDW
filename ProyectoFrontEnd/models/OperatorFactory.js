import { Operator } from "./Operator.js";

export function OperatorFactory(operatorId, name, acronym, color, urlIcono) {
    return new Operator(operatorId, name, acronym, color, urlIcono);
}