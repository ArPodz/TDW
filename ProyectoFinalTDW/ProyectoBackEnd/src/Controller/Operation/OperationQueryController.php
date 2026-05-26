<?php

namespace TDW\IPanel\Controller\Operation;

use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\EntityManager;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use Slim\Routing\RouteContext;
use TDW\IPanel\Controller\TraitController;
use TDW\IPanel\Model\Operacion;
use TDW\IPanel\Utility\Error;

class OperationQueryController
{
    use TraitController;

    const string PATH_OPERATIONS = '/operations';

    public function __construct(
        protected readonly EntityManager $entityManager
    ) { }

    public function cget(Request $request, Response $response): Response
    {
        $params = $request->getQueryParams();
        $criteria = $this->buildCriteria($params);

        $elements = $this->entityManager
            ->getRepository(Operacion::class)
            ->matching($criteria)
            ->getValues();

        if (0 === count($elements)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $etag = md5((string) json_encode($elements));
        if ($request->hasHeader('If-None-Match') && in_array($etag, $request->getHeader('If-None-Match'), true)) {
            return $response->withStatus(StatusCode::STATUS_NOT_MODIFIED);
        }

        return $response
            ->withAddedHeader('ETag', $etag)
            ->withAddedHeader('Cache-Control', 'private')
            ->withJson([ 'operaciones' => $elements ]);
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        $id = $args['operationId'] ?? '';
        
        $element = $this->entityManager->getRepository(Operacion::class)->find($id);

        if (!$element instanceof Operacion) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $etag = md5((string) json_encode($element));
        if (in_array($etag, $request->getHeader('If-None-Match'), true)) {
            return $response->withStatus(StatusCode::STATUS_NOT_MODIFIED);
        }

        return $response
            ->withAddedHeader('ETag', $etag)
            ->withAddedHeader('Cache-Control', 'private')
            ->withJson($element);
    }

    public function options(Request $request, Response $response): Response
    {
        $routeContext = RouteContext::fromRequest($request);
        $routingResults = $routeContext->getRoutingResults();
        $methods = $routingResults->getAllowedMethods();

        return $response
            ->withAddedHeader('Allow', implode(', ', $methods))
            ->withStatus(204);
    }

    private function buildCriteria(array $params): Criteria
    {
        $criteria = new Criteria();

        $allowedOrderFields = ['codigo', 'horaProgramada', 'destino', 'operador'];

        $orderField = 'horaProgramada';
        if (isset($params['order']) && in_array($params['order'], $allowedOrderFields, true)) {
            $orderField = $params['order'];
        }

        $ordering = 'ASC';
        if (isset($params['ordering']) && strtoupper($params['ordering']) === 'DESC') {
            $ordering = 'DESC';
        }

        $criteria->orderBy([$orderField => $ordering]);

        return $criteria;
    }

    public function getElementByCode(Request $request, Response $response, array $args): Response
    {
        $codigoBuscado = $args['codigo'] ?? '';

        if ($codigoBuscado === '') {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $operacion = $this->entityManager
            ->getRepository(Operacion::class)
            ->findOneBy(['codigo' => $codigoBuscado]);

        if ($operacion instanceof Operacion) {
            return $response->withStatus(StatusCode::STATUS_NO_CONTENT);
        }

        return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
    }
}