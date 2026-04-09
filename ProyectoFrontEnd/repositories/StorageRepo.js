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

    /*
    async save(list) {
        this.storage.setItem(this.key, JSON.stringify(list, null, 2));
    }
    */

    async save(newData) {
        const currentRaw = this.storage.getItem(this.key);
        const currentData = currentRaw ? JSON.parse(currentRaw) : {};

        const updatedData = { ...currentData, ...newData };

        this.storage.setItem(this.key, JSON.stringify(updatedData, null, 2));
    }
}