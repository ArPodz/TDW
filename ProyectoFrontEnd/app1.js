import { UserController } from "./controllers/UserController.js";
import { RegisterView } from "./views/RegisterView.js";
import { LoginView } from "./views/LoginView.js";
import { StorageRepo } from "./repositories/StorageRepo.js";
// Importamos la vista de sesión que creamos
import { SessionView } from "./views/SessionView.js"; 

async function init() {
    console.log("🚀 LEYENDO APP1.JS...");

    const userController = new UserController();
    
    // 1. VINCULAR PERSISTENCIA
    userController.users.persistence = new StorageRepo(localStorage, "app_v1");

    // 2. CARGA DE DATOS (SEED + LOCALSTORAGE)
    try {
        const response = await fetch('data.json'); 
        const data = await response.json();
        await userController.users.initialize(data.users);
        console.log("✅ Datos cargados correctamente.");
    } catch (e) {
        console.warn("⚠️ Error al inicializar datos:", e.message);
    }

    // --- LÓGICA DE SESIÓN (LOGIN/LOGOUT DINÁMICO) ---
    // Esta función conecta el Controlador con la SessionView
    const actualizarInterfazSesion = () => {
        const activeUser = userController.activeSession.getUser();
        
        if (activeUser) {
            // Si hay usuario, renderizamos Logout y pasamos la lógica de cierre
            SessionView.renderSession(activeUser.email, (e) => {
                e.preventDefault();
                userController.activeSession.logout(); // Asumo que tu controller tiene este método
                window.location.reload(); 
            });
        } else {
            // Si no hay usuario, mostramos el link de Login
            SessionView.renderGuest();
        }
    };

    // --- LÓGICA DE REGISTRO ---
    const registerView = new RegisterView();
    if (registerView.registerForm) { 
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
    if (loginView.loginForm) {
        loginView.bindFormSubmit(async () => {
            const formData = loginView.getFormData();
            try {
                const user = await userController.loginUser(formData);
                console.log("✅ LOGIN CORRECTO:", user);
                
                // Actualizamos la interfaz de sesión inmediatamente tras el login
                actualizarInterfazSesion();
                
                loginView.setStatus(`Bienvenido, ${user.email}.`, false);
                mostrarEstadoActual(userController);
            } catch (error) {
                loginView.setStatus(error.message, true);
            }
        });
    }

    // Al arrancar, ejecutamos la actualización por primera vez
    actualizarInterfazSesion();
    mostrarEstadoActual(userController);
}

function mostrarEstadoActual(controller) {
    console.group("📊 ESTADO ACTUAL DE LA APP");
    console.table(controller.users.getUsers());
    const active = controller.activeSession.getUser();
    console.log(active ? "🔑 Sesión Activa:" : "🔑 Sesión Activa: NINGUNA", active || "");
    console.groupEnd();
}

window.onload = () => {
    init().catch(err => console.error("Fallo crítico:", err));
};