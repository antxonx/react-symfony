<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Request;

/**
 * @Route("/api/user")
 */
class UserController extends AbstractController
{

    protected Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @Route("/profile", name="user_profile", methods={"GET"}, options={"expose"=true})
     */
    public function me(): JsonResponse
    {
        return new JsonResponse($this->security->getUser());
    }

    /**
     * @Route("/profile/{id}", name="user_profile_edit", methods={"PUT", "PATCH"}, options={"expose"=true})
     */
    public function edit(Request $request, UserRepository $rep, JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        $content = json_decode($request->getContent());
        $user = $rep->findOneBy(
            ["username" => $this->security->getUser()->getUsername()]
        );
        if($content->name == "username") {
            $user->setUserName($content->value);
        }
        if($content->name == "email") {
            $user->setEmail($content->value);
        }
        if($content->name == "name") {
            $user->setName($content->value);
        }
        $this->getDoctrine()->getManager()->flush();
        return new JsonResponse($JWTManager->create($user));
    }

}
