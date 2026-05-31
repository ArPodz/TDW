import { Application } from './core/Application.js';

document.addEventListener('DOMContentLoaded', async () => {
    new Application().init().catch(err => {
        console.error("Error al iniciar la aplicación:", err);
    });
});