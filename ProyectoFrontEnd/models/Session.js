export class Session {
    static instance;

    constructor() {
    } 

    static getSessionInstance(){
        if (!Session.instance) {
            Session.instance = new Session();
        }
        return Session.instance;
    }
}
