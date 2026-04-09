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
    const operationController = new OperationController(persistence);
    const operatorController = new OperatorController(persistence);
    const pointController = new PointController(persistence);

    // 2. CARGA DE DATOS (Usuarios, Operaciones, etc.)
    try {
        const response = await fetch('data/usersData.json'); 
        const data = await response.json();
        await userController.users.initialize(data.users);
        
        const resOps = await fetch('data/operationsData.json');
        const dataOps = await resOps.json();
        await operationController.operations.initialize(dataOps.operations);
        
        const resOperators = await fetch('data/operatorsData.json');
        const dataOperators = await resOperators.json();
        await operatorController.operators.initialize(dataOperators.operators);

        const resPoints = await fetch('data/pointsData.json');
        const dataPoints = await resPoints.json();
        await pointController.points.initialize(dataPoints.points);
        
        console.log("✅ Repositorios listos.");
    } catch (e) {
        console.warn("⚠️ Error en carga de datos:", e.message);
    }

    // --- LÓGICA DE SESIÓN ---
    const actualizarInterfazSesion = () => {
        const activeUser = userController.activeSession.getUser();
        if (activeUser) {
            SessionView.renderSession(activeUser.email, activeUser.rol, () => {
                userController.activeSession.logout();
                window.location.href = "index.html"; 
            });
        } else {
            SessionView.renderGuest();
        }
    };

    // --- LÓGICA DE FORMULARIOS (LOGIN/REGISTER) ---
    const registerView = new RegisterView();
    if (registerView.registerForm) { 
        registerView.bindFormSubmit(async () => {
            try {
                await userController.registerUser(registerView.getFormData());
                alert(`¡Registro con éxito!`);
                window.location.href = "index.html"; 
            } catch (error) { registerView.setStatus(error.message, true); }
        });
    }

    const loginView = new LoginView();
    if (loginView.loginForm) {
        loginView.bindFormSubmit(async () => {
            try {
                await userController.loginUser(loginView.getFormData());
                window.location.href = "index.html"; 
            } catch (error) { loginView.setStatus(error.message, true); }
        });
    }

    // --- LÓGICA DE GESTIÓN (EL CORAZÓN DEL ERROR) ---
    const userManagementView = new UserManagementView();
    // UNIFICAMOS EL ID: Usa el mismo que pusiste en el HTML
    const operationsContainer = document.getElementById('operations-management-container');

    if (userManagementView.container || operationsContainer) {
        const activeUser = userController.activeSession.getUser();

        if (!activeUser || activeUser.rol !== 'GESTOR') {
            alert("Acceso denegado. Se requiere rol de GESTOR.");
            window.location.href = "index.html";
            return;
        }

        // Gestión de Usuarios
        if (userManagementView.container) {
            const handleRoleChange = async (email, newRole) => {
                try {
                    await userController.updateUserRol(email, newRole);
                    userManagementView.updateTable(userController.getUsersList(), handleRoleChange);
                } catch (error) { userManagementView.setStatus(error.message, true); }
            };
            userManagementView.render(userController.getUsersList(), handleRoleChange);
        }

        // Gestión de Operaciones (CORREGIDO)
        if (operationsContainer) {
            // Pasamos exactamente el mismo ID que acabamos de capturar
            const operationsView = new OperationsView(operationController, 'operations-management-container');
            operationsView.render();
        }
    }

    actualizarInterfazSesion();
    mostrarEstadoActual(userController, operationController, operatorController, pointController);
}

// ... (Resto de funciones mostrarEstadoActual y DOMContentLoaded se mantienen igual)


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