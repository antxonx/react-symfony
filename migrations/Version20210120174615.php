<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210120174615 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE error_log (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, created_at DATETIME NOT NULL, file LONGTEXT NOT NULL, line INT NOT NULL, message LONGTEXT NOT NULL, route LONGTEXT NOT NULL, method VARCHAR(25) NOT NULL, clientip VARCHAR(25) DEFAULT NULL, level VARCHAR(25) DEFAULT NULL, system TINYINT(1) NOT NULL, INDEX IDX_FCDF27A9A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE info_log (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, created_at DATETIME NOT NULL, route LONGTEXT NOT NULL, message LONGTEXT NOT NULL, method VARCHAR(25) NOT NULL, clientip VARCHAR(25) DEFAULT NULL, level VARCHAR(25) DEFAULT NULL, system TINYINT(1) NOT NULL, INDEX IDX_57D0F1B9A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE error_log ADD CONSTRAINT FK_FCDF27A9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE info_log ADD CONSTRAINT FK_57D0F1B9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE error_log');
        $this->addSql('DROP TABLE info_log');
    }
}
