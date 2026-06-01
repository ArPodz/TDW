// import { UserFactory } from "../factories/UserFactory.js";
import { UsersRepository } from "../repositories/UsersRepository.js";
import { getSessionInstance } from "../models/Session.js";
import { UserValidator } from "../core/UserValidator.js";

export class UserController {

    constructor(api) {
        this.activeSession = getSessionInstance();
        this.users = new UsersRepository(api);
    }


    async registerUser(data) {
        if (data.password !== data.confirmPassword) {
            throw new Error("Las contraseñas no coinciden");
        }

        UserValidator.validEmail(data.email);
        UserValidator.validPassword(data.password);

        const exists = await this.users.emailExists(data.email);
        if (exists) {
            throw new Error("El usuario ya está registrado");
        }

        return await this.users.addUser({
            email: data.email,
            password: data.password,
        });
    }
    
    async checkEmailExists(email) {
        return await this.users.emailExists(email);
    }
    

    async loginUser(data){
        UserValidator.validEmail(data.email);
        UserValidator.validPassword(data.password);

        await this.users.api.login(data.email, data.password);

        return this.activeSession.getUser();
    }

    async logoutUser(){
        this.users.api.logout();
    }


    async updateUserRol(userId, newRol){
        const normalizedRol = UserValidator.validRol(newRol);

        this.validLastGestor(userId, normalizedRol);
 
        await this.users.updateUser(userId, {role: normalizedRol});
    }

    async updateUser(userId, fields){
        if(fields.email){
            UserValidator.validEmail(fields.email);
        }
        if(fields.password){
            UserValidator.validPassword(fields.password);
        }
        if(fields.role){
            fields.role = UserValidator.validRol(fields.role);
        }

        return await this.users.updateUser(userId, fields);
    }

    
    async deleteUser(userId){
        await this.users.deleteUser(userId);
    }

    async initialize() {
        await this.users.initialize();
    }

    getUsersList() {
        return [...this.users.getUsers()];
    }

    validLastGestor(userId, newRol) {
        if (newRol !== 'GESTOR') {
            const gestores = this.users.getUsers().filter(u => u.role === 'GESTOR');
            const isCurrentlyGestor = gestores.some(u => u.id === userId); 
            if (isCurrentlyGestor && gestores.length <= 1) {
                throw new Error('No se puede cambiar el rol: debe existir al menos un GESTOR.');
            }
        }
    }

    async getUserById(userId) {
        const data = await this.users.api.get(`users/${userId}`);
        return data?.user ?? data;
    }
}



