import { Operator } from "./Operator.js";

export function OperatorFactory(operatorId, name, acronyms, color, urlIcono) {
    return new Operator(operatorId, name, acronyms, color, urlIcono);
}