# Apuntes JavaScript TDW 2026

### Ejercicio 1 Apuntes

```js
const students = [
 { name: "Alumno1", projectCompleted: false },
 { name: "Alumno2", projectCompleted: false },
 { name: "Alumno3", projectCompleted: false },
 { name: "Alumno4", projectCompleted: false },
];

function addStudent(name) {
    let newStudent = {name: name, projectCompleted: false};
    students.push(newStudent);
}

function completeProject(studentName) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].name === studentName) {
            students[i].projectCompleted = true;
        }
    }   
}

function showStudents() {
    console.log("Los estudiantes son:");    
    for(let i = 0; i < students.length; i++){
        console.log(i + ". " + students[i].name);
    }
}
    

function showGoodStudents() {
    console.log("\nLos estudiantes que han completado el proyecto son:");
    for(let i = 0; i < students.length; i++){
        if(students[i].projectCompleted){
            console.log(i + ". " + students[i].name);
        }
    }
}

function getCompletedProjectsPercentage(){
    const completedStudents = students.filter(student => student.projectCompleted).length;
    return (completedStudents / students.length) * 100;
}

addStudent("Rufo");
addStudent("Judio");
addStudent("Netanyahu");
addStudent("Cono");

completeProject("Rufo");
completeProject("Netanyahu");

showStudents();
showGoodStudents();

console.log("\nHan realizado el proyecto el " + getCompletedProjectsPercentage() + "% de estudiantes");
```

### Ejercicio 2 Apuntes

```js
var nuevoP = document.createElement("p");

nuevoP.textContent = "Este es ub párrafo nuevo";

document.body.appendChild(nuevoP);
```

### Ejercicio 3 Apuntes

```js
var nuevoBoton = document.createElement("button");

nuevoBoton.textContent = "Haz clic en mi";
nuevoBoton.setAttribute("id", "boton-activo");
document.body.appendChild(nuevoBoton);
```

```css
#boton-activo{
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
}
```

### Ejercicio 1 Apuntes Eventos

```js
document.getElementById("hoverDiv").addEventListener("mouseover", function() {
 this.style.backgroundColor = (this.style.backgroundColor === 'white' ? 'green' : 'white');
});
```

### Ejercicio 2 Apuntes Eventos

```js
let intervaloReloj;
let relojActivo = true;

function iniciarReloj() {
    intervaloReloj = setInterval(actualizarHora, 1000);   
}

function actualizarHora(){
    const date = new Date();
    const hours = agregarCero(date.getHours());
    const minutes = agregarCero(date.getMinutes());
    const seconds = agregarCero(date.getSeconds());
    document.getElementById('reloj').textContent = `${hours}:${minutes}:${seconds}`;
}

function agregarCero(numero){
    return numero < 10 ? '0' + numero : numero;
}

function cambiarFondo(color){
    document.body.style.backgroundColor = color;
}

document.getElementById('toggleReloj').addEventListener('click', function() {
    if (relojActivo) {
        clearInterval(intervaloReloj);
        this.textContent = 'Reanudar Reloj';
    } else {
        iniciarReloj();
        this.textContent = 'Detener Reloj';
    }
    relojActivo = !relojActivo;
});

iniciarReloj();
```

### Ejercicio 1 Clases y Objetos

```js
class Person {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    describe() {
        console.log(this.name + " " + this.email);
    }
}

class Student extends Person {
    constructor(name, email, course){
        super(name, email);
        this.course = course;
    }

    describe() {
        console.log(this.name + " " + this.email + " " + this.course);
    }
}

class Teacher extends Person {
    constructor(name, email, department){
        super(name, email);
        this.department = department;
    }

    describe(){
        console.log(this.name + " " + this.email + " " + this.department);
    }

    sendAnnouncement(msg){
        console.log("Enviado a Clase: " + msg);
    }
}

const rufo = new Student("Rufo", "rufobujarrila@upm.es", "Judaismo 1");
const antirufo = new Teacher("Antirufos", "antirufo@upm.es", "Capitalismo");

rufo.describe();
antirufo.describe();
antirufo.sendAnnouncement("Odio a Rufo");
```
