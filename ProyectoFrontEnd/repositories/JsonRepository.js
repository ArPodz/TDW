export class JsonRepository {
  constructor(url = "../data.json") { 
    this.url = url; 
}

    async load() {
        const res = await fetch(this.url);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
    }

    async save(list) {
        const json = JSON.stringify(list, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "items.saved.json";
        a.click();
        URL.revokeObjectURL(a.href);
    }
}
