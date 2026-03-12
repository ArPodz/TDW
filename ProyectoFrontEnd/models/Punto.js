export class Punto {
    constructor(puntoId, tipo, codigo) {
        this.puntoId = puntoId;
        this.tipo = tipo;
        this.codigo = codigo;
    }

    validarTipo(tipo){
        const tipoMayuscula = tipo.trim().toUpperCase();

        if(tipoMayuscula === "PUERTA" || tipoMayuscula === "VIA"){
            return true;
        } else {
            throw new Error("Tipo de Punto incorrecto");
        }
    }
}