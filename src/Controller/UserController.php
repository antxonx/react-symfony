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
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Exception;

/**
 * @Route("/api/user")
 */
class UserController extends AbstractController
{

    protected Security $security;

    protected UserRepository $rep;

    protected UserPasswordEncoderInterface $passwordEncoder;

    public function __construct(Security $security, UserRepository $rep, UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->security = $security;
        $this->rep = $rep;
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * @Route("/refresh_token", name="user_refresh_token", methods={"GET"}, options={"expose"=true})
     */
    public function refreshToken(JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        return new JsonResponse(["token" => $JWTManager->create($this->security->getUser())]);
    }

    /**
     * @Route("/profile", name="user_profile", methods={"GET"}, options={"expose"=true})
     */
    public function profile(): JsonResponse
    {
        return new JsonResponse($this->security->getUser());
    }

    /**
     * @Route("/profile/password/", name="user_profile_change_password", methods={"PATCH"}, options={"expose"=true})
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent());
        $user = $this->rep->findOneBy([
            "username" => $this->security->getUser()->getUsername()
        ]);
        if (!$this->passwordEncoder->isPasswordValid($this->security->getUser(), $content->old)) {
            return new JsonResponse(["code" => 400, "message" => "La contraseña es incorrecta"], 400);
        }
        if ($content->new != $content->confirmNew) {
            return new JsonResponse(["code" => 400, "message" => "Las contraseñas no coinciden"], 400);
        }
        $user->setPassword(
            $this->passwordEncoder->encodePassword(
                $user,
                $content->new
            )
        );
        $this->getDoctrine()->getManager()->flush();
        return new JsonResponse("ok");
    }

    /**
     * @Route("/profile/{id}", name="user_profile_edit", methods={"PUT", "PATCH"}, options={"expose"=true})
     */
    public function edit(Request $request, JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        try {
            $content = json_decode($request->getContent());
            $user = $this->rep->findOneBy(
                ["username" => $this->security->getUser()->getUsername()]
            );
            if ($content->name == "username") {
                $user->setUserName($content->value);
            }
            if ($content->name == "email") {
                $user->setEmail($content->value);
            }
            if ($content->name == "name") {
                $user->setName($content->value);
            }
            $this->getDoctrine()->getManager()->flush();
            return new JsonResponse("Dato actualizado");
        } catch (Exception $e) {
            return new JsonResponse(["code" => 400, "message" => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("", name="user_all", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function getUsers(): JsonResponse
    {
        try {
            $users = $this->rep->findAll();
            return new JsonResponse($users);
        } catch (Exception $e) {
            return new JsonResponse(["code" => 400, "message" => $e->getMessage()], 400);
        }
    }
}
