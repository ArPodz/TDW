export class Operador {
    static cont = 1;

    constructor(operadorId, nombre, siglas, color, urlicono) {
        this.operadorId = Operador.cont++;
        this.nombre = nombre;
        this.siglas = siglas;
        this.color = color;
        this.urlicono = urlicono;
    }
}