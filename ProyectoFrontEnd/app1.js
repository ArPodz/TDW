import { UserController } from "./controllers/UserController.js";
import { RegisterView } from "./views/RegisterView.js";
import { LoginView } from "./views/LoginView.js";
import { StorageRepo } from "./repositories/StorageRepo.js";
import { SessionView } from "./views/SessionView.js"; 
import { UserManagementView } from "./views/UserManagementView.js";

async function init() {
    console.log("🚀 INICIALIZANDO APLICACIÓN...");

    // 1. VINCULAR PERSISTENCIA (Inyectada al controlador)
    const persistence = new StorageRepo(localStorage, "app_v1");
    const userController = new UserController(persistence);

    // 2. CARGA DE DATOS (SEED + LOCALSTORAGE)
    try {
        const response = await fetch('usersData.json'); 
        const data = await response.json();
        await userController.users.initialize(data.users);
        console.log("✅ Repositorio de usuarios listo.");
    } catch (e) {
        console.warn("⚠️ Error al cargar semilla inicial:", e.message);
    }

    // --- LÓGICA DE SESIÓN (LOGIN/LOGOUT) ---
    const actualizarInterfazSesion = () => {
        const activeUser = userController.activeSession.getUser();
        
        if (activeUser) {
            // Quitamos el parámetro (e) y el preventDefault porque SessionView ya lo hace
            SessionView.renderSession(activeUser.email, activeUser.rol, () => {
                userController.activeSession.logout();
                console.log("👋 Sesión cerrada.");
                window.location.href = "index.html"; 
            });
        } else {
            SessionView.renderGuest();
        }
    };

    // --- LÓGICA DE REGISTRO ---
    const registerView = new RegisterView();
    if (registerView.registerForm) { 
        registerView.bindFormSubmit(async () => {
            const formData = registerView.getFormData();
            try {
                await userController.registerUser(formData);
                alert(`¡Registro con éxito! Ahora puedes iniciar sesión.`);
                window.location.href = "index.html"; 
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
                console.log("✅ Sesión iniciada:", user);
                window.location.href = "index.html"; 
            } catch (error) {
                loginView.setStatus(error.message, true);
            }
        });
    }

    // --- LÓGICA DE GESTIÓN DE USUARIOS ---
    const userManagementView = new UserManagementView();
    if (userManagementView.container) {
        const activeUser = userController.activeSession.getUser();

        if (!activeUser || activeUser.rol !== 'GESTOR') {
            alert("Acceso denegado. Se requiere rol de GESTOR.");
            window.location.href = "index.html";
            return;
        }

        const handleRoleChange = async (email, newRole) => {
            try {
                await userController.updateUserRol(email, newRole);
                userManagementView.updateTable(userController.getUsersList(), handleRoleChange);
                userManagementView.setStatus(`Usuario ${email} actualizado a ${newRole} con éxito.`);
            } catch (error) {
                userManagementView.setStatus(error.message, true);
            }
        };

        userManagementView.render(userController.getUsersList(), handleRoleChange);
    }

    actualizarInterfazSesion();
    mostrarEstadoActual(userController);
}

function mostrarEstadoActual(controller) {
    console.group("📊 ESTADO DE LA APP");
    console.table(controller.getUsersList());
    const active = controller.activeSession.getUser();
    console.log(active ? `🔑 Activo: ${active.email} [${active.rol}]` : "🔑 Sin sesión");
    console.groupEnd();
}

document.addEventListener("DOMContentLoaded", () => {
    init().catch(err => console.error("Fallo crítico:", err));
});