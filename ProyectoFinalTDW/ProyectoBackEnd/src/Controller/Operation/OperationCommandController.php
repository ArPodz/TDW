<?php

namespace TDW\IPanel\Controller\Operation;

use Doctrine\ORM;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use TDW\IPanel\Controller\TraitController;
use TDW\IPanel\Model\Operacion;
use TDW\IPanel\Model\Operador;
use TDW\IPanel\Model\Punto;
use TDW\IPanel\Utility\Error;
use TDW\IPanel\Enum\TipoOperacion;
use TDW\IPanel\Enum\SentidoOperacion;
use TDW\IPanel\Enum\EstadoOperacion; 

class OperationCommandController
{
    use TraitController;

    public function __construct(
        protected ORM\EntityManager $entityManager
    ) { }

    public function post(Request $request, Response $response): Response
    {
        assert($request->getMethod() === 'POST');

        if (!$this->checkGestorScope($request)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $req_data = (array) $request->getParsedBody();

        if (
            !$this->verifyStringInput($req_data['codigo'] ?? '', 10) ||
            !$this->verifyStringInput($req_data['tipo'] ?? '', 20) ||
            !isset($req_data['operadorId'], $req_data['puntoId'])
        ) {
            return Error::createResponse($response, StatusCode::STATUS_UNPROCESSABLE_ENTITY);
        }

        $existing = $this->entityManager->getRepository(Operacion::class)
            ->findOneBy(['codigo' => $req_data['codigo']]);
        if ($existing instanceof Operacion) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }

        $operador = $this->entityManager->getRepository(Operador::class)->find($req_data['operadorId']);
        $punto    = $this->entityManager->getRepository(Punto::class)->find($req_data['puntoId']);

        if (!$operador || !$punto) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }

        try {
            $tipoEnum    = TipoOperacion::from(strtolower($req_data['tipo']));
            $sentidoEnum = SentidoOperacion::from(strtolower($req_data['sentido'] ?? ''));

            $element = new Operacion(
                $tipoEnum,
                $req_data['codigo'],
                $sentidoEnum,
                $req_data['origen'] ?? '',
                $req_data['destino'] ?? '',
                $operador,
                $punto,
                EstadoOperacion::PROGRAMADO,
                !empty($req_data['horaProgramada']) ? new \DateTime($req_data['horaProgramada']) : null,
                !empty($req_data['horaEstimada'])   ? new \DateTime($req_data['horaEstimada'])   : null
            );

            $this->updateElement($element, $req_data);

            $this->entityManager->persist($element);
            $this->entityManager->flush();

            return $response
                ->withAddedHeader('Location', $request->getUri() . '/' . $element->getId())
                ->withJson($element, StatusCode::STATUS_CREATED);

        } catch (\Exception $e) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        assert($request->getMethod() === 'DELETE');

        if (!$this->checkGestorScope($request)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $operationId = $args['operationId'] ?? '';
        if (empty($operationId)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $element = $this->entityManager->getRepository(Operacion::class)->find($operationId);

        if (!$element instanceof Operacion) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        try {
            $this->entityManager->remove($element);
            $this->entityManager->flush();

            return $response->withStatus(StatusCode::STATUS_NO_CONTENT);

        } catch (\Exception $e) {
            return Error::createResponse($response, StatusCode::STATUS_INTERNAL_SERVER_ERROR);
        }
    }

    public function put(Request $request, Response $response, array $args): Response
    {
        assert($request->getMethod() === 'PUT');

        if (!$this->checkGestorScope($request)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $req_data    = (array) $request->getParsedBody();
        $operationId = $args['operationId'] ?? '';


        if (empty($operationId)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $this->entityManager->beginTransaction();

        /** @var Operacion|null $element */
        $element = $this->entityManager->getRepository(Operacion::class)->find($operationId);

        if (!$element instanceof Operacion) {
            $this->entityManager->rollback();
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $etag    = md5((string) json_encode($element));
        $ifMatch = trim(current($request->getHeader('If-Match')));
        if ($ifMatch !== $etag) {
            $this->entityManager->rollback();
            return Error::createResponse($response, StatusCode::STATUS_PRECONDITION_REQUIRED);
        }

        if (isset($req_data['codigo']) && $this->verifyStringInput($req_data['codigo'], 10)) {
            $existing = $this->entityManager->createQuery(
                'SELECT o FROM TDW\IPanel\Model\Operacion o WHERE o.codigo = :codigo'
            )->setParameter('codigo', $req_data['codigo'])
            ->getOneOrNullResult();
            
            if ($existing instanceof Operacion && $existing->getId() !== $operationId) {
                $this->entityManager->rollback();
                return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
            }
            $element->setCodigo($req_data['codigo']);
        }
        
        try {
            if (isset($req_data['operadorId'])) {
                $operador = $this->entityManager->getRepository(Operador::class)->find($req_data['operadorId']);
                if ($operador) $element->setOperador($operador);
            }
            if (isset($req_data['puntoId'])) {
                $punto = $this->entityManager->getRepository(Punto::class)->find($req_data['puntoId']);
                if ($punto) $element->setPunto($punto);
            }

            $this->updateElement($element, $req_data);

            $this->entityManager->flush();
            $this->entityManager->commit();

            return $response
                ->withStatus(209, 'Content Returned')
                ->withJson($element);

        } catch (\Exception $e) {
            $this->entityManager->rollback();
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }
    }

    private function updateElement(Operacion $element, array $data): void
    {
        if (isset($data['tipo'])) {
            $element->setTipo($data['tipo']);
        }
        if (isset($data['sentido'])) {
            $element->setSentido($data['sentido']);
        }
        if (isset($data['origen'])) {
            $element->setOrigen($data['origen']);
        }
        if (isset($data['destino'])) {
            $element->setDestino($data['destino']);
        }
        if (isset($data['horaEstimada'])) {
            $element->setHoraEstimada(new \DateTime($data['horaEstimada']));
        }
        if (isset($data['estado'])) {
            $element->setEstado($data['estado']);
        }
    }
}