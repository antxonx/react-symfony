<?php

namespace App\Antxony\Handler;

use Exception;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response as RES;

/**
 * Response handler
 * 
 * @package Antxony
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class Response
{

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    public function error(Exception $e, int $code = RES::HTTP_BAD_REQUEST): JsonResponse
    {
        $this->logger->error($e->getMessage(), [
            'user_log' => true,
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
        if ((bool)$_ENV["APP_DEBUG"]) {
            return new JsonResponse([
                "code" => $code,
                "message" => $e->getFile() . ":" .  $e->getLine() . " " . $e->getMessage()
            ], $code);
        } else {
            return new JsonResponse([
                "code" => $code,
                "message" => $e->getMessage()
            ], $code);
        }
    }

    public function errorNoLog(Exception $e, int $code = RES::HTTP_BAD_REQUEST): JsonResponse
    {
        if ((bool)$_ENV["APP_DEBUG"]) {
            return new JsonResponse([
                "code" => $code,
                "message" => $e->getFile() . ":" .  $e->getLine() . " " . $e->getMessage()
            ], $code);
        } else {
            return new JsonResponse([
                "code" => $code,
                "message" => $e->getMessage()
            ], $code);
        }
    }

    public function success(string $message, string $messageLog = "", int $code = RES::HTTP_OK): JsonResponse
    {
        $loggerMessage = ((trim($messageLog) == "") ? $message : $messageLog);
        $this->logger->info($loggerMessage, [
            'user_log' => true
        ]);
        return new JsonResponse([
            "code" => $code,
            "message" => $message
        ], $code);
    }

    public function successNoLog(string $message, int $code = RES::HTTP_OK): JsonResponse
    {
        return new JsonResponse([
            "code" => $code,
            "message" => $message
        ], $code);
    }
}
