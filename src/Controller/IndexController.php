<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    /**
     * @Route("/{reactRouting}", name="index", requirements={"reactRouting"="^(?!(api|register)).+"}, defaults={"reactRouting": null}) 
     */
    public function index(): Response
    {
        return $this->render('index/index.html.twig');
    }

    /**
     * @Route("/api/checklogin", name="index_check_login", methods={"GET"})
     *
     */
    public function checkApi(): JsonResponse
    {
        return new JsonResponse("ok");
    }
}
