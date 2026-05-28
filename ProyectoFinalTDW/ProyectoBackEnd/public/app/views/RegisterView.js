export class RegisterView {
    constructor() {
        this.btnRegister = document.getElementById("btnRegister");
        this.registerForm = document.getElementById("registerUser");
        this.statusElement = document.getElementById("status");
        this.emailInput = document.getElementById("email");
        this.emailFeedback = document.getElementById("email-feedback");
    }

    getFormData() {
        const fd = new FormData(this.registerForm);
        return {
            email: fd.get("email").trim(),
            password: fd.get("password"),
            confirmPassword: fd.get("confirmPassword"),
        };
    }

    clearForm() {
        this.registerForm.reset();
        if(this.emailFeedback) {
            this.emailFeedback.textContent = "";
        }
    }

    setStatus(msg, isError = false) {
        if(this.statusElement) {
            this.statusElement.textContent = msg;
            this.statusElement.className = `status ${isError ? 'error' : 'success'}`;
        }
    }

    bindEmailCheck(handler) {
        if(!this.emailInput) return;

        let debounceTimer;
        this.emailInput.addEventListener("input", () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                const email = this.emailInput.value.trim();
                if (!email) {
                    this.setEmailFeedback(null);
                    return;
                }
                try {
                    const exists = await handler(email);
                    this.setEmailFeedback(exists);
                } catch {
                    this.setEmailFeedback(null);
                }
            }, 300);
        });
    }

    setEmailFeedback(exists) {
        if(!this.emailFeedback) return;

        if (exists === null) {
            this.emailFeedback.textContent = "";
            this.emailFeedback.className = "";
        } else if (exists) {
            this.emailFeedback.textContent = "El correo ya está registrado";
            this.emailFeedback.className = "feedback error"; 
        } else {
            this.emailFeedback.textContent = "Correo disponible";
            this.emailFeedback.className = "feedback success"; 
        }
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
