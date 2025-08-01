-- ----------------------------------------------------------------------------
-- MySQL schema for Comments app
-- ----------------------------------------------------------------------------

-- ------------------------------------------------------------------------
-- Table `users_user` (your custom user model)
-- ------------------------------------------------------------------------
CREATE TABLE `users_user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `password` VARCHAR(128) NOT NULL,
  `last_login` DATETIME NULL,
  `is_superuser` TINYINT(1) NOT NULL,
  `username` VARCHAR(150) NOT NULL,
  `first_name` VARCHAR(150) NOT NULL,
  `last_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(254) NOT NULL,
  `is_staff` TINYINT(1) NOT NULL,
  `is_active` TINYINT(1) NOT NULL,
  `date_joined` DATETIME NOT NULL,
  `homepage` VARCHAR(200) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_username_key` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------
-- Table `posts_post`
-- ------------------------------------------------------------------------
CREATE TABLE `posts_post` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `text` LONGTEXT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_post_user_id_idx` (`user_id`),
  CONSTRAINT `posts_post_user_id_fk`
    FOREIGN KEY (`user_id`)
    REFERENCES `users_user` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------
-- Table `posts_reply`
-- ------------------------------------------------------------------------
CREATE TABLE `posts_reply` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `post_id` BIGINT UNSIGNED NOT NULL,
  `parent_id` BIGINT UNSIGNED NULL,
  `text` LONGTEXT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `posts_reply_user_id_idx` (`user_id`),
  KEY `posts_reply_post_id_idx` (`post_id`),
  KEY `posts_reply_parent_id_idx` (`parent_id`),
  CONSTRAINT `posts_reply_user_id_fk`
    FOREIGN KEY (`user_id`)
    REFERENCES `users_user` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `posts_reply_post_id_fk`
    FOREIGN KEY (`post_id`)
    REFERENCES `posts_post` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `posts_reply_parent_id_fk`
    FOREIGN KEY (`parent_id`)
    REFERENCES `posts_reply` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------
-- Table `django_content_type` (for GenericForeignKey)
-- ------------------------------------------------------------------------
CREATE TABLE `django_content_type` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `app_label` VARCHAR(100) NOT NULL,
  `model` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_uniq` (`app_label`,`model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------
-- Table `attachments_attachment`
-- ------------------------------------------------------------------------
CREATE TABLE `attachments_attachment` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `content_type_id` INT UNSIGNED NOT NULL,
  `object_id` BIGINT UNSIGNED NOT NULL,
  `file` VARCHAR(200) NOT NULL,
  `uploaded_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attachments_content_type_idx` (`content_type_id`),
  KEY `attachments_object_id_idx` (`object_id`),
  CONSTRAINT `attachments_attachment_content_type_id_fk`
    FOREIGN KEY (`content_type_id`)
    REFERENCES `django_content_type` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;