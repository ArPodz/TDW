import { UserController } from "./controllers/UserController.js";
import { RegisterView } from "./views/RegisterView.js";
import { LoginView } from "./views/LoginView.js";
import { StorageRepo } from "./repositories/StorageRepo.js";
import { SessionView } from "./views/SessionView.js"; 
import { UserManagementView } from "./views/UserManagementView.js";

import { OperationController } from "./controllers/OperationController.js";
import { OperatorController } from "./controllers/OperatorController.js";
import { PointController } from "./controllers/PointController.js";
import { OperationsView } from "./views/OperationsView.js";
import { PointsView } from "./views/PointsView.js"; 
import { OperatorsView } from "./views/OperatorsView.js";

import { InformationController } from "./controllers/InformationController.js";
import { InformationView } from "./views/InformationView.js";
import { HomePageView } from "./views/HomePageView.js";

async function init() {
    console.log("🚀 INICIALIZANDO APLICACIÓN...");

    const persistence = new StorageRepo(localStorage, "app_v1");
    const userController = new UserController(persistence);
    const operationController = new OperationController(persistence);
    const operatorController = new OperatorController(persistence);
    const pointController = new PointController(persistence);

    try {
        const [resUsers, resOps, resOperators, resPoints] = await Promise.all([
            fetch('data/usersData.json'),
            fetch('data/operationsData.json'),
            fetch('data/operatorsData.json'),
            fetch('data/pointsData.json')
        ]);

        const dataUsers = await resUsers.json();
        await userController.users.initialize(dataUsers.users);
        
        const dataOps = await resOps.json();
        await operationController.operations.initialize(dataOps.operations);
        
        const dataOperators = await resOperators.json();
        await operatorController.operators.initialize(dataOperators.operators);

        const dataPoints = await resPoints.json();
        await pointController.points.initialize(dataPoints.points);
        
        console.log("✅ Repositorios y datos inicializados.");
    } catch (e) {
        console.warn("⚠️ Error en carga de datos iniciales:", e.message);
    }

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

    const welcomeContainer = document.querySelector('.welcome-page');
    if (welcomeContainer) {
        const homeView = new HomePageView();
        homeView.bindNavigate(
            () => {
                const navBtn = document.getElementById('nav-board');
                if (navBtn) navBtn.click();
            },
            () => {
                window.location.href = "templates/login.html";
            }
        );
    }

    const boardContainer = document.getElementById('information-board-container');
    if (boardContainer) {
        const informationController = new InformationController(operationController, operatorController);
        const informationView = new InformationView(informationController, 'information-board-container');
        informationView.render();
    }

    const userManagementView = new UserManagementView();
    const operationsContainer = document.getElementById('operations-management-container');
    const pointsContainer = document.getElementById('points-management-container');
    const operatorsContainer = document.getElementById('operators-management-container');

    const activeUser = userController.activeSession.getUser();

    if (userManagementView.container || operationsContainer || pointsContainer || operatorsContainer) {
        if (!activeUser || activeUser.rol !== 'GESTOR') {
            console.warn("🚫 Acceso denegado: Se requiere rol de GESTOR.");
            if (operationsContainer || pointsContainer || operatorsContainer || userManagementView) {
                alert("Acceso denegado. Debes ser GESTOR.");
                window.location.href = "index.html";
                return;
            }
        } else {
            
            if (userManagementView.container) {
                const handleRoleChange = async (email, newRole) => {
                    try {
                        await userController.updateUserRol(email, newRole);
                        userManagementView.updateTable(userController.getUsersList(), handleRoleChange);
                    } catch (error) { userManagementView.setStatus(error.message, true); }
                };
                userManagementView.render(userController.getUsersList(), handleRoleChange);
            }
            
            if (operationsContainer) {
                const operationsView = new OperationsView(operationController, 'operations-management-container');
                operationsView.render();
            }
           
            if (pointsContainer) {
                const pointsView = new PointsView(pointController, 'points-management-container');
                pointsView.render();
            }
           
            if (operatorsContainer) {
                const operatorsView = new OperatorsView(operatorController, 'operators-management-container');
                operatorsView.render();
            }
        }
    }

    const sections = {
        'nav-board': 'information-board-container',
        'nav-operations': 'operations-management-container',
        'nav-operators': 'operators-management-container',
        'nav-points': 'points-management-container'
    };

    Object.entries(sections).forEach(([btnId, containerId]) => {
        const btn = document.getElementById(btnId);
        const container = document.getElementById(containerId);
        if (btn && container) {
            btn.addEventListener('click', () => {
    
                const welcome = document.querySelector('.welcome-page');
                if (welcome) welcome.style.display = 'none';

                Object.values(sections).forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.style.display = 'none';
                });
                
                container.style.display = 'block';
            });
        }
    });

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
    init().catch(err => {
        console.error("❌ Fallo crítico en el arranque:", err);
    });
});