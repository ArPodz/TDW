import { UserController } from "./controllers/UserController.js";
import { RegisterView } from "./views/RegisterView.js";
import { StorageRepo } from "./repositories/StorageRepo.js";
import { JsonRepository } from "./repositories/JsonRepository.js";

// --- FUNCIÓN DE SEGURIDAD ---
function escapeHTML(s) {
    return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}



async function init() {
    console.log("🚀 LEYENDO APP1.JS...");

    const userController = new UserController();
    const registerView = new RegisterView();
    
    // Conectamos persistencia
    userController.users.persistence = new StorageRepo(localStorage, "app_v1");

    // 1. CONECTAR FORMULARIO PRIMERO (Para que funcione sí o sí)
    if (registerView.registerForm) {
        console.log("🔗 CONECTANDO FORMULARIO...");
        
        registerView.bindFormSubmit(async () => {
            console.log("🔘 ¡BOTÓN PULSADO!"); // ESTO DEBE SALIR AL CLICAR
            
            const formData = registerView.getFormData();
            try {
                const user = await userController.registerUser(formData);
                registerView.setStatus(`¡Éxito! Usuario ${user.email} creado.`, false);
                registerView.clearForm();
                
                console.log("✅ NUEVA LISTA DE USUARIOS:");
                console.table(userController.users.getUsers());
            } catch (error) {
                console.error("❌ ERROR AL REGISTRAR:", error.message);
                registerView.setStatus(error.message, true);
            }
        });
        console.log("✅ CABLE CONECTADO.");
    }

    // 2. LANZAR TESTS AL FINAL
    try {
        await runningTests(userController);
    } catch (e) {
        console.warn("⚠️ Error en los tests automáticos.");
    }
}

// ARRANQUE SEGURO
window.onload = () => {
    init().catch(err => console.error("Fallo crítico en init:", err));
};