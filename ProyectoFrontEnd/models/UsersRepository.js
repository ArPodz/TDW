export class UsersRepository {
    constructor(persistence) {
        this.persistence = persistence; 
        this.users = []; 
    }

    async initialize(defaultData = []) {
        try {
            const data = await this.persistence.load();
            
            const list = (data && data.users) ? data.users : (Array.isArray(data) ? data : []);
            this.users = list;
            
            if (this.users.length === 0 && defaultData.length > 0) {
                this.users = defaultData;
                await this.persistence.save({ users: this.users }); 
                return true;
            }
        } catch (error) {
            this.users = defaultData; 
            throw new Error("Error al inicializar repositorio de usuarios: " + error.message);
        }
    }

    async addUser(user) {
        if(this.findUserByEmail(user.email)){
            throw new Error("El usuario ya está registrado");
        }
        this.users.push(user);
        await this.persistence.save({ users: this.users });
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
        } else {
            return true;
        }
    }

    async updateRol(email, newUserRol) {
        const index = this.users.findIndex(u => u.email === email);
        if (index !== -1) {
            this.users[index] = newUserRol;
            await this.persistence.save({ users: this.users });
        }
    }
}

