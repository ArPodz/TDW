import { ulid } from 'ulid';

export class Reserva {
    constructor(operacionId, tipo, sentido, origen, destino, horaProgramada, horaEstimada, estado, operadorId, puntoId) {
        this.operacionId = operacionId;
        this.tipo = tipo;
        this.sentido = sentido;
        this.origen = origen;
        this.destino = destino;
        this.horaProgramada = horaProgramada;
        this.horaEstimada = horaEstimada;
        this.estado = estado;
        this.operadorId = operadorId;
        this.puntoId = puntoId;
    }
}