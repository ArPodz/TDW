import { SessionView } from "../views/SessionView.js";

export class SessionManager {

    constructor(userController) {
        this.userController = userController;
    }

    render() {
        const activeUser = this.userController.activeSession.getUser();

        if(activeUser) {
            this.renderLoggedIn(activeUser);
        } else {
            this.renderGuest();
        }
    }

    renderLoggedIn(activeUser) {
        SessionView.renderSession(
            activeUser.email,
            activeUser.rol,
            () => {
                this.userController.logoutUser();
                window.location.href = "index.html";
            }
        );

        document.querySelectorAll('[data-require-auth]').forEach(link => link.style.display = '');

        const isGestor = activeUser.rol === 'GESTOR';
        document.querySelectorAll('[data-require-role="GESTOR"]').forEach(link => link.style.display = isGestor ? '' : 'none');
    }

    renderGuest() {
        SessionView.renderGuest();

        document.querySelectorAll('[data-require-auth]').forEach(link => link.style.display = 'none');
        document.querySelectorAll('[data-require-role="GESTOR"]').forEach(link => link.style.display = 'none');
    }

}