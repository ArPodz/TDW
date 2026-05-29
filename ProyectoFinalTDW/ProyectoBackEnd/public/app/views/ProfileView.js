import { getSessionInstance } from "../models/Session.js";

export class ProfileView {
    constructor (userController, domElementId) {
        this.userController = userController;
        this.container = document.getElementById(domElementId);
    }


    async render() {
        if(!this.container) return;

        const activeUser = getSessionInstance().getUser();

        if(!activeUser) return;

        let userData = {};

        try {
            const data = await this.userController.users.api.get(`users/${activeUser.id}`);
            userData = data?.user ?? data;
        } catch (error) {
            this.container.innerHTML = `<p class = "status error">Error al cargar perfil: ${error.message}</p>`;
            return;
        }

        const fechaFormateada = userData.fechaNacimiento ? userData.fechaNacimiento.substring(0, 10) : '';

        this.container.innerHTML = `
            <div class = "profile-panel">
                <h2>Mi Perfil</h2>
                <p class = "auth-subtitle">Modifica tu información personal</p>

                <div class = "form-constainer">
                    <div class = "form-group">
                        <label for = "profile-email">EMAIL:</label>
                        <input type = "email" id = "profile-email" value = "${userData.email ?? ''}" required />
                    </div>

                    <div class = "form-group">
                        <label for = "profile-nombre">NOMBRE:</label>
                        <input type = "text" id = "profile-nombre" value = "${userData.nombre ?? ''}" required />
                    </div>

                    <div class = "form-group">
                        <label for = "profile-apellidos">APELLIDOS:</label>
                        <input type = "text" id = "profile-apellidos" value = "${userData.apellidos ?? ''}" required />
                    </div>

                    <div class = "form-group">
                        <label for = "profile-fecha">FECHA DE NACIMIENTO:</label>
                        <input type = "date" id = "profile-fecha" value = "${fechaFormateada}" required />
                    </div>

                    <div class = "form-group">
                        <label for = "profile-telefono">TELÉFONO:</label>
                        <input type = "tel" id = "profile-telefono" value = "${userData.telefono ?? ''}" required />
                    </div>

                    <div class = "form-group">
                        <label for = "profile-urls">URLS DE INTERÉS:</label>
                        <input type = "text" id = "profile-urls" value = "${userData.urls ?? ''}" required />
                    </div>

                    <hr style = "margin: 1.2rem 0;" />
                    <p style = "font-size: .85rem; color: #888;"> Deja en blanco para no cambiar la contraseña </p>

                    <div class = "form-group">
                        <label for = "profile-password">NUEVA CONTRASEÑA:</label>
                        <input type = "password" id = "profile-password" autocomplete="new-password" />
                    </div>

                    <div class = "form-group">
                        <label for = "profile-confirm"> CONFIRMAR CONTRASEÑA:</label>
                        <input type = "password" id = "profile-confirm" />
                    </div>

                    <div id = "profile-status" class = "status"></div>

                    <div style = "margin-top: 1.5rem; display: flex; gap: 1rem;">
                        <button id = "btn-save-profile" class = "btn-action btn-promote">Guardar Cambios</button>
                        <button id = "btn-cancel-profile" class = "btn-action btn-degrade">Cancelar</button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents(activeUser.id);
    }

    bindEvents(userId) {
        document.getElementById('btn-save-profile').addEventListener('click', async () => {
            await this.#handleSave(userId);
        });

        document.getElementById('btn-cancel-profile').addEventListener('click', () => {
            window.location.href = "index.html";
        });
    }

    async #handleSave(userId) {
        const fields = {};

        const email = document.getElementById('profile-email').value.trim();
        const nombre = document.getElementById('profile-nombre').value.trim();
        const apellidos = document.getElementById('profile-apellidos').value.trim();
        const fechaNacimiento = document.getElementById('profile-fecha').value;
        const telefono = document.getElementById('profile-telefono').value.trim();
        const urls = document.getElementById('profile-urls').value.trim();
        const password = document.getElementById('profile-password').value;
        const confirmPassword = document.getElementById('profile-confirm').value;

        if (email) fields.email = email;
        fields.nombre = nombre || null;
        fields.apellidos = apellidos || null;
        if(fechaNacimiento) fields.fechaNacimiento = fechaNacimiento;
        fields.telefono = telefono || null;
        fields.urls = urls || null;

        if(password) {
            if(password !== confirmPassword) {
                this.setStatus("Las contraseñas no coinciden", true);
                return;
            }
            fields.password = password;
        }

        try {
            await this.userController.updateUser(userId, fields);
            this.setStatus("Perfil actualizado con éxito");
        } catch (error) {
            this.setStatus("Error al actualizar perfil: " + error.message, true);
        }
    }

    setStatus(message, isError = false) {
        const statusDiv = document.getElementById('profile-status');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = `status ${isError ? 'error' : 'success'}`;
        }
    }
}