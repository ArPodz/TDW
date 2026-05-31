import { ApiService } from "../services/ApiService.js";

import { UserController } from "../controllers/UserController.js";
import { OperationController } from "../controllers/OperationController.js";
import { OperatorController } from "../controllers/OperatorController.js";
import { PointController } from "../controllers/PointController.js";

import { Router } from "./Router.js";
import { SessionManager } from "./SessionManager.js";

export class Application {

    constructor() {
        this.api = new ApiService();

        this.userController = new UserController(this.api);
        this.operationController = new OperationController(this.api);
        this.operatorController = new OperatorController(this.api);
        this.pointController = new PointController(this.api);

        this.sessionManager = new SessionManager(this.userController);
        this.router = new Router(this.userController, this.operationController, this.operatorController, this.pointController);
    }

    
    async init(){
        console.log("🚀 INICIALIZANDO APLICACIÓN...");

        await this.loadPublicData();
        await this.loadPrivateData();

        this.sessionManager.render();

        await this.router.route();

        this.logState();
    }


    async loadPublicData() {
        try {
            await Promise.all([
                this.operationController.initialize(),
                this.operatorController.initialize(),
                this.pointController.initialize()
            ]);
            console.log("✅ Repositorios públicos inicializados.");
        } catch (e) {
            console.warn("⚠️ Error en carga inicial de datos públicos:", e.message);
        }
    }

    async loadPrivateData() {
        if (!this.api.isLoggedIn()) return;

        try {
            await this.userController.initialize();
            console.log("✅ Repositorios privados inicializados.");
        } catch (e) {
            console.warn("⚠️ Error en carga inicial de datos privados:", e.message);
        }
    }

    
    logState() {
        console.group('📊 ESTADO DE LA APP');
        console.log('👥 USUARIOS:');
        console.table(this.userController.getUsersList());
        console.log('✈️ OPERACIONES:');
        console.table(this.operationController.operations.getOperations());
        console.log('👷 OPERADORES:');
        console.table(this.operatorController.operators.getOperators());
        console.log('📍 PUNTOS:');
        console.table(this.pointController.spots.getPoints());
        const active = this.userController.activeSession.getUser();
        console.log(active ? `🔑 Activo: ${active.email} [${active.rol}]` : '🔑 Sin sesión');
        console.groupEnd();
    }
}