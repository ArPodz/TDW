import { PublicUser } from "./PublicUser";
import { ManageUser } from "./ManageUser";

export function UserFactory(email, password, rol){
    switch(rol){
        case "PUBLICO":
            return new PublicUser(email, password, rol);
        case "GESTOR":
            return new ManageUser(email, password, rol);
        default:
            throw new Error("Rol no valido");
    }
}