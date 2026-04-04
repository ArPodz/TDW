export const SessionView = {

    renderSession: (email, onLogout) => {
        const session = document.getElementById('login-link');
        const userEmail = document.getElementById('user-name');

        if (session) {
            session.textContent = 'Logout';
            session.href = '#';
            session.onclick = onLogout;
        }

        if (userEmail) {
            userEmail.textContent = `User: ${email}`;
            userEmail.style.display = 'inline';
        }
    },

    renderGuest: () => {
        const authLink = document.getElementById('login-link');
        const userEmail = document.getElementById('user-name');

        if (session) {
            session.textContent = 'Login';
            session.href = 'templates/login.html';
        }
        
        if (userEmail) {
            userEmail.style.display = 'none';
        }
    }
};