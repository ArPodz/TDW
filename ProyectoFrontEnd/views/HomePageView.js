export class HomeView {
    constructor(domElementId) {
        this.container = document.getElementById(domElementId);
    }

    render() {
        this.container.innerHTML = `
            <div class="hero-welcome">
                <div class="hero-overlay"></div>
                
                <div class="hero-content">
                    <div class="hero-tag">Sistema de Gestión de Tráfico</div>
                    <h1>Control de Operaciones <br><span>Vuelos & Trenes</span></h1>
                    <p>Accede en tiempo real al estado de las salidas y llegadas o gestiona los recursos de la plataforma desde tu panel de administración.</p>
                    
                    <div class="hero-actions">
                        <button id="hero-btn-board" class="btn-hero-primary">
                            📊 Ver Información Vuelos y Trenes
                        </button>
                        <button id="hero-btn-login" class="btn-hero-secondary">
                            🔑 Iniciar Sesión
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const btnBoard = document.getElementById('hero-btn-board');
        const btnLogin = document.getElementById('hero-btn-login');

        if (btnBoard) {
            btnBoard.addEventListener('click', () => {
                const navBoard = document.getElementById('nav-board');
                if (navBoard) navBoard.click();
            });
        }

        if (btnLogin) {
            btnLogin.addEventListener('click', () => {
                const navOps = document.getElementById('nav-operations');
                if (navOps) navOps.click();
            });
        }
    }
}