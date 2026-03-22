export class RegisterView {
    constructor() {
        this.btnRegister = document.getElementById("btnRegister");
        this.registerForm = document.getElementById("registerUser");
        this.statusElement = document.getElementById("status");
    }

    getFormData() {
        const fd = new FormData(this.registerForm);
        return {
            email: fd.get("email").trim(),
            password: fd.get("password"),
            confirmPassword: fd.get("confirmPassword"),
            rol: fd.get("rol")
        };
    }

    clearForm() {
        this.registerForm.reset();
    }

    setStatus(msg) {
        this.statusElement.textContent = msg;
    }

    bindFormSubmit(handler) {
    this.registerForm.addEventListener("submit", (e) => {
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
