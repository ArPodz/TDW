export class Usuario {
    constructor(email, password, rol){
        if(this.validarPassword(password) && this.validarEmail(email) && this.validarRol(rol));
        this.email = email;
        this.password = password;
        this.rol = rol;
    }

    setPassword(password){
        if(password.length() < 8){
            throw new Error("Password debe tener al menos 8 carácteres");
        } else if (!/\d/.test(password)){
            throw new Error("Password debe contener al menos un número");
        } else {
            this.password = password;
        }
    }

    setEmail(email){
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(regex.test(email)){
            this.email = email;
        } else {
            throw new Error("Email no valido");
        }
    }

    setRol(rol){
        const rolMayusculas = rol.trim().toUpperCase();

        if(rolMayusculas === "PUBLICO" || rolMayusculas === "GESTOR"){
            this.rol = rol;
        } else {
            throw new Error("Rol tiene que ser PUBLICO O GESTOR");
        }
    }

    login(email, password){
        if(this.email == email && this.password == password){
            return true;
        } else {
            throw new Error("Contraseña o usuario incorrecto");
        }
    }

}