export class LoginView {
    constructor() {
        this.btnLogin = document.getElementById("btnLogin");
        this.loginForm = document.getElementById("loginUser");
        this.statusElement = document.getElementById("status");
    }

    getFormData() {
        const fd = new FormData(this.loginForm);
        return {
            email: fd.get("email").trim(),
            password: fd.get("password")
        };
    }

    clearForm() {
        this.loginForm.reset();
    }

    setStatus(msg) {
        this.statusElement.textContent = msg;
    }

    bindFormSubmit(handler) {
    this.loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handler();
        });
    } 
}

function escapeHTML(s) {
    return String(s)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
    }
