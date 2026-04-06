export class PointsRepository {
    constructor(persistence) {
        this.persistence = persistence; 
        this.points = [];
    }

    async initialize(defaultData = []) {
        try {
            const data = await this.persistence.load();
            
            const list = (data && data.points) ? data.points : (Array.isArray(data) ? data : []);
            this.points = list;
            
            if (this.points.length === 0 && defaultData.length > 0) {
                this.points = defaultData;
                await this.persistence.save({ points: this.points });
                return true;
            }
        } catch (error) {
            this.points = defaultData;
            throw new Error("Error al inicializar repositorio de puntos: " + error.message);
        }
    }

    async addPoint(point) {
        if(this.findPointByCode(point.code)){
            throw new Error("El punto ya está registrado");
        }
        this.points.push(point);
        await this.persistence.save({ points: this.points });
    }

    getPoints() {
        return this.points;
    }

    findPointByCode(code) {
        return this.points.find(p => p.code === code);
    }

    uniqueCode(code) {
        return !this.points.some(p => p.code === code);
    }

    maxPointId() {
        return this.points.reduce((maxId, point) => Math.max(maxId, point.pointId), 0);
    }

}

