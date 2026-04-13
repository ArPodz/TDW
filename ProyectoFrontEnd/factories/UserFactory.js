import { PublicUser } from "../models/PublicUser.js";
import { ManagerUser } from "../models/ManagerUser.js";

export function UserFactory(email, password, rol){
    switch(rol){
        case "PUBLICO":
            return new PublicUser(email, password, rol);
        case "GESTOR":
            return new ManagerUser(email, password, rol);
        default:
            throw new Error("Rol no valido");
    }
}