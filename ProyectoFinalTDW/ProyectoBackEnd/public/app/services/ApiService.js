import {getSessionInstance} from "../models/Session.js";


export class ApiService {

    static BASE_URL  = 'http://127.0.0.1:8000/api/v1';
    static LOGIN_URL = 'http://127.0.0.1:8000/access_token';

    static #TOKEN_KEY = 'jwt_token';



    saveToken(token){
        sessionStorage.setItem(ApiService.#TOKEN_KEY, token);
    }

    getToken(){
        return sessionStorage.getItem(ApiService.#TOKEN_KEY);
    }

    clearToken(){
        sessionStorage.removeItem(ApiService.#TOKEN_KEY);
    }

    isLoggedIn(){
        return this.getToken() !== null;
    }


    // Login y Logout

    async login(email, password){
        const response = await fetch(ApiService.LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: email, password })
        });

        if (!response.ok) {
            throw new Error('Error en el inicio de sesión, email o contraseña incorrectos, o cuenta inactiva.');
        }

        const {access_token} = await response.json();
        this.saveToken(access_token);
        getSessionInstance().fromToken(access_token);
    }

    logout(){
        this.clearToken();
        getSessionInstance().logout();
    }


    // Métodos HTTP Genéricos

    async get(endpoint, auth = true){
        const response = await fetch(`${ApiService.BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers: auth ? this.#authHeaders() : {}
        });

        return this.#handleResponse(response);
    }

    async post(endpoint, body, auth = true){
        const response = await fetch(`${ApiService.BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(auth ? this.#authHeaders() : {})
            },
            body: JSON.stringify(body)
        });

        return this.#handleResponse(response);
    }

    async put(endpoint, body){

        const getResponse = await fetch(`${ApiService.BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers: this.#authHeaders()
        });

        const etag = getResponse.headers.get('ETag');

        const response = await fetch(`${ApiService.BASE_URL}/${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'If-Match': etag,
                ...this.#authHeaders()
            },
            body: JSON.stringify(body)
        });

        return this.#handleResponse(response);
    }

    async delete(endpoint){

        const getResponse = await fetch(`${ApiService.BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers: this.#authHeaders()
        });

        const etag = getResponse.headers.get('ETag');

        const response = await fetch(`${ApiService.BASE_URL}/${endpoint}`, {
            method: 'DELETE',
            'If-Match': etag,
            headers: this.#authHeaders()
        });

        return this.#handleResponse(response);
    }


    // Métodos Privados

    #authHeaders(){
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }

    async #handleResponse(response){

        if(response.status === 204) return null; // No Content

        if(response.ok){
            return await response.json();
        }

        // Errores

        let msg = '';

        try {
            msg = (await response.json()).error_description ?? ''; 
        } 
        catch {}

        switch(response.status){
            case 400: throw new Error(msg || 'Solicitud incorrecta');
            case 401: 
                this.logout();
                throw new Error('Sesión no válida, por favor inicia sesión de nuevo');
            case 403: throw new Error('No tienes permiso para realizar esta acción');
            case 404: throw new Error('Recurso no encontrado');
            case 409: throw new Error('No se puede realizar la operación: el recurso tiene datos asociados o ya existe');
            case 422: throw new Error(msg || 'Datos incompletos o inválidos');
            default: throw new Error(`Error ${response.status}.`);
        }
    }
}

