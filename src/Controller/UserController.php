<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Exception;
use Antxony\Handler\Response;
use App\Entity\User;

/**
 * @Route("/api/user")
 */
class UserController extends AbstractController
{

    protected Security $security;

    protected UserRepository $rep;

    protected UserPasswordEncoderInterface $passwordEncoder;

    protected Response $response;

    public function __construct(
        Security $security,
        UserRepository $rep,
        UserPasswordEncoderInterface $passwordEncoder,
        Response $response
    ) {
        $this->security = $security;
        $this->rep = $rep;
        $this->passwordEncoder = $passwordEncoder;
        $this->response = $response;
    }

    public function getActualUser(): User
    {
        return $this->rep->findOneBy([
            'username' => $this->security->getUser()->getUsername()
        ]);
    }

    /**
     * @Route("/refresh_token", name="user_refresh_token", methods={"GET"}, options={"expose"=true})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function refreshToken(JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        return new JsonResponse(["token" => $JWTManager->create($this->security->getUser())]);
    }

    /**
     * @Route("/profile", name="user_profile", methods={"GET"}, options={"expose"=true})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function profile(): JsonResponse
    {
        try {
            return $this->response->successNoLog(
                json_encode($this->security->getUser())
            );
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }

    /**
     * @Route("/profile/password/", name="user_profile_change_password", methods={"PATCH"}, options={"expose"=true})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function updatePassword(Request $request): JsonResponse
    {
        try {
            $content = json_decode($request->getContent());
            $user = $this->rep->findOneBy([
                "username" => $this->security->getUser()->getUsername()
            ]);
            if (!$this->passwordEncoder->isPasswordValid($this->security->getUser(), $content->old)) {
                throw new Exception("La contraseña es incorrecta");
            }
            if ($content->new != $content->confirmNew) {
                throw new Exception("Las contraseñas no coinciden");
            }
            $user->setPassword(
                $this->passwordEncoder->encodePassword(
                    $user,
                    $content->new
                )
            );
            return $this->response->success(
                "Contraseña actualizada",
                "El usuario <b>{$user->getName()}</b>(<em>{$user->getUsername()}</em>) ha actualizado su contraseña"
            );
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }

    /**
     * @Route("/profile/{id}", name="user_profile_edit", methods={"PUT", "PATCH"}, options={"expose"=true})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function edit(Request $request): JsonResponse
    {
        try {
            $what = "";
            $content = json_decode($request->getContent());
            $user = $this->rep->findOneBy(
                ["username" => $this->security->getUser()->getUsername()]
            );
            if (trim($content->value) === "") {
                throw new Exception("El valor no puede estar vacío");
            }
            if ($content->name == "username") {
                $user->setUserName($content->value);
                $what = "usuario";
            }
            if ($content->name == "email") {
                $user->setEmail($content->value);
                $what = "correo";
            }
            if ($content->name == "name") {
                $user->setName($content->value);
                $what = "nombre";
            }
            $whatCap = ucfirst($what);
            return $this->response->success(
                "<b>{$whatCap}</b> actualizado",
                "El usuario <b>{$user->getName()}</b> (<em>{$user->getUsername()}</em>) ha actualizado su {$what}"
            );
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }

    /**
     * @Route("/password/{id}", name="user_change_password", methods={"PATCH"}, options={"expose"=true})
     * @IsGranted("ROLE_DEV")
     */
    public function updateUserPassword(int $id, Request $request): JsonResponse
    {
        try {
            $content = json_decode($request->getContent());
            $user = $this->rep->findOneBy([
                "id" => $id
            ]);
            if ($content->new != $content->confirmNew) {
                throw new Exception("Las contraseñas no coinciden");
            }
            if ($user->hasRole("ROLE_DEV") && !$this->getActualUser()->hasRole("ROLE_DEV")) {
                throw new Exception("<strong>No se puede cambiar la contraseña del desarrolador</strong>");
            }
            $user->setPassword(
                $this->passwordEncoder->encodePassword(
                    $user,
                    $content->new
                )
            );
            return $this->response->success(
                "Contraseña actualizada",
                "Se ha actualizado la contraseña del usuario <b>{$user->getName()}</b>(<em>{$user->getUsername()}</em>)"
            );
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }

    /**
     * Undocumented function
     *
     * @param integer $id
     * @param JWTTokenManagerInterface $jtw
     * @return JsonResponse
     */
    public function impersonate(int $id, JWTTokenManagerInterface $jtw): JsonResponse
    {
        $user = $this->rep->find($id);
        return new JsonResponse(["token" => $jtw->create($user)]);
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
            if ($user->hasRole("ROLE_DEV") && !$this->getActualUser()->hasRole("ROLE_DEV")) {
                throw new Exception("<strong>No se puede eliminar a este usuario</strong>");
            }
            $name = $user->getName();
            $username = $user->getUsername();
            $this->getDoctrine()->getManager()->remove($user);
            return $this->response->success("Se ha eliminado al usuario <b>{$name}</b> (<em>{$username}</em>)");
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }

    /**
     * @Route("/{id}", name="user_edit", methods={"PUT", "PATCH"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $what = "";
            $content = json_decode($request->getContent());
            $user = $this->rep->findOneBy(
                ['id' => $id]
            );
            if (!$user) {
                throw new Exception("No se pudo encontrar al usuario");
            }
            if ($user->hasRole("ROLE_DEV") && !$this->getActualUser()->hasRole("ROLE_DEV")) {
                throw new Exception("No se puede editar a este usuario");
            }
            if (!is_array($content->value) && trim($content->value) === "") {
                throw new Exception("El valor no puede estar vacío");
            }
            if ($content->name == "username") {
                $user->setUserName($content->value);
                $what = "usuario";
            }
            if ($content->name == "email") {
                $user->setEmail($content->value);
                $what = "correo";
            }
            if ($content->name == "name") {
                $user->setName($content->value);
                $what = "nombre";
            }
            if ($content->name == "roles") {
                $user->setRoles($content->value);
                $what = "puesto";
            }
            $whatCap = ucfirst($what);
            return $this->response->success(
                "<b>{$whatCap}</b> actualizado",
                "Se ha cambiado el <b>{$what}</b> para el usaurio <b>{$user->getName()}</b> (<em>{$user->getUsername()}</em>)"
            );
        } catch (Exception $e) {
            return $this->response->error($e);
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
                if($entity->hasRole("ROLE_DEV")) {
                    if($this->getActualUser()->hasRole("ROLE_DEV")) {
                        $result[] = $entity;        
                    }
                } else {
                    $result[] = $entity;
                }
            }
            return $this->response->successNoLog(json_encode([
                "entities" => $result,
                "maxPages" => $maxPages,
                "showed" => $showed,
                "total" => $entities->count(),
            ]));
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }
}
