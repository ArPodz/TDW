import { ApiService } from "../services/ApiService.js";
import { getSessionInstance } from "../models/Session.js";

export class UsersRepository {

    constructor(api) {
        this.api = api; 
        this.users = []; 
    }

    async initialize() {
        const user = getSessionInstance().getUser();

        if(!user || user.rol !== "GESTOR"){
            this.users = [];
            return;
        }

        try {
            const data = await this.api.get('users');

            const raw = data?.users ?? [];
            this.users = raw.map(item => item.user ?? item);
        } catch (error) {
            this.users = []; 
            throw new Error("Error al inicializar repositorio de usuarios: " + error.message);
        }
    }

    async addUser(user) {
        const data = await this.api.post('users', {
            email: user.email,
            password: user.password
        }, false);

        const createdUser = data?.user ?? data;
        this.users.push(createdUser);

        return createdUser;
    }


    async emailExists(email) {
        try {
            await this.api.get(`users/email/${encodeURIComponent(email)}`, false);
            return true;
        } catch (error) {
            if(error.message.includes('Recurso no encontrado')){
                return false;
            } else {
                throw error;
            }
        }
    }
 

    async updateUser(id, fields){
        const data = await this.api.put(`users/${id}`, fields);
        const updatedUser = data?.user ?? data;

        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
            this.users[index] = updatedUser;
        }

        return updatedUser;
    }

    async updateRol(email, newRol) {
        const user = this.findUserByEmail(email);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        await this.updateUser(user.id, {role: newRol});
    }

    updateRolPossible(email, newRol) {
        const user = this.findUserByEmail(email);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        if (user.role === 'GESTOR' && newRol !== 'GESTOR') {
            const numGestores = this.users.filter(u => u.role === 'GESTOR').length;
            if (numGestores <= 1) {
                throw new Error("No se puede cambiar el rol, debe existir al menos un GESTOR.");
            }
        }

        return true;
    }

    async deleteUser(id) {
        await this.api.delete(`users/${id}`);
        this.users = this.users.filter(u => u.id !== id);
    }

    async getUserById(userId) {
        const data = await this.api.get(`users/${userId}`);
        return data?.user ?? data;
    }

    getUsers() {
        return this.users;
    }

    findUserByEmail(email) {
        return this.users.find(u => u.email === email);
    }
}

