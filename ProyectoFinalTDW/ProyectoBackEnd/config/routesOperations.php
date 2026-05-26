<?php

/**
 * config/routesOperations.php
 *
 * @license https://opensource.org/licenses/MIT MIT License
 * @link    https://www.etsisi.upm.es/ ETS de Ingeniería de Sistemas Informáticos
 */

use Slim\App;
use TDW\IPanel\Controller\Operation\OperationCommandController;
use TDW\IPanel\Controller\Operation\OperationQueryController;
use TDW\IPanel\Middleware\JwtMiddleware;

/**
 * ############################################################
 * routes /api/v1/operations
 * ############################################################
 * @param App $app Slim4 application
 */
return function (App $app) {

    $REGEX_OPERATION_ID = '/{operationId:[^/]+}';

    // CGET|HEAD
    $app->map(
        [ 'GET', 'HEAD' ],
        $_ENV['RUTA_API'] . OperationQueryController::PATH_OPERATIONS,
        OperationQueryController::class . ':cget'
    )->setName('tdw_operations_cget');

    // GET /codigo[/{codigo}] ← ANTES del GET individual
    $app->get(
        $_ENV['RUTA_API'] . OperationQueryController::PATH_OPERATIONS . '/codigo[/{codigo:[^/]*}]',
        OperationQueryController::class . ':getElementByCode'
    )->setName('tdw_operations_get_code');

    // GET|HEAD individual ← DESPUÉS de /codigo
    $app->map(
        [ 'GET', 'HEAD' ],
        $_ENV['RUTA_API'] . OperationQueryController::PATH_OPERATIONS . $REGEX_OPERATION_ID,
        OperationQueryController::class . ':get'
    )->setName('tdw_operations_read');

    // OPTIONS
    $app->options(
        $_ENV['RUTA_API'] . OperationQueryController::PATH_OPERATIONS . '[/{operationId:[^/]+}]',
        OperationQueryController::class . ':options'
    )->setName('tdw_operations_options');

    // DELETE
    $app->delete(
        $_ENV['RUTA_API'] . OperationQueryController::PATH_OPERATIONS . $REGEX_OPERATION_ID,
        OperationCommandController::class . ':delete'
    )->setName('tdw_operations_delete')
        ->add(JwtMiddleware::class);

    // POST
    $app->post(
        $_ENV['RUTA_API'] . OperationQueryController::PATH_OPERATIONS,
        OperationCommandController::class . ':post'
    )->setName('tdw_operations_create')
        ->add(JwtMiddleware::class);

    // PUT
    $app->put(
        $_ENV['RUTA_API'] . OperationQueryController::PATH_OPERATIONS . $REGEX_OPERATION_ID,
        OperationCommandController::class . ':put'
    )->setName('tdw_operations_update')
        ->add(JwtMiddleware::class);
};