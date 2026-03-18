import { UserFactory } from "../model/UserFactory.js";
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
        const rolMayusculas = rol.trim().toUpperCase();

        if(rolMayusculas === "PUBLICO" || rolMayusculas === "GESTOR"){
            return true;
        } else {
            throw new Error("Rol tiene que ser PUBLICO O GESTOR");
        }
    }


    createUser(email, password, rol){
        this.validEmail(email);
        this.validPassword(password);
        this.validRol(rol);

        const newUser = UserFactory(email, password, rol);
        this.users.addUser(newUser);
        return newUser;
    }
}

