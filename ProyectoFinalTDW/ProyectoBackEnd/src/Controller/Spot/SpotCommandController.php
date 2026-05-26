<?php

namespace TDW\IPanel\Controller\Spot;

use Doctrine\ORM;
use Fig\Http\Message\StatusCodeInterface as StatusCode;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Http\Response;
use TDW\IPanel\Controller\TraitController;
use TDW\IPanel\Model\Punto;
use TDW\IPanel\Utility\Error;

/**
 * Class SpotCommandController
 */
class SpotCommandController
{
    use TraitController;

    public function __construct(
        protected ORM\EntityManager $entityManager
    ) { }

    /**
     * Summary: Creates a new Spot
     */
    public function post(Request $request, Response $response): Response
    {
        assert($request->getMethod() === 'POST');

        if (!$this->checkGestorScope($request)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $req_data = (array) $request->getParsedBody();

        if (!$this->verifyStringInput($req_data['codigo'] ?? '', 10) 
            || !$this->verifyStringInput($req_data['tipo'] ?? '', 10)) {
            return Error::createResponse($response, StatusCode::STATUS_UNPROCESSABLE_ENTITY);
        }

        $puntoRepository = $this->entityManager->getRepository(Punto::class);
        $puntoExists = $puntoRepository->findOneBy(['codigo' => $req_data['codigo']]);

        if ($puntoExists instanceof Punto) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }

        try {
            $element = new Punto($req_data['tipo'], $req_data['codigo']);

            $this->entityManager->persist($element);
            $this->entityManager->flush();
            $this->entityManager->refresh($element); 

            return $response
                ->withAddedHeader(
                    'Location',
                    $request->getUri() . '/' . $element->getId()
                )
                ->withJson($element, StatusCode::STATUS_CREATED);

        } catch (\Exception $e) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }
    }

    /**
     * Summary: Updates an element
     */
    public function put(Request $request, Response $response, array $args): Response
    {
        assert($request->getMethod() === 'PUT');

        if (!$this->checkGestorScope($request)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $req_data = (array) $request->getParsedBody();
        $id = (int) ($args['spotId'] ?? 0);

        if (!$this->verifyInputId($id)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $element = $this->entityManager->getRepository(Punto::class)->find($id);

        if (!$element instanceof Punto) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $etag = md5($element->getId() . $element->getCodigo());
        
        $headerIfMatch = $request->getHeader('If-Match');
        $ifMatch = !empty($headerIfMatch) ? trim($headerIfMatch[0], '" ') : '';

        if ($ifMatch !== $etag) {
            return Error::createResponse($response, StatusCode::STATUS_PRECONDITION_REQUIRED);
        }

        try {
            $this->entityManager->beginTransaction();

            if (isset($req_data['codigo'])) {
                $existing = $this->entityManager->getRepository(Punto::class)->findOneBy(['codigo' => $req_data['codigo']]);
                if ($existing instanceof Punto && $existing->getId() !== $element->getId()) {
                    $this->entityManager->rollback();
                    return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
                }
                $element->setCodigo($req_data['codigo']);
            }

            if (isset($req_data['tipo'])) {
                $element->setTipo($req_data['tipo']);
            }

            $this->entityManager->flush();
            $this->entityManager->commit();

            return $response
                ->withStatus(209, 'Content Returned')
                ->withJson($element);

        } catch (\Exception $e) {
            if ($this->entityManager->isOpen() && $this->entityManager->getConnection()->isTransactionActive()) {
                $this->entityManager->rollback();
            }
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }
    }

    /**
     * Summary: Remove an item
     */
    public function delete(Request $request, Response $response, array $args): Response
    {
        assert($request->getMethod() === 'DELETE');

        if (!$this->checkGestorScope($request)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $id = (int) ($args['spotId'] ?? 0);
        if (!$this->verifyInputId($id)) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        $element = $this->entityManager->getRepository(Punto::class)->find($id);

        if (!$element instanceof Punto) {
            return Error::createResponse($response, StatusCode::STATUS_NOT_FOUND);
        }

        try {
            $this->entityManager->remove($element);
            $this->entityManager->flush();

            return $response->withStatus(StatusCode::STATUS_NO_CONTENT);
                
        } catch (\Exception $e) {
            return Error::createResponse($response, StatusCode::STATUS_BAD_REQUEST);
        }
    }
}