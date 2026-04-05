import { UserController } from "./controllers/UserController.js";
import { RegisterView } from "./views/RegisterView.js";
import { LoginView } from "./views/LoginView.js";
import { StorageRepo } from "./repositories/StorageRepo.js";
import { SessionView } from "./views/SessionView.js"; 
import { UserManagementView } from "./views/UserManagementView.js";

async function init() {
    console.log("🚀 INICIALIZANDO APLICACIÓN...");

    const userController = new UserController();
    
    // 1. VINCULAR PERSISTENCIA
    userController.users.persistence = new StorageRepo(localStorage, "app_v1");

    // 2. CARGA DE DATOS (SEED + LOCALSTORAGE)
    try {
        const response = await fetch('usersData.json'); 
        const data = await response.json();
        // Cargamos los usuarios iniciales si el storage está vacío
        await userController.users.initialize(data.users);
        console.log("✅ Repositorio de usuarios listo.");
    } catch (e) {
        console.warn("⚠️ Error al cargar semilla inicial:", e.message);
    }

    // --- LÓGICA DE SESIÓN (LOGIN/LOGOUT DINÁMICO) ---
    const actualizarInterfazSesion = () => {
        const activeUser = userController.activeSession.getUser();
        
        if (activeUser) {
            // Pasamos el email y la función de logout
            SessionView.renderSession(activeUser.email, (e) => {
                e.preventDefault();
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

    // --- LÓGICA DE GESTIÓN DE USUARIOS (SOLO EN USERS.HTML) ---
    const userManagementView = new UserManagementView();
    
    // Verificamos si existe el contenedor de la tabla en el HTML actual
    if (userManagementView.container) {
        const activeUser = userController.activeSession.getUser();

        // SEGURIDAD: Bloqueo si no es GESTOR
        if (!activeUser || activeUser.rol !== 'GESTOR') {
            alert("Acceso denegado. Se requiere rol de GESTOR.");
            window.location.href = "index.html";
            return;
        }

        // Definimos qué pasa cuando se cambia un rol
        const handleRoleChange = async (email, newRole) => {
            try {
                // Importante: updateUserRol ahora es ASYNC para guardar en Storage
                await userController.updateUserRol(email, newRole);
                
                // Actualizamos la tabla con la lista fresca del controlador
                const updatedUsers = userController.getUsersList();
                userManagementView.updateTable(updatedUsers, handleRoleChange);
                
                userManagementView.setStatus(`Usuario ${email} actualizado a ${newRole} con éxito.`);
            } catch (error) {
                userManagementView.setStatus(error.message, true);
            }
        };

        // Renderizado inicial de la tabla
        userManagementView.render(userController.getUsersList(), handleRoleChange);
    }

    // Sincronizar UI al cargar (Login/Logout del menú)
    actualizarInterfazSesion();
    mostrarEstadoActual(userController);
}

/**
 * Muestra información de depuración en la consola
 */
function mostrarEstadoActual(controller) {
    console.group("📊 ESTADO DE LA APP");
    const users = controller.getUsersList();
    console.table(users);
    const active = controller.activeSession.getUser();
    console.log(active ? `🔑 Usuario activo: ${active.email} [${active.rol}]` : "🔑 No hay sesión iniciada");
    console.groupEnd();
}

// Arrancar la aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
    init().catch(err => console.error("Fallo crítico en el arranque:", err));
});