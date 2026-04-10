export class Operator {
    static cont = 1;

    constructor(operatorId, name, acronym, color, urlIcono) {
        this.operatorId = operatorId;
        this.name = name;
        this.acronym = acronym;
        this.color = color;
        this.urlIcono = urlIcono;
    }

    getName() {
        return this.name;
    }

    getAcronym() {
        return this.acronym;
    }

    getColor() {
        return this.color;
    }

    getUrlIcono() {
        return this.urlIcono;
    }
}