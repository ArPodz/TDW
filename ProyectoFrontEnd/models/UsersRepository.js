import fs from 'fs';

export class UsersRepository {
    constructor() {
        this.filePath = '../data.json';
        this.users = this.loadFromFile();
    }

    // Método privado para cargar los datos al iniciar
    loadFromFile() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf-8');
                return JSON.parse(data);
            }
            return []; // Si el archivo no existe, empezamos con lista vacía
        } catch (error) {
            console.error("Error leyendo data.json:", error);
            return [];
        }
    }

    // Guarda el estado actual de la lista en el archivo
    saveToFile() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.users, null, 2));
    }

    addUser(user) {
        this.users.push(user);
        this.saveToFile(); // Persistimos en el JSON
    }

    getUsers() {
        return this.users;
    }

    findUserByEmail(email) {
        return this.users.find(u => u.nombre === email);
    }
}