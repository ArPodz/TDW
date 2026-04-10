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
import { PointsView } from "./views/PointsView.js"; // <-- AÑADIDO
import { OperatorsView } from "./views/OperatorsView.js"; // <-- AÑADIDO

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

    // --- LÓGICA DE GESTIÓN (ACTUALIZADA) ---
    const userManagementView = new UserManagementView();
    const operationsContainer = document.getElementById('operations-management-container');
    const pointsContainer = document.getElementById('points-management-container'); // <-- AÑADIDO
    const operatorsContainer = document.getElementById('operators-management-container'); // <-- AÑADIDO

    if (userManagementView.container || operationsContainer || pointsContainer) {
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

        // Gestión de Operaciones
        if (operationsContainer) {
            const operationsView = new OperationsView(operationController, 'operations-management-container');
            operationsView.render();
        }

        // --- GESTIÓN DE PUNTOS (AÑADIDO) ---
        if (pointsContainer) {
            const pointsView = new PointsView(pointController, 'points-management-container');
            pointsView.render();
        }

        // --- LÓGICA DE NAVEGACIÓN DE PESTAÑAS (AÑADIDO) ---
        const sections = {
            'nav-operations': 'operations-management-container',
            'nav-operators': 'operators-management-container',
            'nav-points': 'points-management-container'
        };

        Object.entries(sections).forEach(([btnId, containerId]) => {
            const btn = document.getElementById(btnId);
            const container = document.getElementById(containerId);
            if (btn && container) {
                btn.addEventListener('click', () => {
                    // Ocultar todas las secciones
                    Object.values(sections).forEach(id => {
                        const el = document.getElementById(id);
                        if (el) el.style.display = 'none';
                    });
                    // Mostrar la seleccionada
                    container.style.display = 'block';
                });
            }
        });
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