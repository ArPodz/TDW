import { ApiService } from "./services/ApiService.js";

import { UserController } from "./controllers/UserController.js";
import { OperationController } from "./controllers/OperationController.js";
import { OperatorController } from "./controllers/OperatorController.js";
import { PointController } from "./controllers/PointController.js";

import { RegisterView } from "./views/RegisterView.js";
import { LoginView } from "./views/LoginView.js";
import { SessionView } from "./views/SessionView.js"; 
import { UserManagementView } from "./views/UserManagementView.js";
import { OperationsView } from "./views/OperationsView.js";
import { PointsView } from "./views/PointsView.js"; 
import { OperatorsView } from "./views/OperatorsView.js";

import { InformationController } from "./controllers/InformationController.js";
import { InformationView } from "./views/InformationView.js";
import { HomePageView } from "./views/HomePageView.js";

async function init() {
    console.log("🚀 INICIALIZANDO APLICACIÓN...");

    const api = new ApiService();

    const userController = new UserController(api);
    const operationController = new OperationController(api);
    const operatorController = new OperatorController(api);
    const pointController = new PointController(api);

    try {
        await Promise.all([
            userController.initialize(),
            operationController.initialize(),
            operatorController.initialize(),
            pointController.initialize()
        ]);
        console.log("Repositorios inicializados con datos del servidor.");
    } catch (e) {
        console.warn("Error en carga de datos iniciales:", e.message);
    }


    const actualizarInterfazSesion = () => {
        const activeUser = userController.activeSession.getUser();
        if (activeUser) {
            SessionView.renderSession(activeUser.email, activeUser.rol, () => {
                userController.logoutUser();
                window.location.href = "index.html"; 
            });
        } else {
            SessionView.renderGuest();
        }
    };



    const registerView = new RegisterView();
    if (registerView.registerForm) {
        registerView.bindEmailCheck(async (email) => {
            const exists = await userController.checkEmailExists(email);
            registerView.setEmailStatus(exists);
        });

        registerView.bindFormSubmit(async () => {
            try {
                await userController.registerUser(registerView.getFormData());
                alert(`¡Registro con éxito!`);
                window.location.href = "index.html"; 
            } catch (error) { 
                registerView.setStatus(error.message, true); 
            }
        });
    }



    const loginView = new LoginView();
    if (loginView.loginForm) {
        loginView.bindFormSubmit(async () => {
            try {
                await userController.loginUser(loginView.getFormData());
                window.location.href = "index.html"; 
            } catch (error) { 
                loginView.setStatus(error.message, true); 
            }
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


    const hayContenedoresAdmin = userManagementView.container || operationsContainer || pointsContainer || operatorsContainer;

    if (hayContenedoresAdmin) {
        const activeUser = userController.activeSession.getUser();

        if(!activeUser || activeUser.rol !== 'GESTOR') {
            console.warn("🚫 Acceso denegado: Se requiere rol de GESTOR.");
            alert("Acceso denegado. Debes ser GESTOR.");
            window.location.href = "index.html";
            return;
        }

        if (userManagementView.container) {
            const handleRoleChange = async (userId, newRole) => {
                try {
                    await userController.updateUserRol(userId, newRole);
                    userManagementView.updateTable(userController.getUsersList(), handleRoleChange);
                } catch (error) { 
                    userManagementView.setStatus(error.message, true); 
                }
            };

            const handleDeleteUser = async (userId) => {
                try {
                    await userController.deleteUser(userId);
                    userManagementView.updateTable(userController.getUsersList(), handleRoleChange);
                } catch (error) {
                    userManagementView.setStatus(error.message, true);
                }
            };

            userManagementView.render(userController.getUsersList(), handleRoleChange, handleDeleteUser);
        }
           
                
        if(operationsContainer) {
            const operationsView = new OperationsView(operationController, 'operations-management-container');
            operationsView.render();
        }
            
        if(pointsContainer) {
            const pointsView = new PointsView(pointController, 'points-management-container');
            pointsView.render();
        }
            
        if (operatorsContainer) {
            const operatorsView = new OperatorsView(operatorController, 'operators-management-container');
            operatorsView.render();
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
    console.table(pointController.spots.getPoints());
    const active = userController.activeSession.getUser();
    console.log(active ? `🔑 Activo: ${active.email} [${active.rol}]` : "🔑 Sin sesión");
    console.groupEnd();
}

document.addEventListener("DOMContentLoaded", () => {
    init().catch(err => {
        console.error("❌ Fallo crítico en el arranque:", err);
    });
});