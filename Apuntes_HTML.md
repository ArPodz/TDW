# Apuntes HTML TDW 2026

## Ejercicios HTML Parte I

### Ejercicio 0 

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TDW</title>
        <html lang = "es">
        <meta charset = "UTF-8">
        <meta name = "TDW HTML" content = "Ejercicio 0 TDW 2026">
        <meta name = "keywords" content = "TDW, HTML">
        <meta name = "author" content = "Rufo">
        <base href = "https://www.nike.com/es" target = "blank">
    </head>
    <body>
        <h1>
            Hola Rufo
        </h1>
    </body>
</html>
```

### Ejercicio 1

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TDW</title>
        <html lang = "es">
        <meta charset = "UTF-8">
        <meta name = "TDW HTML" content = "Ejercicio 0 TDW 2026">
        <meta name = "keywords" content = "TDW, HTML">
        <meta name = "author" content = "Rufo">
        <base href = "https://www.nike.com/es" target = "blank">
    </head>
    <body>
        <h1>
            Hola Rufo
        </h1>
        <h2>

        </h2>
        <p>
            Rufooooooo &amp; Zapatillas <br>
            Rufo &gt; UPM <br>
            Te&nbsp;Quiero&nbsp;Rufo <br>
        </p>
        <hr>
        <p>
            <blockquote cite = "https://www.lasexta.com/noticias/deportes/futbol/video-jesus-gil-frases-desvarios-memorias-serie-pionero_201907085d231f640cf2160657d832e9.html">
            &quot;Yo era el jefe de la c&aacute;rcel&quot;
            </blockquote>
        </p>
        <address>
            Asier <br>
            asier@alumnos.upm.es
        </address>
    </body>
</html>
```

### Ejercicio 2

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TDW</title>
        <html lang = "es">
        <meta charset = "UTF-8">
        <meta name = "TDW HTML" content = "Ejercicio 0 TDW 2026">
        <meta name = "keywords" content = "TDW, HTML">
        <meta name = "author" content = "Rufo">
        <base href = "https://www.nike.com/es" target = "blank">
    </head>
    <body>
        <h1>
            Listas del Rufo
        </h1>
        <h2>
            Ingredientes
        </h2>
        <ul>
            <li>Macarrones</li>
            <li>Queso</li>
            <li>Bacon</li>
            <li>Nata</li>
            <li>Arroz</li>
        </ul>
        <h2>
            Pasos
        </h2>
        <ol>
            <li>Abrir</li>
            <li>Saltear</li>
            <li>Ahumar</li>
            <li>Sazonar</li>
        </ol>
        <h2>
            Glosario
        </h2>
        <dt>Abrir Macarrones</dt>
        <dd>Abrimos el paquete de macarrones</dd>
        <dt>Ahumar Bacon</dt>
        <dd>Ahumamos el paquete entero de bacon</dd>
        <dt>Servir Plato</dt>
        <dd>Servimos el plato de macarrones carbonara</dd>
    </body>
</html>
```

### Ejercicio 3

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TDW</title>
        <html lang = "es">
        <meta charset = "UTF-8">
        <meta name = "TDW HTML" content = "Ejercicio 0 TDW 2026">
        <meta name = "keywords" content = "TDW, HTML">
        <meta name = "author" content = "Rufo">
        <base href = "https://www.nike.com/es" target = "blank">
    </head>
    <body>
        <h1>
            Tablas del Rufo
        </h1>
        <table>
            <caption>Tabla del Rufini</caption>
            <thead><tr><th>Alumno</th><th>Practica</th><th>Examen</th><th>Total</th></tr></thead>
            <tbody>
            <tr><td>Rufo 1</td><td>2</td><td>3</td><td>5</td></tr>
            <tr><td>Rufo 2</td><td>5</td><td>5</td><td>10</td></tr>
            <tr><td>Rufo 3</td><td>1</td><td>2</td><td>3</td></tr>
            <tr><td>Rufo 4</td><td>4</td><td>1</td><td>5</td></tr>
            <tr><td>Rufo 5</td><td>4</td><td>4</td><td>8</td></tr>
            </tbody>
            <tfoot><tr><th>Media</th><td>3.3</td><td>3</td><td>6.3</td></tr></tfoot>
        </table>
    </body>
</html>
```

### Ejercicio 4

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TDW</title>
        <html lang = "es">
        <meta charset = "UTF-8">
        <meta name = "TDW HTML" content = "Ejercicio 0 TDW 2026">
        <meta name = "keywords" content = "TDW, HTML">
        <meta name = "author" content = "Rufo">
        <base href = "https://www.nike.com/es" target = "blank">
    </head>
    <body>
        <h1>
            Horario del Rufo
        </h1>
        <table border = "5", cellspacing = "5", cellpadding = "5". bgcolor = "#00EEFD">
            <caption>Horario del Rufini</caption>
            <thead><tr><th></th><th>Lunes</th><th>Martes</th><th>Miercoles</th><th>Jueves</th><th>Viernes</th></tr></thead>
            <tbody>
            <tr><th>9:00 - 10:00</th><td>Reventa</td><td>Zapatillas</td><td>Recreo</td><td>Ingles</td><td rowspan="2">Judaismo 2</td></tr>
            <tr><th>10:00 - 11:00</th><td>RA</td><td>Jetoven</td><td>Recreo</td><td>Logica</td></tr>
            <tr><th>11:00 - 12:00</th><td>SSR</td><td>Ñema</td><td>Libre</td><td>Recreo</td><td>Algebra</td></tr>
            <tr><th>12:00 - 13:00</th><td>AGBD</td><td>TP</td><td>Judaismo 3</td><td>Analisis</td><td>Economia</td></tr>
            <tr><th>13:00 - 14:00</th><td>TDW</td><td>TLP</td><td colspan="3">BBDD</td></tr>
            </tbody>
        </table>
    </body>
</html>
```

### Ejercicio 5

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TDW</title>
        <html lang = "es">
        <meta charset = "UTF-8">
        <meta name = "TDW HTML" content = "Ejercicio 0 TDW 2026">
        <meta name = "keywords" content = "TDW, HTML">
        <meta name = "author" content = "Rufo">
        <base href = "https://www.nike.com/es" target = "blank">
    </head>
    <body>
        <div align = "center">
            <h1>
                P&aacute;gina Web de Tecnolog&iacute;as para el Desarrollo Web
            </h1>
        </div>
        <p>
            Este proyecto final consiste en el desarrollo de una página académica estructurada mediante HTML semántico, 
            donde se sintetiza toda la información de una asignatura en un único archivo técnico. <br>
            El objetivo principal es demostrar el dominio de la jerarquía de contenidos y la correcta implementación de etiquetas específicas,
            desde la organización de temarios y planes de trabajo hasta la creación de tablas de evaluación detalladas y glosarios de términos. <br>
            A través de este ejercicio, se valida la capacidad para manejar entidades especiales y secciones de contacto,
            asegurando que la información sea accesible y legible para los navegadores. <br>
            En esencia, la asignatura proporciona los cimientos esenciales del desarrollo web, enfocándose en que la estructura del documento sea lógica,
            profesional y cumpla con los estándares actuales de la industria antes de avanzar hacia el diseño visual o la programación.
        </p>
        <hr>
        <h3>
            Temario de la Asignatura
        </h3>
        <ul>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
            <li>JSON y Ajax</li>
            <li>PHP</li>
        </ul>
        <hr>
        <h3>
            Plan de Trabajo de la Asignatura
        </h3>
        <ol>
            <li>Desarrollo del lado Cliente (Frontend)</li>
            <ol>
                <li>HTML</li>
                <li>CSS</li>
                <li>JavaScript</li>
            </ol>
            <li>Desarrollo del lado Servidor (Backend)</li>
            <ol>
                <li>NodeJS Y Express</li>
                <li>BBDD NoSQL &gt; MongoDB</li>
            </ol>
        </ol>
        <hr>
        <h3>
            Ejemplo de Glosario
        </h3>
        <dt>
            TDW
        </dt>
        <dd>
            Tecnologias de Desarrollo Web
        </dd>
        <dt>
            HTML
        </dt>
        <dd>
            HyperText Markup Language
        </dd>
        <hr>
        <h3>
            Ejemplo de Tabla
        </h3>
        <table border =  "20", cellspacing = "5", cellpadding = "20", width = "50%", height = "100", bgcolor = "F2BC49">
            <caption>Tabla de Evaluación TDW</caption>
            <thead><tr><th>Descripcion</th><th>Peso de la Nota</th><th>Nota Mínima</th><th>Duracion</th></tr></thead>
            <tbody>
                <tr><td>Practica HTML, CSS &amp; JS</td><td>35 %</td><td>4/10</td><td>0:00</td></tr>
                <tr><td>Practica Desarrollo PHP</td><td>20 %</td><td>4/10</td><td>0:00</td></tr>
                <tr><td>Proyecto Final</td><td>45 %</td><td>5/10</td><td>2:00</td></tr>
            </tbody>
            <tfoot><tr><th>Total Evaluacion</th><td>100 %</td><td>5/10</td><td>2:00</td></tr></tfoot>
        </table>
        <hr>
        <h3>
            Ejemplo de Cita
        </h3>
        <blockquote cite = "https://moodle.upm.es/titulaciones/oficiales/pluginfile.php/13178148/mod_resource/content/16/GA_61IW_615001065_2S_2025-26.pdf">
            &quot;Para el c&aacute;lculo de los valores totales, se&nbsp;estima que por cada credito ECTS el alumno dedicara entre 26 y 27 horas de trabajo presencial y no presencial.&quot;
        </blockquote>
        <hr>
        <h3>
            Ejemplo de Address
        </h3>
        <address>
            Javier Alegre Landaburu <br>
            javier.alegre.landaburu@upm.es <br>
            D-1114
        </address>
    </body>
</html>
```

### Ejercicio Montaje de Fotografías

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TDW</title>
        <html lang = "es">
        <meta charset = "UTF-8">
        <meta name = "TDW HTML" content = "Ejercicio 0 TDW 2026">
        <meta name = "keywords" content = "TDW, HTML">
        <meta name = "author" content = "Rufo">
    </head>
    <body>
        <table width = 1000 height = 1000 cellpadding = 0 cellspacing = 0>
        <caption> TREX </caption>
            <tr><th background = "puzzle1.png" width = "600" height = "333" colspan="2"></th><th background = "puzzle2.png" width = "334" height = "666" rowspan="2"></th></tr>
            <tr><th background = "puzzle4.png" width = "600" height = "333" colspan="2"></th></tr>
            <tr><th background = "puzzle3.png" width = "1000" height = "334" colspan="3"></th></tr>
        </table>
    </body>
</html>
```

<hr>

## Ejercicios HTML Parte II

### Ejercicio 1

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TDW</title>
        <html lang = "es">
        <meta charset = "UTF-8">
        <meta name = "TDW HTML" content = "Ejercicio 0 TDW 2026">
        <meta name = "keywords" content = "TDW, HTML">
        <meta name = "author" content = "Rufo">
    </head>
    <body>
        <h2>Persona</h2>
        <label for = "NombrePersona">Nombre</label>
        <input id = "NombrePersona" type = "text" name = "NombrePersona" value = "" maxlength = "20">
        <hr>
        <label for = "FechaPersona">Fecha de Nacimiento</label>
        <input id = "FechaPersona" type = "date" name = "FechaPersona">
        <hr>
        <label for = "AliasPersona">Alias</label>
        <input id = "AliasPersona" type = "text" name = "AliasPersona" value = "" maxlength = "15">
        <hr>
        <label for = "AvatarPersona">Avatar</label>
        <input id = "AvatarPersona" type = "image" name = "AvatarPersona">
        <h2>Datos</h2>
        <h2>Registro</h2>
        <label for = "EmailRegistro">Email</label>
        <input id = "EmailRegistro" type = "email" name = "EmailRegistro">
        <hr>
        <label for = "PasswordRegistro">Password</label>
        <input id = "PasswordRegistro" type = "password" name = "PasswordRegistro">

    </body>
</html>
```

### Ejercicio 2

```html
<!DOCTYPE html>
<html>
    <head>
        <title>TDW</title>
        <html lang = "es">
        <meta charset = "UTF-8">
        <meta name = "TDW HTML" content = "Ejercicio 0 TDW 2026">
        <meta name = "keywords" content = "TDW, HTML">
        <meta name = "author" content = "Rufo">
    </head>
    <body>
        <table>
        <caption> Mensaje </caption>
            <tr>
            <td bgcolor="#green"><font size="8" face="Times New Roman" color="#00AAAA">R</font></td>
            <td bgcolor="#113573"><font size="4" face="Comic sans MS" color="#FFAA00">U</font></td>
            <td bgcolor="#663322"><font size="5" face="Georgia" color="#FF00AA">F</font></td>
            <td bgcolor="#000211"><font size="9" face="Sans serif" color="#BBBBBB">O</font></td>
            </tr>
            <tr>
            <td bgcolor="#FF4040"><font size="6" face="Elegant" color="#0FFAAA">J</td>
            <td bgcolor="#FF40FF"><font size="8" face="Times New Roman" color="#00AFFA">U</td>
            <td bgcolor="#404040"><font size="5" face="Arial" color="#FFAAFF">D</td>
            <td bgcolor="#AA8839"><font size="7" face="Comic sans MS" color="#EEDD81">I</td>
            <td bgcolor="#104FF0"><font size="12" face="Impact" color="99AAEE">O</td>
            </tr>
        </table>
    </body>
</html>
```