<?php

use App\Kernel;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\ErrorHandler\Debug;
use Symfony\Component\HttpFoundation\Request;

define("IS_WINDOWS", strtoupper(substr(PHP_OS, 0, 3)) === 'WIN');
if(IS_WINDOWS) {
    setlocale(LC_TIME, "esm.utf8");
} else {
    setlocale(LC_TIME, "es_MX.UTF8");
}
date_default_timezone_set("America/Mexico_City");

require dirname(__DIR__).'/vendor/autoload.php';

(new Dotenv())->bootEnv(dirname(__DIR__).'/.env');

if ($_SERVER['APP_DEBUG']) {
    umask(0000);

    Debug::enable();
}

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
