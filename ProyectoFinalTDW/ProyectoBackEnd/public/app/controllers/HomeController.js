export class HomeController {
    constructor(view) {
        this.view = view;
        
        this.view.bindNavigate(
            () => this.handleNavigateToInfo(),
            () => this.handleNavigateToLogin()
        );
    }

    handleNavigateToInfo = () => {
        window.location.href = './templates/information.html';
    }

    handleNavigateToLogin = () => {
        window.location.href = './templates/login.html';
    }
}