import { UserController } from "./controllers/UserController.js";
import { RegisterView } from "./views/RegisterView.js";
import { LoginView } from "./views/LoginView.js";
import { StorageRepo } from "./repositories/StorageRepo.js";
import { SessionView } from "./views/SessionView.js"; 
import { UserManagementView } from "./views/UserManagementView.js";

// --- NUEVOS IMPORTS ---
import { OperationController } from "./controllers/OperationController.js";
import { OperatorController } from "./controllers/OperatorController.js";
import { PointController } from "./controllers/PointController.js";
import { OperationsView } from "./views/OperationsView.js";

async function init() {
    console.log("🚀 INICIALIZANDO APLICACIÓN...");

    // 1. VINCULAR PERSISTENCIA
    const persistence = new StorageRepo(localStorage, "app_v1");
    const userController = new UserController(persistence);
    
    // --- NUEVOS CONTROLADORES ---
    const operationController = new OperationController(persistence);
    const operatorController = new OperatorController(persistence);
    const pointController = new PointController(persistence);

    // 2. CARGA DE DATOS (SEED + LOCALSTORAGE)
    // Mantenemos tu bloque de usuarios intacto
    try {
        const response = await fetch('data/usersData.json'); 
        const data = await response.json();
        await userController.users.initialize(data.users);
        console.log("✅ Repositorio de usuarios listo.");
    } catch (e) {
        console.warn("⚠️ Error al cargar usuarios:", e.message);
    }

    // --- NUEVA CARGA DE DATOS (OPERACIONES, OPERADORES, PUNTOS) ---
    // Lo hacemos en bloques separados para que si uno falla, no afecte a los usuarios
    try {
        const resOps = await fetch('data/operationsData.json');
        const dataOps = await resOps.json();
        await operationController.operations.initialize(dataOps.operations);
        
        const resOperators = await fetch('data/operatorsData.json');
        const dataOperators = await resOperators.json();
        await operatorController.operators.initialize(dataOperators.operators);

        const resPoints = await fetch('data/pointsData.json');
        const dataPoints = await resPoints.json();
        await pointController.points.initialize(dataPoints.points);
        
        console.log("✅ Repositorios de gestión listos.");
    } catch (e) {
        console.warn("⚠️ Error al cargar datos de gestión:", e.message);
    }

    // --- LÓGICA DE SESIÓN (LOGIN/LOGOUT) ---
    const actualizarInterfazSesion = () => {
        const activeUser = userController.activeSession.getUser();
        if (activeUser) {
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

    // --- LÓGICA DE GESTIÓN (USUARIOS Y OPERACIONES) ---
    const userManagementView = new UserManagementView();
    const operationsContainer = document.getElementById('admin-operations-container');

    // Si existe el contenedor de usuarios o el de operaciones, verificamos rol
    if (userManagementView.container || operationsContainer) {
        const activeUser = userController.activeSession.getUser();

        if (!activeUser || activeUser.rol !== 'GESTOR') {
            alert("Acceso denegado. Se requiere rol de GESTOR.");
            window.location.href = "index.html";
            return;
        }

        // Si hay contenedor de usuarios, renderizamos usuarios
        if (userManagementView.container) {
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

        // --- NUEVA LÓGICA: RENDERIZAR OPERACIONES ---
        if (operationsContainer) {
            const operationsView = new OperationsView(operationController, 'admin-operations-container');
            operationsView.render();
        }
    }

    actualizarInterfazSesion();
    mostrarEstadoActual(userController, operationController, operatorController, pointController);
}


function mostrarEstadoActual(userController, operationController, operatorController, pointController) {
    console.group("📊 ESTADO DE LA APP");
    
    console.log("👥 USUARIOS:");
    console.table(userController.getUsersList());

    console.log("\n ---------------------------------------------------------------------- \n");
    
    console.log("✈️ OPERACIONES:");
    // Accedemos al repositorio de operaciones para obtener el array
    console.table(operationController.operations.getOperations());
    
    console.log("\n ---------------------------------------------------------------------- \n");

    console.log("👷 OPERADORES:");
    console.table(operatorController.operators.getOperators());
    
    console.log("\n ---------------------------------------------------------------------- \n");

    console.log("📍 PUNTOS:");
    console.table(pointController.points.getPoints());
    
    const active = userController.activeSession.getUser();
    console.log(active ? `🔑 Activo: ${active.email} [${active.rol}]` : "🔑 Sin sesión");
    
    console.groupEnd();
}

document.addEventListener("DOMContentLoaded", () => {
    init().catch(err => console.error("Fallo crítico:", err));
});