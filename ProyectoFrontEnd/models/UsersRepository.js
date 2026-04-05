export class UsersRepository {
    constructor(persistence) {
        this.persistence = persistence; // Objeto de persistencia (JsonRepository)
        this.users = []; // Array para almacenar los usuarios en memoria
    }

    async initialize(defaultData = []) {
        try {
            const data = await this.persistence.load();
            
            // Ajuste para leer la estructura { users: [...] } de tu consola
            // Si data.users existe, lo usamos; si no, vemos si data ya es un array
            const list = (data && data.users) ? data.users : (Array.isArray(data) ? data : []);
            this.users = list;
            
            // Si el LocalStorage está vacío, cargamos la semilla (Seed) 
            if (this.users.length === 0 && defaultData.length > 0) {
                console.log("📦 El storage estaba vacío. Guardando semilla inicial...");
                this.users = defaultData;
                await this.persistence.save(this.users); // Aquí es donde se escribe en Application
            }
        } catch (error) {
            console.error("Error al inicializar repositorio:", error);
            this.users = defaultData; 
        }
    }

    async addUser(user) {
        this.users.push(user);
        await this.persistence.save(this.users);
    }

    getUsers() {
        return this.users;
    }

    findUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }

    updateRolPossible(email, newRol) {
        const user = this.findUserByEmail(email);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if(user.rol === "GESTOR" && newRol === "PUBLICO"){
            const numGestores = this.users.filter(u => u.rol === "GESTOR").length;
            if(numGestores <= 1){
                throw new Error("No se puede cambiar el rol. Al menos debe haber un gestor.");
            } else {
                return true;
            }
        }
    }

    async updateRol(email, newUserRol) {
        const index = this.users.findIndex(u => u.email === email);
        if (index !== -1) {
            this.users[index] = newUserRol;
            await this.persistence.save(this.users);
        }
    }
}

