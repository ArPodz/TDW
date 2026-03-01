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
