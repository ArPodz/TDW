let instance;

function createInstance() {
    return {
        user: null,

        login(user){
            const sessionData = {
                email: user.email,
                rol: user.rol,
                loggedAt: Date.now()
            };

            this.user = sessionData;

            sessionStorage.setItem("activeUser", JSON.stringify(sessionData));
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
        }
    };
}

export function getSessionInstance(){
    if (!instance) {
        instance = createInstance();
    }
    return instance;
}



