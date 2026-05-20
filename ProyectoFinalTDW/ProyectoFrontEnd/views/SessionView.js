export const SessionView = {

    renderSession: (email, rol, onLogout) => {
        const session = document.getElementById('login-link');
        const userEmail = document.getElementById('user-data');

        if (session) {
            session.textContent = 'Logout';
            session.href = '#';

            const newSession = session.cloneNode(true);
            session.parentNode.replaceChild(newSession, session);

            newSession.addEventListener('click', (e) => {
                e.preventDefault();
                if (onLogout) onLogout();
            });
        }

        if (userEmail) {
            userEmail.textContent = `User: ${email} | Rol: ${rol}`;
            userEmail.style.display = 'inline';
        }
    },

    renderGuest: () => {
        const session = document.getElementById('login-link');
        const userEmail = document.getElementById('user-data');

        if (session) {
            session.textContent = 'Login';
            session.href = 'templates/login.html';
            
            const newSession = session.cloneNode(true);
            session.parentNode.replaceChild(newSession, session);
        }

        if (userEmail) {
            userEmail.style.display = 'none';
        }
    }
};