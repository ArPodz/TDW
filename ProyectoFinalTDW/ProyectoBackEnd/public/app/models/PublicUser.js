import { User } from "./User.js";

export class PublicUser extends User {
    constructor(email, password, rol){
        super(email, password, rol);
    }
}