-- ============================================================
-- Teacher Portal - Database Export
-- Compatible with MySQL 5.7+ and MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS `teacher_portal` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `teacher_portal`;

-- ─── auth_user ───────────────────────────────────────────────
DROP TABLE IF EXISTS `teachers`;
DROP TABLE IF EXISTS `auth_user`;

CREATE TABLE `auth_user` (
  `id`         INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`      VARCHAR(255)     NOT NULL,
  `first_name` VARCHAR(100)     NOT NULL,
  `last_name`  VARCHAR(100)     NOT NULL,
  `password`   VARCHAR(255)     NOT NULL,
  `phone`      VARCHAR(20)      DEFAULT NULL,
  `is_active`  TINYINT(1)       NOT NULL DEFAULT 1,
  `created_at` DATETIME         DEFAULT NULL,
  `updated_at` DATETIME         DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── teachers ────────────────────────────────────────────────
CREATE TABLE `teachers` (
  `id`               INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`          INT(11) UNSIGNED NOT NULL,
  `university_name`  VARCHAR(255)     NOT NULL,
  `gender`           ENUM('male','female','other') NOT NULL,
  `year_joined`      YEAR             NOT NULL,
  `department`       VARCHAR(150)     NOT NULL,
  `designation`      VARCHAR(150)     NOT NULL,
  `subject`          VARCHAR(150)     NOT NULL,
  `experience_years` INT(3)           DEFAULT NULL,
  `bio`              TEXT             DEFAULT NULL,
  `created_at`       DATETIME         DEFAULT NULL,
  `updated_at`       DATETIME         DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_teacher_user` FOREIGN KEY (`user_id`)
    REFERENCES `auth_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── Sample seed data ────────────────────────────────────────
-- Password for all sample users: Password123
-- (bcrypt hash of "Password123")

INSERT INTO `auth_user` (`email`, `first_name`, `last_name`, `password`, `phone`, `is_active`, `created_at`, `updated_at`) VALUES
('john.doe@example.com',    'John',    'Doe',     '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0101', 1, NOW(), NOW()),
('jane.smith@example.com',  'Jane',    'Smith',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0102', 1, NOW(), NOW()),
('alice.wong@example.com',  'Alice',   'Wong',    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0103', 1, NOW(), NOW()),
('bob.martin@example.com',  'Bob',     'Martin',  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0104', 1, NOW(), NOW()),
('sara.patel@example.com',  'Sara',    'Patel',   '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+1-555-0105', 1, NOW(), NOW());

INSERT INTO `teachers` (`user_id`, `university_name`, `gender`, `year_joined`, `department`, `designation`, `subject`, `experience_years`, `bio`, `created_at`, `updated_at`) VALUES
(1, 'MIT',                  'male',   2015, 'Computer Science', 'Associate Professor', 'Algorithms',        9,  'Expert in algorithm design and computational theory.',     NOW(), NOW()),
(2, 'Stanford University',  'female', 2018, 'Mathematics',      'Assistant Professor', 'Linear Algebra',    6,  'Passionate about pure and applied mathematics.',           NOW(), NOW()),
(3, 'Harvard University',   'female', 2012, 'Physics',          'Professor',           'Quantum Mechanics', 12, 'Researcher in quantum computing and particle physics.',    NOW(), NOW()),
(4, 'Oxford University',    'male',   2020, 'Engineering',      'Lecturer',            'Thermodynamics',    4,  'Specializes in thermal systems and fluid dynamics.',       NOW(), NOW()),
(5, 'IIT Bombay',           'female', 2017, 'Data Science',     'Senior Lecturer',     'Machine Learning',  7,  'Deep learning researcher with industry experience.',       NOW(), NOW());
