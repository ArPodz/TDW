export class StorageRepo {

constructor(storage, key) {
        this.storage = storage;
        this.key = key;
    }

    // Lee los datos del almacenamiento del navegador
    async load() {
        const raw = this.storage.getItem(this.key);
        return raw ? JSON.parse(raw) : [];
    }

    // Guarda la lista de objetos (usuarios, vuelos, etc.)
    async save(list) {
        this.storage.setItem(this.key, JSON.stringify(list, null, 2));
    }
}