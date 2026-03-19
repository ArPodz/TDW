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

    updateRol(email, rol){
        // const user = this.users.findUserByEmail(email);
        const rolMayusculas = rol.trim().toUpperCase();

        if(!user){
            throw new Error("Usuario no encontrado");
        }        
        
        if(user.rol === "GESTOR" && rolMayusculas === "PUBLICO"){
            const numGestores = this.users.getUsers().filter(u => u.rol === "GESTOR").length;
            if(numGestores <= 1){
                throw new Error("No se puede cambiar el rol. Al menos debe haber un gestor.");
            }
        }

        if(rolMayusculas === "PUBLICO" || rolMayusculas === "GESTOR"){
            return true;
            user.rol = rolMayusculas;
            this.users.updateUser(user);
        } else {
            throw new Error("Rol tiene que ser PUBLICO O GESTOR");
        }
    }
}


