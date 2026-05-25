let instance;

function createInstance() {
    return {
        user: null,

        fromToken(token){
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64));
            const scopes = payload.scopes ?? [];

            this.login({
                id: payload.uid,
                email: payload.email,
                rol: scopes.includes('gestor') ? 'GESTOR' : 'PUBLICO'
            });
        },

        login(user){
            this.user = {
                id: user.id,
                email: user.email,
                rol: user.rol,
                loggedAt: Date.now()
            };

            sessionStorage.setItem("activeUser", JSON.stringify(this.user));
        },

        logout(){
            this.user = null;
            sessionStorage.removeItem("activeUser");
        },

        getUser() {
            if (!this.user) {
                const saved = sessionStorage.getItem("activeUser");
            if (saved) this.user = JSON.parse(saved);
            }
            return this.user;
        },


        isGestor(){
            return this.getUser()?.rol === 'GESTOR';
        },

        isPublico(){
            return this.getUser()?.rol === 'PUBLICO';
        },

        isLoggedIn(){
            return this.getUser() !== null;
        }
    }
}

export function getSessionInstance(){
    if (!instance) {
        instance = createInstance();
    }
    return instance;
}



