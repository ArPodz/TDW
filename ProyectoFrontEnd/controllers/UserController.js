import { UserFactory } from "../models/UserFactory.js";
import { UsersRepository } from "../models/UsersRepository.js";
import { getSessionInstance } from "../models/Session.js";
import { RegisterView } from "../views/RegisterView.js";


export class UserController {
    constructor() {
        this.activeSession = getSessionInstance();
        this.users = new UsersRepository();
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

        if(auxRol === "PUBLICO" || auxRol === "GESTOR"){
            return auxRol;
        } else {
            throw new Error("Rol tiene que ser PUBLICO O GESTOR");
        }
    }

    async registerUser(data) {
        if (data.password !== data.confirmPassword) {
            throw new Error("Las contraseñas no coinciden");
        }

        this.validEmail(data.email);
        this.validPassword(data.password);
        const normalizedRol = this.validRol(data.rol);

        const exists = this.users.getUsers().find(u => u.email === data.email);
        if (exists) throw new Error("El usuario ya está registrado");

        const newUser = UserFactory(data.email, data.password, normalizedRol);

        this.users.addUser(newUser);
        await this.users.persistence.save(this.users.getUsers());

        return newUser;
    }

    async loginUser(data){
        const user = this.users.findUserByEmail(data.email);
        
        if(!user){
            throw new Error("Usuario no encontrado");
        } else if (user.password !== data.password){
            throw new Error("Contraseña incorrecta");
        } else {
            this.activeSession.login(user);
            return user;
        }
    }

    async updateUserRol(email, newRol){
        try {
            const normalizedRol = this.validRol(newRol);
            this.users.updateRolPossible(email, normalizedRol);

            const oldUser = this.users.findUserByEmail(email);
            const updatedUser = UserFactory(oldUser.email, oldUser.password, normalizedRol);

            this.users.updateRol(email, updatedUser);

            await this.users.persistence.save(this.users.getUsers());
        } catch (error) {
            console.error("Error al actualizar el rol:", error.message);
            throw error;
        }
    }

    getUsersList(){
        return this.users.getUsers();
    }

    // FUNCIONES ANTIGUAS USADAS EN PRUEBAS, BORRAR DESPUES DE LAS PRUEBAS
    /*
    createUser(email, password, rol){
        this.validEmail(email);
        this.validPassword(password);
        const normalizedRol = this.validRol(rol);

        const newUser = UserFactory(email, password, normalizedRol);
        this.users.addUser(newUser);
        return newUser;
    }
    */
}


