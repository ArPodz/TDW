<?php

/* ///////////////////////////////////////////////////////
 * Cuenta el número personal de accesos empleando cookies
 * /////////////////////////////////////////////////////// */

  // Obtenemos el valor del contador
  $num_veces = filter_input(INPUT_COOKIE, 'TDW_veces') ?? 0;    // $_COOKIE['TDW_veces']
  $num_veces++;

  // Expira a las 00:00:00 del 05/01/2026
  $fecha_expiracion = mktime(0, 0, 0, 1, 5, 2026);

  // Esta cookie sólo la verá el script actual
  $path = $_SERVER['REQUEST_URI'];

  // Ahora enviamos la cookie y después generamos el documento
  setcookie('TDW_veces', $num_veces, $fecha_expiracion, $path);

  // Enviamos una cookie con la fecha y hora de acceso
  $fecha_actual = date('d-m-Y H:i:s');
  setcookie('TDW_fecha', $fecha_actual, $fecha_expiracion);
?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Contador Personal con Cookies</title>
  </head>
  <body>
    <h2 style="text-align: center;">Contador de Accesos</h2>
    <p>
    <?= ($num_veces === 1)   // Es la primera vez
            ? 'Bienvenido por primera vez a nuestra página'
            : <<< MARCA_FINAL
                Hora actual: <samp>$fecha_actual</samp> <br>
                Has visitado nuestra p&aacute;gina $num_veces veces <br>
                El último acceso fue: <samp>{$_COOKIE['TDW_fecha']}</samp>
             MARCA_FINAL
    ?>
    </p>
  </body>
</html>