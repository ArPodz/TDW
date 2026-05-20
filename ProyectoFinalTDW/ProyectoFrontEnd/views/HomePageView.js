export class HomePageView {
    constructor() {
        this.btnInfo = document.getElementById('btn-go-info');
        this.btnLogin = document.getElementById('btn-go-login');
    }

    bindNavigate(handlerInfo, handlerLogin) {

        if (this.btnInfo) {
            this.btnInfo.addEventListener('click', (e) => {
                e.preventDefault();
                handlerInfo();
            });
        }

        if (this.btnLogin) {
            this.btnLogin.addEventListener('click', (e) => {
                e.preventDefault();
                handlerLogin();
            });
        }
    }
}