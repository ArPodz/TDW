<?php

namespace TDW\IPanel\Controller\Spot;

use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\EntityManager;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use Slim\Routing\RouteContext;
use TDW\IPanel\Controller\TraitController;
use TDW\IPanel\Model\Punto;
use TDW\IPanel\Utility\Error;

/**
 * Class SpotQueryController
 */
class SpotQueryController
{
    use TraitController;

    const string PATH_SPOTS = '/spots';

    public function __construct(
        protected readonly EntityManager $entityManager
    ) { }

    public function cget(Request $request, Response $response): Response
    {
        assert(in_array($request->getMethod(), [ 'GET', 'HEAD' ], true));

        $criteria = $this->buildCriteria($request->getQueryParams());
        $elements = $this->entityManager
            ->getRepository(Punto::class)
            ->matching($criteria)
            ->toArray();

        if (0 === count($elements)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $etagData = array_map(fn($e) => $e->getId() . $e->getCodigo(), $elements);
        $etag = md5(serialize($etagData));

        if ($request->hasHeader('If-None-Match') && in_array($etag, $request->getHeader('If-None-Match'), true)) {
            return $response->withStatus(StatusCode::STATUS_NOT_MODIFIED);
        }

        return $response
            ->withAddedHeader('ETag', $etag)
            ->withAddedHeader('Cache-Control', 'private')
            ->withJson([ 'puntos' => $elements ]);
    }

    public function get(Request $request, Response $response, array $args): Response
    {
        assert(in_array($request->getMethod(), [ 'GET', 'HEAD' ], true));

        $id = intval($args['spotId'] ?? 0);

        if (!$this->verifyInputId($id)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $element = $this->entityManager->getRepository(Punto::class)->find($id);

        if (!$element instanceof Punto) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $etag = md5($element->getId() . $element->getCodigo());

        if ($request->hasHeader('If-None-Match') && in_array($etag, $request->getHeader('If-None-Match'), true)) {
            return $response->withStatus(StatusCode::STATUS_NOT_MODIFIED); 
        }

        return $response
            ->withAddedHeader('ETag', $etag)
            ->withAddedHeader('Cache-Control', 'private')
            ->withJson($element);
    }

    public function getElementByName(Request $request, Response $response, array $args): Response
    {
        assert($request->getMethod() === 'GET');

        $name = $args['spotName'] ?? '';
        
        if (empty($name)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $element = $this->entityManager->getRepository(Punto::class)
            ->findOneBy([ 'codigo' => $name ]);

        if (!$element instanceof Punto) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        return $response->withStatus(StatusCode::STATUS_NO_CONTENT); // 204
    }

    public function options(Request $request, Response $response): Response
    {
        assert($request->getMethod() === 'OPTIONS');

        $routeContext = RouteContext::fromRequest($request);
        $routingResults = $routeContext->getRoutingResults();
        $methods = $routingResults->getAllowedMethods();

        return $response
            ->withHeader('Allow', implode(', ', $methods))
            ->withStatus(StatusCode::STATUS_NO_CONTENT);
    }

    private function buildCriteria(array $params): Criteria
    {
        $criteria = new Criteria();
    
        $orderField = 'puntoId'; 
        if (isset($params['order'])) {
            $requested = ($params['order'] === 'id') ? 'puntoId' : $params['order'];
            if (in_array($requested, ['puntoId', 'codigo'], true)) {
                $orderField = $requested;
            }
        }

        $ordering = (isset($params['ordering']) && strtoupper($params['ordering']) === 'DESC') 
            ? Criteria::DESC 
            : Criteria::ASC;

        $criteria->orderBy([$orderField => $ordering]);

        if (!empty($params['name'])) {
            $txtName = $params['name'];
            $criteria->andWhere(Criteria::expr()->contains('codigo', $txtName));
        }

        return $criteria;
    }
}
