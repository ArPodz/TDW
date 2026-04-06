import { Operator } from "./Operator.js";

export function OperatorFactory(name, acronyms, color, urlIcono) {
    return new Operator(name, acronyms, color, urlIcono);
}