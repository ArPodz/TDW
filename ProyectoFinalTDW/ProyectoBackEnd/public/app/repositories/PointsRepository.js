import { ApiService } from "../services/ApiService.js";


export class PointsRepository {

    constructor(api) {
        this.api = api;
        this.spots = [];
    }

    async initialize(defaultData = []) {
        try {
            const data = await this.api.get('spots');

            const raw = data?.puntos ?? data ?? [];
            this.spots = raw.map(item => item.punto ?? item);
        } catch (error) {
            this.spots = [];
            console.warn("Error al inicializar repositorio de puntos: " + error.message);
        }
    }

    async addPoint(spotData) {
        if(!this.uniqueCode(spotData.codigo)){
            throw new Error("El punto ya está registrado");
        }
        const data = await this.api.post('spots', {
            tipo: spotData.tipo,
            codigo: spotData.codigo,
        });

        const created = data?.punto ?? data;
        this.spots.push(created);

        return created;
    }

    async deletePoint(id) {
        await this.api.delete(`spots/${id}`);
        this.spots = this.spots.filter(p => p.puntoId !== id);
    }

    async updatePoint(id, updatedData) {
        if(updatedData.codigo) {
            const existing = this.findPointByCode(updatedData.codigo);
            if (existing && existing.puntoId !== id) {
                throw new Error("El código ya está registrado para otro punto");
            }
        }        
        const data = await this.api.put(`spots/${id}`, updatedData);
        const updatedPoint = data?.punto ?? data;

        const index = this.spots.findIndex(p => p.puntoId === id);
        if (index !== -1) {
            this.spots[index] = updatedPoint;
        } else {
            throw new Error("Punto " + id + " no encontrado");
        }

        return updatedPoint;
    }

    getPoints() {
        return this.spots;
    }

    findPointByCode(code) {
        return this.spots.find(p => p.codigo === code);
    }

    uniqueCode(code) {
        return !this.spots.some(p => p.codigo === code);
    }

    /** 
    maxPointId() {
        return this.points.reduce((maxId, point) => Math.max(maxId, point.pointId), 0);
    }
    */

}

