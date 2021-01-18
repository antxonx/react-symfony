<?php

/**
 * Registros precargados para la base de datos
 */

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use App\Entity\User;
use Symfony\Component\Validator\Constraints\Length;

/**
 * UserFixtures class
 */
class UserFixtures extends Fixture
{
    /**
     * password encoder
     *
     * @var UserPasswordEncoderInterface
     */
    protected $passwordEncoder;

    public const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    /**
     * Constructor
     *
     * @param UserPasswordEncoderInterface $passwordEncoder
     */
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * cargar registros a la base de adtos
     *
     * @param ObjectManager $manager
     * @return void
     */
    public function load(ObjectManager $manager)
    {
        $user = (new User)
            ->setUsername("develop")
            ->setName("Developer")
            ->setRoles([
                "ROLE_DEV",
                "ROLE_ADMIN",
                "ROLE_ALLOWED_TO_SWITCH",
            ])
            ->setEmail("dev@dev.dev");
        $user->setPassword($this->passwordEncoder->encodePassword(
            $user,
            'password'
        ));
        $manager->persist($user);

        for ($i = 0; $i < 50; $i++) {
            $username = $this->randomName($i);
            $user = (new User)
                ->setUsername($username)
                ->setName(ucfirst($this->randomName($i)))
                ->setRoles([])
                ->setEmail($username);
            $user->setPassword($this->passwordEncoder->encodePassword(
                $user,
                $this->randomName($i * 7 - 1, 10)
            ));
            $manager->persist($user);
        }

        $manager->flush();
    }

    private function randomName(int $unique, int $length = 5)
    {
        $result = "";
        for ($i = 0; $i < $length; $i++) {
            $result .= self::CHARSET[rand(0, strlen(self::CHARSET) - 1)];
        }
        $result .= $unique;
        return $result;
    }
}
