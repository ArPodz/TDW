import { UserController } from "./controllers/UserController.js";
import { RegisterView } from "./views/RegisterView.js";
import { LoginView } from "./views/LoginView.js";
import { StorageRepo } from "./repositories/StorageRepo.js";

async function init() {
    console.log("🚀 LEYENDO APP1.JS...");

    const userController = new UserController();
    userController.users.persistence = new StorageRepo(localStorage, "app_v1");

    // 1. CARGA INICIAL DESDE JSON
    try {
        const currentUsers = userController.users.getUsers();
        if (currentUsers.length === 0) {
            console.log("📂 Cargando usuarios iniciales desde data.json...");
            const response = await fetch('data.json'); 
            const data = await response.json();
            for (const u of data.users) {
                await userController.users.addUser(u); 
            }
            console.log("✅ Carga inicial completada.");
        }
    } catch (e) {
        console.warn("⚠️ No se pudo cargar data.json.");
    }

    // --- LÓGICA DE REGISTRO ---
    const registerView = new RegisterView();
    // CAMBIO AQUÍ: Usamos .registerForm en vez de .formEl
    if (registerView.registerForm) { 
        console.log("🔗 CONECTANDO FORMULARIO DE REGISTRO...");
        registerView.bindFormSubmit(async () => {
            const formData = registerView.getFormData();
            try {
                const user = await userController.registerUser(formData);
                registerView.setStatus(`¡Éxito! Usuario ${user.email} creado.`, false);
                registerView.clearForm();
                mostrarEstadoActual(userController);
            } catch (error) {
                registerView.setStatus(error.message, true);
            }
        });
    }

    // --- LÓGICA DE LOGIN ---
    const loginView = new LoginView();
    // CAMBIO AQUÍ: Usamos .loginForm en vez de .formEl
    if (loginView.loginForm) {
        console.log("🔗 CONECTANDO FORMULARIO DE LOGIN...");
        loginView.bindFormSubmit(async () => {
            const formData = loginView.getFormData();
            try {
                console.log("🔍 Intentando login para:", formData.email);
                const user = await userController.loginUser(formData);
                
                console.log("✅ LOGIN CORRECTO:", user);
                loginView.setStatus(`Bienvenido, ${user.email}.`, false);
                
                mostrarEstadoActual(userController);
            } catch (error) {
                console.error("❌ ERROR LOGIN:", error.message);
                loginView.setStatus(error.message, true);
            }
        });
    }

    mostrarEstadoActual(userController);
}

function mostrarEstadoActual(controller) {
    console.group("📊 ESTADO ACTUAL DE LA APP");
    console.log("👥 Lista Total de Usuarios:");
    console.table(controller.users.getUsers());

    const active = controller.activeSession.getUser();
    if (active) {
        console.log("🔑 Sesión Activa:", active);
    } else {
        console.log("🔑 Sesión Activa: NINGUNA (Invitado)");
    }
    console.groupEnd();
}

window.onload = () => {
    init().catch(err => console.error("Fallo crítico:", err));
};