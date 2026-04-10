export class Operator {
    static cont = 1;

    constructor(operatorId, name, acronyms, color, urlIcono) {
        this.operatorId = operatorId;
        this.name = name;
        this.acronyms = acronyms;
        this.color = color;
        this.urlIcono = urlIcono;
    }

    getName() {
        return this.name;
    }

    getAcronyms() {
        return this.acronyms;
    }

    getColor() {
        return this.color;
    }

    getUrlIcono() {
        return this.urlIcono;
    }
}