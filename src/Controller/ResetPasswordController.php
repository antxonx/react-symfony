<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Exception;
use Symfony\Component\HttpFoundation\Request;
use App\Antxony\Handler\Response;
use App\Entity\ResetPassword;
use App\Repository\ResetPasswordRepository;
use DateTime;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * ResetPasswordController class
 * @package App\Controller
 * @Route("/reset_password")
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class ResetPasswordController extends AbstractController
{

    protected UserRepository $uRep;

    protected ResetPasswordRepository $rep;

    protected Response $response;

    protected UserPasswordEncoderInterface $passwordEncoder;

    public function __construct(
        UserRepository $uRep, 
        ResetPasswordRepository $rep, 
        Response $response,
        UserPasswordEncoderInterface $passwordEncoder
        )
    {
        $this->uRep = $uRep;
        $this->rep = $rep;
        $this->response = $response;
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * Request reset password
     * 
     * @Route("", name="reset_password", methods={"POST"}, options={"expose"=true})
     */
    public function reset(Request $request): JsonResponse
    {
        try {
            $infoLog = false;
            $content = json_decode($request->getContent());
            if (!filter_var($content->email, FILTER_VALIDATE_EMAIL)) {
                throw new Exception("El formato del correo no es correcto");
            }
            $user = $this->uRep->findOneBy([
                "email" => $content->email
            ]);
            if ($user) {
                $infoLog = true;
                $em = $this->getDoctrine()->getManager();
                $exists = $this->rep->findOneBy([
                    "user" => $user->getId()
                ]);
                if ($exists) {
                    $em->remove($exists);
                    $em->flush();
                }
                $creation = new DateTime("now");
                $expires = new DateTime("now +1 hour");
                $token = $this->genToken([
                    $user->getUsername(),
                    $creation->format("Y-m-d_H:i:s"),
                    $expires->format("Y-m-d_H:i:s")
                ]);
                $resetPassword = (new ResetPassword())
                    ->setUser($user)
                    ->setCreatedAt($creation)
                    ->setExpiresAt($expires)
                    ->setToken($token);
                $em->persist($resetPassword);
                $em->flush();
                $mail = new PHPMailer(true);
                $mail->setFrom($_ENV["RESET_PASSWORD_EMAIL"]);
                $mail->addAddress($content->email, $user->getName());
                $mail->CharSet = "UTF-8";
                $mail->isHTML(true);
                $mail->Subject = "Recuperación de contraseña en Sistema";
                $mail->Body = $this->renderView("emails/resetPassword.html.twig", [
                    'token' => $token,
                    'name' => $user->getName(),
                ]);
                $mail->AltBody = "";
                $mail->send();
            }
            if($infoLog) {
                return $this->response->success(
                    "Se ha enviado un enlace de recuperación a <b>{$content->email}</b>",
                    "El usuario <b>{$user->getName()}</b>(<em>{$user->getUsername()}</em>) ha solicitado recuperar su contraseña"
                );
            } else {
                return $this->response->successNoLog(
                    "Se ha enviado un enlace de recuperación a <b>{$content->email}</b>"
                );
            }
        } catch (PHPMailerException $e) {
            return $this->response->error($e);
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }

    /**
     * Confirm token and get user
     * 
     * @Route("/{token}", name="reset_password_confirm", methods={"GET"}, options={"expose"=true})
     */
    public function resetForm(string $token) : JsonResponse
    {
        try {
            $em = $this->getDoctrine()->getManager();
            $resetPassword = $this->rep->findOneBy([
                "token" => $token
            ]);
            if ($resetPassword) {
                $tokenN = $this->genToken([
                    $resetPassword->getUser()->getUsername(),
                    $resetPassword->getCreatedAt()->format("Y-m-d_H:i:s"),
                    $resetPassword->getExpiresAt()->format("Y-m-d_H:i:s"),
                ]);
                if ($tokenN !== $token) {
                    throw new Exception("El token no coincide con los datos"); //????
                }
                if ($resetPassword->getCreatedAt() >= new DateTime("now")) {
                    $em->remove($resetPassword);
                    $em->flush();
                    $resetPassword = null;
                }
            }
            if (!$resetPassword) {
                throw new Exception("El token no existe o ya expiró");
            }
            return $this->response->successNoLog(json_encode([
                "username" => $resetPassword->getUser()->getUsername(),
                "name" => $resetPassword->getUser()->getName(),
            ]));
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }

    /**
     * Cambiar contraseña
     * 
     * @Route("/{username}", name="reset_password_reset", methods={"POST"}, options={"expose"=true})
     */
    public function changePassword(string $username,  Request $request): JsonResponse
    {
        try {
            $content = json_decode($request->getContent());
            $user = $this->uRep->findOneBy([
                "username" => $username
            ]);
            if ($content->new != $content->confirmNew) {
                throw new Exception("Las contraseñas no coinciden");
            }
            $user->setPassword(
                $this->passwordEncoder->encodePassword(
                    $user,
                    $content->new
                )
            );
            $resetPassword = $this->rep->findOneBy([
                "user" => $user->getId()
            ]);
            $this->getDoctrine()->getManager()->remove($resetPassword);

            $mail = new PHPMailer(true);
            $mail->setFrom($_ENV["ALERT_EMAIL"]);
            $mail->addAddress($user->getEmail(), $user->getName());
            $mail->CharSet = "UTF-8";
            $mail->isHTML(true);
            $mail->Subject = "Cambio de contraseña en Sistema";
            $mail->Body = $this->renderView("emails/changedPassword.html.twig", [
                "name" => $user->getName()
            ]);
            $mail->AltBody = "";
            $mail->send();

            return $this->response->success(
                "Contraseña actualizada",
                "El usuario <b>{$user->getName()}</b>(<em>{$user->getUsername()}</em>) ha recuperado acceso al sistema"
            );
        } catch (Exception $e) {
            return $this->response->error($e);
        }
    }

    private function genToken(array $args)
    {
        $preToken = "";
        foreach ($args as $arg) {
            $preToken .= "{$arg}.";
        }
        $preToken = substr($preToken, 0, strlen($preToken) - 1);
        return sha1(base64_encode($preToken));
    }
}
