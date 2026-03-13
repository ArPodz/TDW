export class ManageUser extends User(){
    constructor(email, password, rol){
        super(email, password, rol);
    }


    showUsers(){
        
    }

    changeRol(user, rol){
        user.rol = rol;
    }
}   
