<?php

namespace App\Controller;


use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;

class AuthController extends ApiController
{

    public function register(Request $request, UserPasswordEncoderInterface $encoder)
    {
        $em = $this->getDoctrine()->getManager();
        $request = $this->transformJsonBody($request);
        $username = $request->get('username');
        $password = $request->get('password');
        $email = $request->get('email');
        $name = $request->get('name');
        try {
            if (empty($username) || empty($password) || empty($email) || empty($name)) {
                throw new \Exception("Datos incompletos.");
            }
            $user = new User($username);
            $user->setPassword($encoder->encodePassword($user, $password));
            $user->setEmail($email);
            $user->setUsername($username);
            $user->setName($name);
            $em->persist($user);
            $em->flush();
            return $this->setStatusCode(201)->respondWithSuccess(sprintf('Usuario %s creado.', $user->getUsername()));
        } catch (UniqueConstraintViolationException $e) {
            if(strpos($e->getMessage(), User::FK_USERNAME) !== false){
                $message = "El usuario <b>{$username}</b> ya existe.";
            } elseif (strpos($e->getMessage(), User::FK_MAIL)) {
                $message = "El correo <b>{$email}</b> ya está en uso.";
            } else {
                $message = $e->getMessage();
            }
            return $this->respondValidationError($message);
        } catch (\Exception $e) {
            return $this->respondValidationError($e->getMessage());
        }
    }

    /**
     * @param UserInterface $user
     * @param JWTTokenManagerInterface $JWTManager
     * @return JsonResponse
     */
    public function getTokenUser(UserInterface $user, JWTTokenManagerInterface $JWTManager)
    {
        return new JsonResponse(['token' => $JWTManager->create($user)]);
    }
}
