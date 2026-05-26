// import { UserFactory } from "../factories/UserFactory.js";
import { UsersRepository } from "../repositories/UsersRepository.js";
import { getSessionInstance } from "../models/Session.js";

export class UserController {

    constructor(api) {
        this.activeSession = getSessionInstance();
        this.users = new UsersRepository(api);
    }

    validPassword(password){
        if(password.length < 8){
            throw new Error("Password debe tener al menos 8 carácteres");
        } else if (!/\d/.test(password)){
            throw new Error("Password debe contener al menos un número");
        } else {
            return true;
        }
    }

    validEmail(email){
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(regex.test(email)){
            return true;
        } else {
            throw new Error("Email no valido");
        }
    }

    validRol(rol){
        const auxRol = rol
        .trim()
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

        if(auxRol === "PUBLICO" || auxRol === "GESTOR" || auxRol === "INACTIVO"){
            return auxRol;
        } else {
            throw new Error("Rol tiene que ser PUBLICO, GESTOR O INACTIVO");
        }
    }


    async registerUser(data) {
        if (data.password !== data.confirmPassword) {
            throw new Error("Las contraseñas no coinciden");
        }

        this.validEmail(data.email);
        this.validPassword(data.password);

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
        this.validEmail(data.email);
        this.validPassword(data.password);

        await this.users.api.login(data.email, data.password);

        return this.activeSession.getUser();
    }

    async logoutUser(){
        this.users.api.logout();
    }


    async updateUserRol(userId, newRol){
        const normalizedRol = this.validRol(newRol);

        this.validLastGestor(userId, normalizedRol);
 
        await this.users.updateUser(userId, {role: normalizedRol});
    }

    async updateUser(userId, fields){
        if(fields.email){
            this.validEmail(fields.email);
        }
        if(fields.password){
            this.validPassword(fields.password);
        }
        if(fields.role){
            fields.role = this.validRol(fields.role);
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
}



