<?php

/**
 * InfoLog entity
 */

namespace App\Entity;

use App\Repository\InfoLogRepository;
use DateTime;
use DateTimeInterface;
use DateTimeZone;
use Doctrine\ORM\Mapping as ORM;
use Exception;

/**
 * @ORM\Entity(repositoryClass=InfoLogRepository::class)
 * @ORM\HasLifecycleCallbacks
 */
class InfoLog implements \JsonSerializable
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="text")
     */
    private $route;

    /**
     * @ORM\Column(type="text")
     */
    private $message;

    /**
     * @ORM\Column(type="string", length=25)
     */
    private $method;

    /**
     * @ORM\Column(type="string", length=25, nullable=true)
     */
    private $clientip;

    /**
     * @ORM\Column(type="string", length=25, nullable=true)
     */
    private $level;

    /**
     * @ORM\Column(type="boolean")
     */
    private $system;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="infoLogs")
     */
    private $user;

    /**
     * Undocumented function
     *
     * @return integer|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * Undocumented function
     *
     * @return DateTimeInterface|null
     */
    public function getCreatedAt(): ?DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * Undocumented function
     *
     * @param DateTimeInterface $createdAt
     * @return self
     */
    public function setCreatedAt(DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getRoute(): ?string
    {
        return $this->route;
    }

    /**
     * Undocumented function
     *
     * @param string $route
     * @return self
     */
    public function setRoute(string $route): self
    {
        $this->route = $route;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getMessage(): ?string
    {
        return $this->message;
    }

    /**
     * Undocumented function
     *
     * @param string $message
     * @return self
     */
    public function setMessage(string $message): self
    {
        $this->message = $message;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getMethod(): ?string
    {
        return $this->method;
    }

    /**
     * Undocumented function
     *
     * @param string $method
     * @return self
     */
    public function setMethod(string $method): self
    {
        $this->method = $method;

        return $this;
    }

    /**
     *
     * @ORM\PrePersist
     * @throws Exception
     */
    public function created()
    {
        $this->createdAt = new DateTime("now", new DateTimeZone("America/Mexico_City"));
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getClientip(): ?string
    {
        return $this->clientip;
    }

    /**
     * Undocumented function
     *
     * @param string|null $clientip
     * @return self
     */
    public function setClientip(?string $clientip): self
    {
        $this->clientip = $clientip;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return string|null
     */
    public function getLevel(): ?string
    {
        return $this->level;
    }

    /**
     * Undocumented function
     *
     * @param string|null $level
     * @return self
     */
    public function setLevel(?string $level): self
    {
        $this->level = $level;

        return $this;
    }

    /**
     * Undocumented function
     *
     * @return bool|null
     */
    public function getSystem(): ?bool
    {
        return $this->system;
    }

    /**
     * Undocumented function
     *
     * @param bool|null $system
     * @return self
     */
    public function setSystem(?bool $system): self
    {
        $this->system = $system;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function jsonSerialize()
    {
        $createdAt = strftime("%d %b %Y, %R", $this->getCreatedAt()->getTimestamp());
        return [
            "id" => $this->getId(),
            "userName" => (($this->getUser())?$this->getUser()->getName():"Desconocido"),
            "createdAt" => $createdAt ,
            "route" => $this->getRoute(),
            "message" => $this->getMessage(),
            "method" => $this->getMethod(),
            "clientIp" => $this->getClientip(),
            "level" => $this->getLevel(),
            "system" => $this->getSystem(),
        ];
    }
}
