<?php

/**
 * tests/Controller/Operation/OperationControllerTest.php
 */

namespace TDW\Test\IPanel\Controller\Operation;

use Fig\Http\Message\StatusCodeInterface as StatusCode;
use JetBrains\PhpStorm\ArrayShape;
use JsonException;
use PHPUnit\Framework\Attributes as TestAttr;
use TDW\IPanel\Controller\Operation\OperationCommandController;
use TDW\IPanel\Controller\Operation\OperationQueryController;
use TDW\IPanel\Utility\Utils;
use TDW\Test\IPanel\Controller\BaseTestCase;
use TDW\IPanel\Enum\TipoOperacion;
use TDW\IPanel\Enum\EstadoOperacion;
use TDW\IPanel\Enum\SentidoOperacion;

#[TestAttr\CoversClass(OperationQueryController::class)]
#[TestAttr\CoversClass(OperationCommandController::class)]
class OperationControllerTest extends BaseTestCase
{
    protected const string RUTA_API = '/api/v1/operations';

    protected static array $gestor;
    protected static array $publico;
    protected static array $operador;
    protected static array $punto;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        self::$gestor = [
            'email'    => (string) getenv('ADMIN_USER_EMAIL'),
            'password' => (string) getenv('ADMIN_USER_PASSWD'),
        ];
        self::$gestor['id'] = Utils::loadUserData(
            self::$gestor['email'],
            self::$gestor['password'],
            true
        );

        self::$publico = [
            'email'    => self::$faker->email(),
            'password' => self::$faker->password(),
        ];
        self::$publico['id'] = Utils::loadUserData(
            self::$publico['email'],
            self::$publico['password'],
        );

        $em = \TDW\IPanel\Utility\DoctrineConnector::getEntityManager();

        $operador = new \TDW\IPanel\Model\Operador(
            self::$faker->company(),
            strtoupper(self::$faker->lexify('???')),
            'blue',
            null
        );
        $em->persist($operador);
        $em->flush();
        self::$operador = ['id' => $operador->getId()];

        $punto = new \TDW\IPanel\Model\Punto(
            'PUERTA',
            strtoupper(self::$faker->lexify('???'))
        );
        $em->persist($punto);
        $em->flush();
        self::$punto = ['id' => $punto->getId()];
    }

    public function testCGetOperations404NotFound(): void
    {
        self::$gestor['authHeader'] =
            $this->getTokenHeaders(self::$gestor['email'], self::$gestor['password']);
        $response = $this->runApp('GET', self::RUTA_API, null, self::$gestor['authHeader']);
        $this->internalTestError($response, StatusCode::STATUS_NOT_FOUND);
    }

    #[TestAttr\Depends('testCGetOperations404NotFound')]
    public function testPostOperation201Created(): array
    {
        $p_data = [
            'tipo'           => TipoOperacion::VUELO->value,
            'codigo'         => strtoupper(self::$faker->bothify('??####')),
            'sentido'        => SentidoOperacion::SALIDA->value,
            'origen'         => self::$faker->city(),
            'destino'        => self::$faker->city(),
            'operadorId'     => self::$operador['id'],
            'puntoId'        => self::$punto['id'],
            'estado'         => EstadoOperacion::PROGRAMADO->value,
            'horaProgramada' => '2026-12-12T10:00:00+00:00',
        ];

        $response = $this->runApp('POST', self::RUTA_API, $p_data, self::$gestor['authHeader']);

        self::assertSame(201, $response->getStatusCode());
        self::assertNotEmpty($response->getHeader('Location'));

        $r_body = $response->getBody()->getContents();
        self::assertJson($r_body);

        $responseOperation = json_decode($r_body, true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('operacion', $responseOperation);

        $operationData = $responseOperation['operacion'];

        self::assertNotEmpty($operationData['operacionId']);
        self::assertSame($p_data['codigo'], $operationData['codigo']);
        self::assertSame(strtolower($p_data['tipo']), strtolower($operationData['tipo']));
        self::assertSame($p_data['origen'], $operationData['origen']);
        self::assertSame($p_data['destino'], $operationData['destino']);

        self::assertArrayHasKey('operador', $operationData);
        self::assertArrayHasKey('operador', $operationData['operador']);
        self::assertSame(self::$operador['id'], $operationData['operador']['operador']['id']);

        self::assertArrayHasKey('punto', $operationData);
        self::assertArrayHasKey('punto', $operationData['punto']);
        self::assertSame(self::$punto['id'], $operationData['punto']['punto']['puntoId']);

        return $operationData;
    }

    #[TestAttr\Depends('testPostOperation201Created')]
    public function testPostOperation400BadRequest(array $operation): void
    {
        $p_data = [
            'tipo'       => TipoOperacion::VUELO->value,
            'codigo'     => $operation['codigo'],
            'sentido'    => SentidoOperacion::SALIDA->value,
            'operadorId' => self::$operador['id'],
            'puntoId'    => self::$punto['id'],
        ];
        $response = $this->runApp('POST', self::RUTA_API, $p_data, self::$gestor['authHeader']);
        $this->internalTestError($response, StatusCode::STATUS_BAD_REQUEST);

        $p_data['codigo']     = strtoupper(self::$faker->bothify('??####'));
        $p_data['operadorId'] = 999999;
        $response = $this->runApp('POST', self::RUTA_API, $p_data, self::$gestor['authHeader']);
        $this->internalTestError($response, StatusCode::STATUS_BAD_REQUEST);

        $p_data['operadorId'] = self::$operador['id'];
        $p_data['puntoId']    = 999999;
        $response = $this->runApp('POST', self::RUTA_API, $p_data, self::$gestor['authHeader']);
        $this->internalTestError($response, StatusCode::STATUS_BAD_REQUEST);
    }

    #[TestAttr\Depends('testPostOperation201Created')]
    public function testCGetOperations200Ok(array $operation): array
    {
        self::assertIsString($operation['codigo']);
        $response = $this->runApp(
            'GET',
            self::RUTA_API . '?codigo=' . $operation['codigo'] . '&order=codigo&ordering=DESC',
            null,
            self::$gestor['authHeader']
        );
        self::assertSame(200, $response->getStatusCode());

        $etag = $response->getHeader('ETag');
        self::assertNotEmpty($etag);

        $r_body = $response->getBody()->getContents();
        self::assertJson($r_body);

        $r_data = json_decode($r_body, true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('operaciones', $r_data);
        self::assertIsArray($r_data['operaciones']);

        return $etag;
    }

    #[TestAttr\Depends('testCGetOperations200Ok')]
    public function testCGetOperations304NotModified(array $etag): void
    {
        $headers = array_merge(self::$gestor['authHeader'], ['If-None-Match' => $etag]);
        $response = $this->runApp('GET', self::RUTA_API, null, $headers);
        self::assertSame(StatusCode::STATUS_NOT_MODIFIED, $response->getStatusCode());
    }

    #[TestAttr\Depends('testPostOperation201Created')]
    public function testGetOperation200Ok(array $operation): array
    {
        $response = $this->runApp(
            'GET',
            self::RUTA_API . '/' . $operation['operacionId'],  
            null,
            self::$gestor['authHeader']
        );
        self::assertSame(200, $response->getStatusCode());
        self::assertNotEmpty($response->getHeader('ETag'));

        $r_body = $response->getBody()->getContents();
        self::assertJson($r_body);

        $operation_aux = json_decode($r_body, true, 512, JSON_THROW_ON_ERROR);
        self::assertSame($operation, $operation_aux['operacion']);

        return $response->getHeader('ETag');
    }

    #[TestAttr\Depends('testPostOperation201Created')]
    #[TestAttr\Depends('testGetOperation200Ok')]
    public function testGetOperation304NotModified(array $operation, array $etag): string
    {
        $headers = array_merge(self::$gestor['authHeader'], ['If-None-Match' => $etag]);
        $response = $this->runApp(
            'GET',
            self::RUTA_API . '/' . $operation['operacionId'], 
            null,
            $headers
        );
        self::assertSame(StatusCode::STATUS_NOT_MODIFIED, $response->getStatusCode());

        return $etag[0];
    }

    #[TestAttr\Depends('testPostOperation201Created')]
    public function testGetOperationCode204NoContent(array $operation): void
    {
        $response = $this->runApp('GET', self::RUTA_API . '/codigo/' . $operation['codigo']);
        self::assertSame(204, $response->getStatusCode());
        self::assertEmpty($response->getBody()->getContents());
    }

    #[TestAttr\Depends('testPostOperation201Created')]
    #[TestAttr\Depends('testGetOperation304NotModified')]
    #[TestAttr\Depends('testPostOperation400BadRequest')]
    #[TestAttr\Depends('testCGetOperations304NotModified')]
    #[TestAttr\Depends('testGetOperationCode204NoContent')]
    public function testPutOperation209Updated(array $operation, string $etag): array
    {
        $p_data = [
            'codigo'         => strtoupper(self::$faker->bothify('??####')),
            'origen'         => self::$faker->city(),
            'destino'        => self::$faker->city(),
            'estado'         => EstadoOperacion::LLEGADO->value,
            'horaProgramada' => '2026-12-31T23:59:59+00:00',
        ];

        $response = $this->runApp(
            'PUT',
            self::RUTA_API . '/' . $operation['operacionId'],  
            $p_data,
            array_merge(self::$gestor['authHeader'], ['If-Match' => $etag])
        );

        self::assertSame(209, $response->getStatusCode());
        $r_body = $response->getBody()->getContents();
        self::assertJson($r_body);

        $operation_aux = json_decode($r_body, true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('operacion', $operation_aux);

        $updatedOp = $operation_aux['operacion'];

        self::assertSame($operation['operacionId'], $updatedOp['operacionId']);
        self::assertSame($p_data['codigo'], $updatedOp['codigo']);
        self::assertSame($p_data['origen'], $updatedOp['origen']);
        self::assertSame($p_data['destino'], $updatedOp['destino']);
        self::assertSame($p_data['estado'], $updatedOp['estado']);

        return $updatedOp;
    }

    #[TestAttr\Depends('testPutOperation209Updated')]
    public function testPutOperation400BadRequest(array $operation): void
    {
        $p_data = [
            'tipo'       => TipoOperacion::VUELO->value,
            'codigo'     => strtoupper(self::$faker->bothify('CF####')), 
            'sentido'    => SentidoOperacion::LLEGADA->value,
            'operadorId' => self::$operador['id'],
            'puntoId'    => self::$punto['id'],
        ];

        $this->runApp('POST', self::RUTA_API, $p_data, self::$gestor['authHeader']);

        $r1 = $this->runApp(
            'HEAD',
            self::RUTA_API . '/' . $operation['operacionId'],  
            [],
            self::$gestor['authHeader']
        );

        $response = $this->runApp(
            'PUT',
            self::RUTA_API . '/' . $operation['operacionId'], 
            ['codigo' => $p_data['codigo']],
            array_merge(self::$gestor['authHeader'], ['If-Match' => $r1->getHeader('ETag')])
        );

        $this->internalTestError($response, StatusCode::STATUS_BAD_REQUEST);
    }

    #[TestAttr\Depends('testPutOperation209Updated')]
    public function testPutOperation428PreconditionRequired(array $operation): void
    {
        $response = $this->runApp(
            'PUT',
            self::RUTA_API . '/' . $operation['operacionId'], 
            [],
            self::$gestor['authHeader']
        );
        $this->internalTestError($response, StatusCode::STATUS_PRECONDITION_REQUIRED);
    }

    public function testOptionsOperation204NoContent(): void
    {
        $response = $this->runApp('OPTIONS', self::RUTA_API);
        self::assertSame(204, $response->getStatusCode());
        self::assertNotEmpty($response->getHeader('Allow'));
        self::assertEmpty($response->getBody()->getContents());

        $response = $this->runApp('OPTIONS', self::RUTA_API . '/' . self::$faker->randomDigitNotNull());
        self::assertSame(204, $response->getStatusCode());
        self::assertNotEmpty($response->getHeader('Allow'));
        self::assertEmpty($response->getBody()->getContents());
    }

    #[TestAttr\Depends('testPostOperation201Created')]
    #[TestAttr\Depends('testPostOperation400BadRequest')]
    #[TestAttr\Depends('testPutOperation400BadRequest')]
    #[TestAttr\Depends('testPutOperation428PreconditionRequired')]
    #[TestAttr\Depends('testGetOperationCode204NoContent')]
    public function testDeleteOperation204NoContent(array $operation): string
    {
        $response = $this->runApp(
            'DELETE',
            self::RUTA_API . '/' . $operation['operacionId'],  
            null,
            self::$gestor['authHeader']
        );

        self::assertSame(204, $response->getStatusCode());
        self::assertEmpty($response->getBody()->getContents());

        return $operation['operacionId']; 
    }

    #[TestAttr\Depends('testPutOperation209Updated')]
    #[TestAttr\Depends('testDeleteOperation204NoContent')]
    public function testGetOperationCode404NotFound(array $operation): void
    {
        $response = $this->runApp('GET', self::RUTA_API . '/codigo/' . $operation['codigo']);
        $this->internalTestError($response, StatusCode::STATUS_NOT_FOUND);

        $response = $this->runApp('GET', self::RUTA_API . '/codigo/');
        $this->internalTestError($response, StatusCode::STATUS_NOT_FOUND);
    }

    #[TestAttr\DataProvider('routeProvider404')]
    #[TestAttr\Depends('testDeleteOperation204NoContent')]
    public function testOperationStatus404NotFound(string $method, mixed $operationId): void
    {
        $response = $this->runApp(
            $method,
            self::RUTA_API . '/' . $operationId,
            null,
            self::$gestor['authHeader']
        );
        $this->internalTestError($response, StatusCode::STATUS_NOT_FOUND);
    }

    #[TestAttr\DataProvider('routeProvider401')]
    public function testOperationStatus401Unauthorized(string $method, string $uri): void
    {
        $response = $this->runApp($method, $uri);
        $this->internalTestError($response, StatusCode::STATUS_UNAUTHORIZED);
    }

    #[TestAttr\DataProvider('routeProvider403')]
    public function testOperationStatus403Forbidden(string $method, string $uri, int $statusCode): void
    {
        self::$publico['authHeader'] = $this->getTokenHeaders(self::$publico['email'], self::$publico['password']);
        $response = $this->runApp($method, $uri, null, self::$publico['authHeader']);
        $this->internalTestError($response, $statusCode);
    }

    // --------------
    // DATA PROVIDERS
    // --------------

    #[ArrayShape([
        'postAction401'   => "string[]",
        'putAction401'    => "string[]",
        'deleteAction401' => "string[]",
    ])]
    public static function routeProvider401(): array
    {
        return [
            'postAction401'   => ['POST',   self::RUTA_API],
            'putAction401'    => ['PUT',    self::RUTA_API . '/1'],
            'deleteAction401' => ['DELETE', self::RUTA_API . '/1'],
        ];
    }

    #[ArrayShape([
        'postAction403'   => "array",
        'putAction403'    => "array",
        'deleteAction403' => "array",
    ])]
    public static function routeProvider403(): array
    {
        return [
            'postAction403'   => ['POST',   self::RUTA_API,        StatusCode::STATUS_NOT_FOUND],
            'putAction403'    => ['PUT',    self::RUTA_API . '/1', StatusCode::STATUS_NOT_FOUND],
            'deleteAction403' => ['DELETE', self::RUTA_API . '/1', StatusCode::STATUS_NOT_FOUND],
        ];
    }

    public static function routeProvider404(): array
    {
        return [
            'getAction404'         => ['GET'],
            'getAction404bigId'    => ['GET',    999999999999999999],
            'putAction404'         => ['PUT'],
            'putAction404bigId'    => ['PUT',    999999999999999999],
            'deleteAction404'      => ['DELETE'],
            'deleteAction404bigId' => ['DELETE', 999999999999999999],
        ];
    }
}