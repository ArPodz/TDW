import { UserController } from "./controllers/UserController.js";
import { Session } from "./models/Session.js";

// 1. Instanciamos el controlador
const controller = new UserController();

console.log("--- Iniciando Pruebas de Usuario ---");

try {
    // 2. Intentamos crear un usuario válido (GESTOR)
    console.log("Creando usuario gestor...");
    const user1 = controller.createUser("admin@empresa.com", "admin1234", "GESTOR");
    console.log("✅ Usuario creado con éxito:", user1.email);

    // 3. Intentamos crear un usuario válido (PUBLICO)
    console.log("\nCreando usuario público...");
    const user2 = controller.createUser("juan@gmail.com", "pass5678", "PUBLICO");
    console.log("✅ Usuario creado con éxito:", user2.email);

    // 4. Prueba de Validación: Email incorrecto
    console.log("\nProbando validación de email incorrecto...");
    controller.createUser("email-falso", "12345678", "PUBLICO");

} catch (error) {
    console.error("❌ Error esperado en validación:", error.message);
}

try {
    // 5. Prueba de Validación: Password corto
    console.log("\nProbando validación de password corto...");
    controller.createUser("test@test.com", "123", "PUBLICO");
} catch (error) {
    console.error("❌ Error esperado en validación:", error.message);
}

// 6. Verificación del Repositorio
console.log("\n--- Estado del Repositorio ---");
const todosLosUsuarios = controller.users.getUsers();
console.log(`Total de usuarios en data.json: ${todosLosUsuarios.length}`);

// 7. Verificación del Singleton de Sesión
console.log("\n--- Verificación del Singleton ---");
const sessionA = Session.getSessionInstance();
const sessionB = controller.managerSession; // La que se pidió en el constructor del controller

console.log("¿Es la misma instancia de sesión?", sessionA === sessionB ? "SÍ ✅" : "NO ❌");