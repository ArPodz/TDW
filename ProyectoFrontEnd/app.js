// 1. Asegúrate de que las rutas sean las correctas en tu PC
import { UsersRepository } from "./models/UsersRepository.js";
import { JsonRepository } from "./models/JsonRepository.js"; 
import { StorageRepo } from "./models/StorageRepo.js"; 
import { UserController } from "./controllers/UserController.js";

/*
async function init() {
    console.log("🚀 Iniciando aplicación...");
    
    try {
        // --- PARTE 1: INICIALIZACIÓN ---
        const loader = new JsonRepository("./data.json");
        const seedData = await loader.load(); 
        console.log("✅ Seed cargado correctamente:", seedData);

        // Ajustamos al nombre 'users' que vimos en tu consola
        const usuariosIniciales = seedData.users || seedData.usuarios || [];

        const storage = new StorageRepo(localStorage, "usuarios_v1");
        const repo = new UsersRepository(storage); // Aquí se crea 'repo'
        
        await repo.initialize(usuariosIniciales);
        
        console.log("🟢 Repositorio listo. Iniciando batería de pruebas...");

        // --- PARTE 2: BATERÍA DE PRUEBAS (Todo en el mismo bloque) ---
        
        // TEST 0: Estado inicial
        console.log("\n--- TEST 0: Estado inicial y Persistencia ---");
        console.table(repo.getUsers());

        // TEST 1: Registro de Usuarios
        console.log("\n--- TEST 1: Registro de Usuarios ---");
        const nuevoUsuario = { 
            email: "test_nuevo@web.com", 
            password: "Password122523", 
            rol: "PUBLICO" // Rol por defecto [cite: 14]
        };
        const nuevoUsuario2 = { 
            email: "gavvviiiiiiiii@web.com", 
            password: "FFEESS523", 
            rol: "rufoooooooooooo" // Rol por defecto [cite: 14]
        };

        await repo.addUser(nuevoUsuario);
        console.log("✔ Usuario PÚBLICO añadido correctamente.");
        await repo.addUser(nuevoUsuario2);
        console.log("✔ Usuario PÚBLICO añadido correctamente.");


        // TEST 2: Cambio de Rol
        console.log("\n--- TEST 2: Promoción a GESTOR ---");
        const emailTest = "test_nuevo@web.com";
        // Validamos si es posible [cite: 21, 23]
        if (repo.updateRolPossible(emailTest, "GESTOR")) {
            await repo.updateRol(emailTest, "GESTOR");
            console.log(`✔ ${emailTest} ahora es GESTOR.`);
        }

        // TEST 2.5: Estado inicial
        console.log("\n--- TEST 2.5: Estado Medio y Persistencia ---");
        console.table(repo.getUsers());

        // TEST 3: Regla Crítica de Gestores 
        console.log("\n--- TEST 3: Protección de Seguridad (Último Gestor) ---");
        const gestores = repo.getUsers().filter(u => u.rol === "GESTOR");
        console.log(`Gestores actuales: ${gestores.length}`);

        try {
            console.log("Intentando degradar a TODOS los gestores a PÚBLICO...");
            for (const g of gestores) {
                // Esto debería lanzar Error al intentar degradar al último 
                repo.updateRolPossible(g.email, "PUBLICO"); 
                await repo.updateRol(g.email, "PUBLICO");
                console.log(`Degradado: ${g.email}`);
            }
        } catch (error) {
            console.error("❌ ÉXITO DEL TEST: El sistema bloqueó la degradación:", error.message);
        }

        // TEST 4: Estado final
        console.log("\n--- TEST 4: Estado final y Persistencia ---");
        console.table(repo.getUsers());
        console.log("Revisa 'Application > Local Storage' para confirmar los cambios.");

    } catch (error) {
        // Este catch capturará CUALQUIER error de las dos partes
        console.error("❌ Error durante la ejecución:", error);
    }
}

*/

/*
async function init() {
    console.log("🚀 Iniciando Aplicación con UserController...");
    
    // Limpieza inicial para pruebas puras (opcional)
    localStorage.clear();

    try {
        // --- 1. CONFIGURACIÓN ---
        const persistence = new StorageRepo(localStorage, "usuarios_v1");
        const loader = new JsonRepository("./data.json");
        const seedData = await loader.load();

        const userController = new UserController();
        // Inyectamos la persistencia al repo que vive dentro del controller
        userController.users.persistence = persistence; 
        await userController.users.initialize(seedData.users);

        console.log("✅ Sistema listo. Estado inicial:");
        console.table(userController.users.getUsers());

        // --- TEST 1: Registro Válido ---
        console.log("\n--- TEST 1: Registro Válido ---");
        try {
            userController.createUser("nuevo@web.com", "Password123", "PÚBLICO");
            console.log("✔ Usuario creado correctamente.");
        } catch (e) { console.error("❌ Falló creación válida:", e.message); }

        // --- TEST 2: Intento de 'rufoooooo' (Debe fallar) ---
        console.log("\n--- TEST 2: Intento de Rol Inválido ---");
        try {
            // Esto NO llegará al repo porque el Controller lanzará error
            userController.createUser("rufo@web.com", "Password123", "rufoooooo");
        } catch (e) {
            console.log("✔ ÉXITO: El sistema bloqueó el rol inválido:", e.message);
        }

        // --- TEST 3: Promoción a GESTOR ---
        console.log("\n--- TEST 3: Promoción a GESTOR ---");
        const emailPromocion = "nuevo@web.com";
        try {
            userController.updateUserRol(emailPromocion, "GESTOR");
            console.log(`✔ ${emailPromocion} ahora es GESTOR.`);
        } catch (e) { console.error("❌ Falló promoción:", e.message); }

        // --- TEST 4: Protección Último Gestor ---
        console.log("\n--- TEST 4: Protección de Seguridad ---");
        const gestores = userController.users.getUsers().filter(u => u.rol === "GESTOR");
        console.log(`Gestores detectados: ${gestores.length}`);

        try {
            for (const g of gestores) {
                console.log(`Intentando degradar a: ${g.email}`);
                userController.updateUserRol(g.email, "PUBLICO");
            }
        } catch (e) {
            console.error("❌ ÉXITO DEL TEST: Bloqueo de seguridad:", e.message);
        }

        // --- ESTADO FINAL ---
        console.log("\n--- RESULTADO FINAL EN STORAGE ---");
        console.table(userController.users.getUsers());

    } catch (error) {
        console.error("❌ Error crítico:", error);
    }
}
    */

// init();


async function runningTests() {
    console.log("%c🚀 INICIANDO BATERÍA DE PRUEBAS UNIFICADA", "color: skyblue; font-weight: bold; font-size: 14px;");
    
    // 1. Limpieza absoluta para un test limpio
    localStorage.clear();

    try {
        // --- CONFIGURACIÓN DE INFRAESTRUCTURA ---
        const storage = new StorageRepo(localStorage, "app_v1");
        const loader = new JsonRepository("./data.json");
        const seedData = await loader.load();

        const userController = new UserController();
        // Inyectamos la persistencia al repositorio del controlador
        userController.users.persistence = storage; 
        await userController.users.initialize(seedData.users || []);

        // --- TEST 1: VALIDACIÓN DE FORMATOS (Email y Password) ---
        console.log("\n--- TEST 1: Validaciones de Formato ---");
        try {
            userController.createUser("email-falso", "123", "PUBLICO");
        } catch (e) {
            console.log("✔ Capturado error de email/pass inválido:", e.message);
        }

        // --- TEST 2: NORMALIZACIÓN DE ROLES (Tildes y Mayúsculas) ---
        console.log("\n--- TEST 2: Normalización de Roles ---");
        try {
            // Enviamos "público" con tilde y minúscula
            const u = userController.createUser("test_normalizar@web.com", "Password123", "público");
            console.log(`✔ Rol normalizado correctamente: ${u.rol}`); // Debería salir "PUBLICO"
        } catch (e) { console.error("❌ Falló la normalización:", e.message); }

        // --- TEST 3: BLOQUEO DE ROLES INVENTADOS ('rufoooooo') ---
        console.log("\n--- TEST 3: Bloqueo de Roles no definidos ---");
        try {
            userController.createUser("hacker@web.com", "Password123", "rufoooooo");
        } catch (e) {
            console.log("✔ ÉXITO: El controlador bloqueó el rol 'rufoooooo':", e.message);
        }

        // --- TEST 4: PROMOCIÓN A GESTOR (Cambio de Clase POO) ---
        console.log("\n--- TEST 4: Promoción a GESTOR ---");
        const emailTest = "test_normalizar@web.com";
        try {
            userController.updateUserRol(emailTest, "GESTOR");
            const userActualizado = userController.users.findUserByEmail(emailTest);
            console.log(`✔ Usuario ${emailTest} ascendido. Clase:`, userActualizado.constructor.name);
        } catch (e) { console.error("❌ Falló la promoción:", e.message); }

        // --- TEST 5: REGLA CRÍTICA (Protección del último Gestor) ---
        console.log("\n--- TEST 5: Protección del Último Gestor ---");
        // Listamos gestores actuales
        const gestores = userController.users.getUsers().filter(u => u.rol === "GESTOR");
        console.log(`Gestores en el sistema: ${gestores.length}`);

        try {
            console.log("Intentando degradar a TODOS los gestores a PÚBLICO...");
            gestores.forEach(g => {
                userController.updateUserRol(g.email, "PUBLICO");
                console.log(`Degradado: ${g.email}`);
            });
        } catch (e) {
            console.log("%c✔ ÉXITO DEL TEST: Seguridad activada:", "color: orange; font-weight: bold;", e.message);
        }

        // --- ESTADO FINAL ---
        console.log("\n--- RESULTADO FINAL EN LOCALSTORAGE ---");
        const listaFinal = userController.users.getUsers();
        console.table(listaFinal);

        // Verificación de integridad: No debe haber ningún string suelto, solo objetos
        const hayErroresDeTipo = listaFinal.some(u => typeof u === 'string');
        if (hayErroresDeTipo) {
            console.error("❌ ERROR DE INTEGRIDAD: Se han detectado strings en lugar de objetos User.");
        } else {
            console.log("✅ INTEGRIDAD DE DATOS: Todos los registros son objetos válidos.");
        }

    } catch (error) {
        console.error("❌ Error crítico en la ejecución de pruebas:", error);
    }
}

runningTests();