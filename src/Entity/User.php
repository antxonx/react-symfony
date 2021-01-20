<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping\UniqueConstraint;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="user", uniqueConstraints={
 *      @UniqueConstraint(name="UQ_USERNAME", columns={"username"}),
 *      @UniqueConstraint(name="UQ_MAIL", columns={"email"})
 * })
 */
class User implements UserInterface, \JsonSerializable
{
    const FK_USERNAME = "UQ_USERNAME";

    const FK_MAIL = "UQ_MAIL";

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=180)
     */
    private string $username;

    /**
     * @ORM\Column(type="json")
     */
    private array $roles = [];

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     */
    private string $password;

    /**
     * @var string
     * @ORM\Column(type="string", length=180)
     */
    private string $email;

    /**
     * @ORM\OneToMany(targetEntity=InfoLog::class, mappedBy="user")
     */
    private $infoLogs;

    /**
     * @ORM\OneToMany(targetEntity=ErrorLog::class, mappedBy="user")
     */
    private $errorLogs;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    public function __construct()
    {
        $this->infoLogs = new ArrayCollection();
        $this->errorLogs = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUsername(): string
    {
        return (string) $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function getSalt()
    {
        // not needed when using the "bcrypt" algorithm in security.yaml
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * Get the value of email
     *
     * @return  string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * Set the value of email
     *
     * @param  string  $email
     *
     * @return  self
     */
    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    /**
     * Specify data which should be serialized to JSON
     * @link https://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize()
    {
        return [
            "id" => $this->getId(),
            "username" => $this->getUsername(),
            "roles" => $this->getRoles(),
            "email" => $this->getEmail(),
            "name" => $this->getName(),
        ];
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|InfoLog[]
     */
    public function getInfoLogs(): Collection
    {
        return $this->infoLogs;
    }

    public function addInfoLog(InfoLog $infoLog): self
    {
        if (!$this->infoLogs->contains($infoLog)) {
            $this->infoLogs[] = $infoLog;
            $infoLog->setUser($this);
        }

        return $this;
    }

    public function removeInfoLog(InfoLog $infoLog): self
    {
        if ($this->infoLogs->removeElement($infoLog)) {
            // set the owning side to null (unless already changed)
            if ($infoLog->getUser() === $this) {
                $infoLog->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ErrorLog[]
     */
    public function getErrorLogs(): Collection
    {
        return $this->errorLogs;
    }

    public function addErrorLog(ErrorLog $errorLog): self
    {
        if (!$this->errorLogs->contains($errorLog)) {
            $this->errorLogs[] = $errorLog;
            $errorLog->setUser($this);
        }

        return $this;
    }

    public function removeErrorLog(ErrorLog $errorLog): self
    {
        if ($this->errorLogs->removeElement($errorLog)) {
            // set the owning side to null (unless already changed)
            if ($errorLog->getUser() === $this) {
                $errorLog->setUser(null);
            }
        }

        return $this;
    }
}
