export class UsersRepository {
    constructor() {
        this.key = 'usuarios_proyecto'; // Nombre de la "llave" en el navegador
        this.users = this.loadFromStorage();
    }

    // Carga los datos desde el almacenamiento del navegador
    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : []; 
        } catch (error) {
            console.error("Error leyendo localStorage:", error);
            return [];
        }
    }

    // Guarda los datos en el navegador
    saveToStorage() {
        localStorage.setItem(this.key, JSON.stringify(this.users, null, 2));
    }

    addUser(user) {
        this.users.push(user);
        this.saveToStorage(); // Se guarda instantáneamente
    }

    getUsers() {
        return this.users;
    }

    findUserByEmail(email) {
        return this.users.find(u => u.email === email); // Corregido: u.email
    }
}