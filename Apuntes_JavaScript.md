# Apuntes JavaScript TDW 2026

### Ejercico 1 Apuntes

```js
const students = [
 { name: "Alumno1", projectCompleted: false },
 { name: "Alumno2", projectCompleted: false },
 { name: "Alumno2", projectCompleted: false }
];

function addStudent(name) {
    let newStudent = {name, projectCompleted: false};
    students.push(newStudent);
}

function completeProject(student) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].name === student.name) {
            students[i].projectCompleted = true;
        }
    }   
}

function showGoodStudents() {
    console.log("Los estudiantes que han completado el proyecto son:");
    for(let i = 0; i < students.filter(student => student.projectCompleted); i++){
        console.log(i + student.name);
    }
}

function getCompletedProjectsPercentage(){
    let completedStudents = students.filter(student => student.projectCompleted).lenght;
    return (completedStudents / students.lenght) * 100;
}

addStudent("Rufo");
addStudent("Judio");
addStudent("Netanyahu");
addStudent("Cono");

completeProject("Rufo");
completeProject("Netanyahu");

showGoodStudents();

console.log("Han realizado el proyecto el " + getCompletedProjectsPercentage + "% de estudiantes");
```

### Ejercicio 2 Apuntes

```js
var nuevoP = document.createElement("p");

nuevoP.textContent = "Este es ub párrafo nuevo";

document.body.appendChild(nuevoP);
```