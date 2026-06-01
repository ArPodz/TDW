export class UserValidator {

    static validPassword(password){
        if(password.length < 8){
            throw new Error("Password debe tener al menos 8 carácteres");
        } else if (!/\d/.test(password)){
            throw new Error("Password debe contener al menos un número");
        } else {
            return true;
        }
    }

    static validEmail(email){
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(regex.test(email)){
            return true;
        } else {
            throw new Error("Email no valido");
        }
    }

    static validRol(rol){
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
}