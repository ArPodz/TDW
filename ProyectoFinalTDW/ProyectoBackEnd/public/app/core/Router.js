import { HomePageView } from "../views/HomePageView.js";
import { LoginView } from "../views/LoginView.js";
import { RegisterView } from "../views/RegisterView.js";
import { ProfileView } from "../views/ProfileView.js";
import { InformationView } from "../views/InformationView.js";
import { OperationsView } from "../views/OperationsView.js";
import { OperatorsView } from "../views/OperatorsView.js";
import { PointsView } from "../views/PointsView.js";
import { UserManagementView } from "../views/UserManagementView.js";
import { InformationController } from "../controllers/InformationController.js";

export class Router {

    constructor(userController, operationController, operatorController, pointController) {
        this.userController = userController;
        this.operationController = operationController;
        this.operatorController = operatorController;
        this.pointController = pointController;
    }

    async route() {
        if(document.querySelector('.welcome-page')) {
            this.routeHome();
        }

        if(document.getElementById('loginUser')) {
            this.routeLogin();
        }

        if(document.getElementById('registerUser')) {
            this.routeRegister();
        }

        if(document.getElementById('profile-container')) {
            await this.routeProfile();
        }

        if(document.getElementById('information-board-container')) {
            await this.routeInformation();
        }

        if(this.isGestorPage()) {
            await this.routeGestor();
        }
    }

    routeHome() {
        const homeView = new HomePageView();
        homeView.bindNavigate(
            () => { window.location.href = 'templates/information.html'; },
            () => { window.location.href = 'templates/login.html'; }
        );  
    }

    routeLogin() {
        const loginView = new LoginView();
        if(!loginView.loginForm) return;

        loginView.bindFormSubmit(async () => {
            try {
                await this.userController.loginUser(loginView.getFormData());
                window.location.href = "index.html"; 
            } catch (error) { 
                loginView.setStatus(error.message, true); 
            }
        });
    }

    routeRegister() {
        const registerView = new RegisterView();
        if(!registerView.registerForm) return;

        registerView.bindEmailCheck(async (email) => {
            const exists = await this.userController.checkEmailExists(email);
            registerView.setEmailFeedback(exists);
            return exists;
        });

        registerView.bindFormSubmit(async () => {
            try {
                await this.userController.registerUser(registerView.getFormData());
                alert(`¡Registro con éxito!`);
                window.location.href = "index.html"; 
            } catch (error) { 
                registerView.setStatus(error.message, true); 
            }   
        });
    }

    async routeProfile() {
        const activeUser = this.userController.activeSession.getUser();
        if (!activeUser) {
            window.location.href = 'templates/login.html';
            return;
        }

        const profileView = new ProfileView(this.userController, 'profile-container');
        await profileView.render();
    }

    routeInformation() {
        const informationController = new InformationController(this.operationController, this.operatorController);

        new InformationView(informationController, 'information-board-container').render();
    }

    async routeGestor() {
        const activeUser = this.userController.activeSession.getUser();
        if (!activeUser || activeUser.rol !== 'GESTOR') {
            alert('Acceso denegado. Solo los gestores pueden acceder');
            window.location.href = 'index.html';
            return;
        }

        this.renderUserManagement();
        this.renderOperationsManagement();
        this.renderOperatorsManagement();
        this.renderPointsManagement();
        this.bindSectionNav();
    }

    renderUserManagement() {
        const userManagementView = new UserManagementView(this.userController, 'user-management-container');
        if(!userManagementView.container) return;
        
        const handleRoleChange = async (userId, newRole) => {
            try {
                await this.userController.updateUserRole(userId, newRole);
                userManagementView.updateTable(this.userController.getUsersList(), handleRoleChange, handleDeleteUser);
            } catch (error) { 
                userManagementView.setStatus(error.message, true); 
            }
        };

        const handleDeleteUser = async (userId) => {
            try {
                await this.userController.deleteUser(userId);
                userManagementView.updateTable(this.userController.getUsersList(), handleRoleChange, handleDeleteUser);
            } catch (error) {
                userManagementView.setStatus(error.message, true);
            }
        };

        userManagementView.render(this.userController.getUsersList(), handleRoleChange, handleDeleteUser);
    }


    renderOperationsManagement() {
        const container = document.getElementById('operations-management-container');
        if(container) {
            new OperationsView(this.operationController, 'operations-management-container').render();
        }
    }

    
    renderPointsManagement() {
        const container = document.getElementById('points-management-container');
        if(container) {
            new PointsView(this.pointController, 'points-management-container').render();
        }
    }


    renderOperatorsManagement() {
        const container = document.getElementById('operators-management-container');
        if(container) {
            new OperatorsView(this.operatorController, 'operators-management-container').render();
        }
    }


    bindSectionNav() {
        const sections = {
            'nav-board': 'information-board-container',
            'nav-operations': 'operations-management-container',
            'nav-operators': 'operators-management-container',
            'nav-points': 'points-management-container'
        };

        Object.entries(sections).forEach(([btnId, containerId]) => {
            const btn = document.getElementById(btnId);
            const container = document.getElementById(containerId);
            if (!btn || !container) return;

            btn.addEventListener('click', () => {

                document.querySelector('.welcome-page')?.style.setProperty('display', 'none');
                Object.values(sections).forEach(id => {
                    document.getElementById(id)?.style.setProperty('display', 'none');
                });
                container.style.display = 'block';
            });
        });
    }

    isGestorPage() {
        return !!(
            document.getElementById('operations-management-container') ||
            document.getElementById('operators-management-container') ||
            document.getElementById('points-management-container') ||
            document.getElementById('users-table-container')
        );
    }
                
}