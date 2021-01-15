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
use Symfony\Component\Validator\Constraints\Json;

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
     * @Route("/profile", name="user_profile", methods={"GET"}, options={"expose"=true})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function me(): JsonResponse
    {
        return new JsonResponse($this->security->getUser());
    }

    /**
     * @Route("/profile/password/", name="user_profile_change_password", methods={"PATCH"}, options={"expose"=true})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $content = json_decode($request->getContent());
        $user = $this->rep->findOneBy([
            "username" => $this->security->getUser()->getUsername()
        ]);
        if (!$this->passwordEncoder->isPasswordValid($this->security->getUser(), $content->old)) {
            return new JsonResponse("La contraseña es incorrecta", 400);
        }
        if ($content->new != $content->confirmNew) {
            return new JsonResponse("Las contraseñas no coinciden", 400);
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
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function edit(Request $request, JWTTokenManagerInterface $JWTManager): JsonResponse
    {
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
        return new JsonResponse($JWTManager->create($user));
    }
}
