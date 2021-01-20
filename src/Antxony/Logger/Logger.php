<?php

/**
 * Error and Info logs
 */

namespace Antxony\Logger;

use App\Entity\ErrorLog;
use App\Entity\InfoLog;
use Doctrine\ORM\EntityManagerInterface;
use Monolog\Handler\AbstractProcessingHandler;
use Monolog\Logger as MonologLogger;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Security;

/**
 * Logger class to generate error and info logs and insert on DB
 *
 * @package Antxony
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class Logger extends AbstractProcessingHandler
{
    /**
     * Initialized service
     *
     * @var bool
     */
    private $initialized;

    /**
     * Security (for logged user)
     *
     * @var Security
     */
    protected $security;

    /**
     * System register
     *
     * @var bool
     */
    public const LOG_SYSTEM = true;

    /**
     * User register
     *
     * @var bool
     */
    public const LOG_USER = false;

    /**
     * Entity Manager to store logs in DB
     *
     * @var EntityManagerInterface
     */
    private $em;

    /**
     * Router to get route and method
     *
     * @var RouterInterface
     */
    private $router;

    /**
     * Constructor
     *
     * @param EntityManagerInterface $em
     * @param RouterInterface $router
     * @param Security $security
     */
    public function __construct(EntityManagerInterface $em, RouterInterface $router, Security $security)
    {
        parent::__construct();
        $this->security = $security;
        $this->em = $em;
        $this->router = $router;
    }

    /**
     * write log into DB
     *
     * @param array $record información completa del registro
     * @return void
     */
    protected function write(array $record): void
    {
        if (!$this->initialized) {
            $this->initialize();
        }
        if (
            $record['level'] == MonologLogger::NOTICE ||
            $record['level'] ==  MonologLogger::INFO
        ) {
            if (
                $record['level'] == MonologLogger::INFO &&
                !(isset($record['context']['user_log']) &&
                    $record['context']['user_log'])
            ) {
                return;
            }
            if (!$this->em->isOpen()) {
                $this->em = $this->em->create(
                    $this->em->getConnection(),
                    $this->em->getConfiguration()
                );
            }
            $system = self::LOG_SYSTEM;
            if (
                isset($record['context']['user_log']) &&
                $record['context']['user_log']
            ) {
                $system = self::LOG_USER;
            }
            $infoLog = (new InfoLog)
                ->setRoute($this->router->getContext()->getPathInfo())
                ->setMethod($this->router->getContext()->getMethod())
                ->setClientip($_SERVER['REMOTE_ADDR'])
                ->setLevel($record['level_name'])
                ->setSystem($system)
                ->setUser($this->security->getUser())
                ->setMessage($record['message']);
            $this->em->persist($infoLog);
            $this->em->flush();
        } elseif (
            $record['level'] == MonologLogger::ERROR ||
            $record['level'] == MonologLogger::WARNING ||
            $record['level'] == MonologLogger::CRITICAL ||
            $record['level'] == MonologLogger::ALERT ||
            $record['level'] == MonologLogger::EMERGENCY ||
            $record['level'] == MonologLogger::API
        ) {
            if (!$this->em->isOpen()) {
                $this->em = $this->em->create(
                    $this->em->getConnection(),
                    $this->em->getConfiguration()
                );
            }
            $file = "";
            $line = 0;
            $system = true;
            if (
                isset($record['context']['user_log']) &&
                $record['context']['user_log']
            ) {
                $system = false;
                $file = $record['context']['file'];
                $line = $record['context']['line'];
            } elseif (isset($record['context']['exception'])) {
                $file = $record['context']['exception']->getFile();
                $line = $record['context']['exception']->getLine();
            } elseif (isset($record['context']['route_parameters']['_controller'])) {
                $file = $record['context']['route_parameters']['_controller'];
            }
            $errorLog = (new ErrorLog)
                ->setFile($file)
                ->setRoute($this->router->getContext()->getPathInfo())
                ->setLine($line)
                ->setClientip($_SERVER['REMOTE_ADDR'])
                ->setMethod($this->router->getContext()->getMethod())
                ->setLevel($record['level_name'])
                ->setSystem($system)
                ->setUser($this->security->getUser())
                ->setMessage($record['message']);
            $this->em->persist($errorLog);
            $this->em->flush();
        }
    }

    /**
     * initialize service
     *
     * @return void
     */
    private function initialize()
    {
        $this->initialized = true;
    }
}
