import { User } from "./User.js";

export class ManageUser extends User {
    constructor(email, password, rol){
        super(email, password, rol);
    }

    showUsers(){
        for (const user of this.users.getUsers()) {
            console.log(`Email: ${user.email}, Rol: ${user.rol}`);
        }
    }

    updateRol(email, rol){
        const rolMayusculas = rol.trim().toUpperCase();    
        
        if(user.rol === "GESTOR" && rolMayusculas === "PUBLICO"){
            const numGestores = this.users.getUsers().filter(u => u.rol === "GESTOR").length;
            if(numGestores <= 1){
                throw new Error("No se puede cambiar el rol. Al menos debe haber un gestor.");
            }
        }

        if(rolMayusculas === "PUBLICO" || rolMayusculas === "GESTOR"){
            return true;
        } else {
            throw new Error("Rol tiene que ser PUBLICO O GESTOR");
        }
    }
}   
