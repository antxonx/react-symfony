<?php

namespace App\Controller;

use App\Repository\InfoLogRepository;
use App\Repository\ErrorLogRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Antxony\Handler\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * LoggerController class
 * @package App\Controller
 * @Route("/api/logger")
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class LoggerController extends AbstractController
{
    protected ErrorLogRepository $eRep;

    protected UserRepository $uRep;

    protected InfoLogRepository $iRep;

    protected Response $response;

    public function __construct(
        ErrorLogRepository $eRep,
        InfoLogRepository $iRep,
        UserRepository $uRep,
        Response $response
    ) {
        $this->eRep = $eRep;
        $this->iRep = $iRep;
        $this->uRep = $uRep;
        $this->response = $response;
    }

    /**
     * get all info logs
     * 
     * @Route("/info", name="logger_info_list", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_DEV")
     */
    public function indexInfo(Request $request): JsonResponse
    {
        try {
            $result = [];
            $params = json_decode(json_encode($request->query->all()));
            $entities = $this->iRep->getBy($params);
            $showed = $params->page * $this->iRep::MAX_PER_PAGE;
            $maxPages = ceil($entities->count() / $this->iRep::MAX_PER_PAGE);
            foreach ($entities as $entity) {
                $result[] = $entity;
                $result[] = [
                    "id" => $entity->getId(),
                    "infoField" => true
                ];
            }
            return $this->response->successNoLog(
                json_encode([
                    'entities' => $result,
                    'maxPages' => $maxPages,
                    'showed' => (($showed > $entities->count()) ? $entities->count() : $showed),
                    'total' => $entities->count(),
                ])
            );
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }

    /**
     * get all error logs
     * 
     * @Route("/error", name="logger_error_list", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_DEV")
     */
    public function indexError(Request $request): JsonResponse
    {
        try {
            $result = [];
            $params = json_decode(json_encode($request->query->all()));
            $entities = $this->eRep->getBy($params);
            $showed = $params->page * $this->eRep::MAX_PER_PAGE;
            $maxPages = ceil($entities->count() / $this->eRep::MAX_PER_PAGE);
            foreach ($entities as $entity) {
                $result[] = $entity;
                $result[] = [
                    "id" => $entity->getId(),
                    "infoField" => true
                ];
            }
            return $this->response->successNoLog(
                json_encode([
                    'entities' => $result,
                    'maxPages' => $maxPages,
                    'showed' => (($showed > $entities->count()) ? $entities->count() : $showed),
                    'total' => $entities->count(),
                ])
            );
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }
}
