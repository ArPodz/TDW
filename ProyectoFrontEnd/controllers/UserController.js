import { UserFactory } from "../models/UserFactory.js";
import { UsersRepository } from "../models/UsersRepository.js";
import { Session } from "../models/Session.js";

export class UserController {
    constructor() {
        this.managerSession = Session.getSessionInstance();
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


    createUser(email, password, rol){
        this.validEmail(email);
        this.validPassword(password);
        const normalizedRol = this.validRol(rol);

        const newUser = UserFactory(email, password, normalizedRol);
        this.users.addUser(newUser);
        return newUser;
    }

    updateUserRol(email, newRol){
        try {
            const normalizedRol = this.validRol(newRol);
            this.users.updateRolPossible(email, normalizedRol);

            const oldUser = this.users.findUserByEmail(email);
            const updatedUser = UserFactory(oldUser.email, oldUser.password, normalizedRol);

            this.users.updateRol(email, updatedUser);
        } catch (error) {
            console.error("Error al actualizar el rol:", error.message);
            throw error;
        }
    }
}


