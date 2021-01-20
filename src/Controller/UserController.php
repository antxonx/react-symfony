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
     * @Route("/{id}", name="user_delete", methods={"DELETE"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function delete(int $id): JsonResponse
    {
        try {
            $user = $this->rep->findOneBy(
                ["id" => $id]
            );
            if (!$user) {
                throw new Exception("No se encontró a usuario");
            }
            $name = $user->getName();
            $em = $this->getDoctrine()->getManager();
            $em->remove($user);
            $em->flush();
            return new JsonResponse(["message" => "Se ha eliminado al usuario <b>{$name}</b>"]);
        } catch (Exception $e) {
            return new JsonResponse(["code" => 400, "message" => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("", name="user_all", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function getUsers(Request $request): JsonResponse
    {
        try {
            $result = [];
            $params = json_decode(json_encode($request->query->all()));
            $entities = $this->rep->getBy($params);
            $total = $params->page * $this->rep::MAX_ENTITIES;
            $showed = (($total > $entities->count()) ? $entities->count() : $total);
            $maxPages = ceil($entities->count() / $this->rep::MAX_ENTITIES);
            foreach ($entities as $entity) {
                $result[] = $entity;
            }
            return new JsonResponse([
                "entities" => $result,
                "maxPages" => $maxPages,
                "showed" => $showed,
                "total" => $entities->count()
            ]);
        } catch (Exception $e) {
            return new JsonResponse(["code" => 400, "message" => $e->getMessage()], 400);
        }
    }
}
