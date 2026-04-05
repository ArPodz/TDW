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
                console.log("📦 El storage estaba vacío. Guardando semilla inicial...");
                this.points = defaultData;
                await this.persistence.save(this.points); // Aquí es donde se escribe en Application
            }
        } catch (error) {
            console.error("Error al inicializar repositorio:", error);
            this.points = defaultData; 
        }
    }

    async addPoint(point) {
        this.points.push(point);
        await this.persistence.save(this.points);
    }

    getPoints() {
        return this.points;
    }

    findPointByCode(code) {
        return this.points.find(p => p.code === code);
    }


}

