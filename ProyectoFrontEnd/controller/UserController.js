import { UserFactory } from "../model/UserFactory.js";

export class UserController {
    constructor() {
        // Crear el Usuario del Singleton
        // tener el registro de usuarios
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

    login(email, password){
        if(this.validEmail(email) && this.validPassword(password)){
            if((email === "") && password === "admin123"){
                return new User(email, password, "GESTOR");
            } else {
                return new User(email, password, "PUBLICO");
            }
        }
    }

    createUser(email, password, rol){
        this.validEmail(email);
        this.validPassword(password);
        this.validRol(rol);

        const newUser = UserFactory(email, password, rol);
        // añadir el nuevo usuario a la base de datos o lista de usuarios
        return newUser;
    }
}

