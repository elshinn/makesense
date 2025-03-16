CREATE DATABASE IF NOT EXISTS makesense;
USE makesense;

CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Название роли (admin, teacher, student)'
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL COMMENT 'Имя пользователя',
    last_name VARCHAR(100) NOT NULL COMMENT 'Фамилия пользователя',
    email VARCHAR(255) NOT NULL UNIQUE COMMENT 'Email для входа',
    password_hash VARCHAR(255) NOT NULL COMMENT 'Хешированный пароль',
    role_id INT NOT NULL COMMENT 'Роль пользователя',
    FOREIGN KEY (role_id) REFERENCES roles(role_id)
);

CREATE TABLE teacher_profiles (
    teacher_profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE COMMENT 'ID пользователя-учителя',
    specialization VARCHAR(255) NOT NULL COMMENT 'Специализация учителя',
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Название категории'
);

CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL COMMENT 'Название курса',
    short_description VARCHAR(255) NOT NULL COMMENT 'Краткое описание (до 10 слов)',
    full_description TEXT NOT NULL COMMENT 'Полное описание курса',
    image_path VARCHAR(255) DEFAULT 'images/default-course.jpg' COMMENT 'Путь к изображению курса',
    category_id INT NOT NULL COMMENT 'ID категории курса',
    teacher_profile_id INT NOT NULL COMMENT 'ID учителя (автора курса)',
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (teacher_profile_id) REFERENCES teacher_profiles(teacher_profile_id),
    INDEX idx_course_category (category_id)
);

CREATE TABLE lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL COMMENT 'ID курса',
    title VARCHAR(255) NOT NULL COMMENT 'Название урока',
    order_number INT NOT NULL COMMENT 'Порядковый номер урока в курсе',
    video_url VARCHAR(255) NOT NULL COMMENT 'Ссылка на видео урока',
    content TEXT NOT NULL COMMENT 'Текстовое содержание урока',
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_lesson_order (course_id, order_number) COMMENT 'Уникальный порядковый номер для урока в рамках курса',
    INDEX idx_lesson_course (course_id)
);

CREATE TABLE tests (
    test_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL UNIQUE COMMENT 'ID курса, к которому относится тест',
    title VARCHAR(255) NOT NULL COMMENT 'Название теста',
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

CREATE TABLE questions (
    question_id INT AUTO_INCREMENT PRIMARY KEY,
    test_id INT NOT NULL COMMENT 'ID теста',
    question_text TEXT NOT NULL COMMENT 'Текст вопроса',
    order_number INT NOT NULL COMMENT 'Порядковый номер вопроса в тесте',
    FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE CASCADE,
    UNIQUE KEY unique_question_order (test_id, order_number) COMMENT 'Уникальный порядковый номер для вопроса в рамках теста',
    INDEX idx_question_test (test_id)
);

CREATE TABLE answers (
    answer_id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL COMMENT 'ID вопроса',
    answer_text TEXT NOT NULL COMMENT 'Текст варианта ответа',
    is_correct BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Является ли ответ правильным',
    FOREIGN KEY (question_id) REFERENCES questions(question_id) ON DELETE CASCADE,
    INDEX idx_answer_question (question_id)
);

INSERT INTO roles (role_name) VALUES 
('admin'),
('teacher'),
('student');

INSERT INTO users (first_name, last_name, email, password_hash, role_id) VALUES 
('Администратор', 'МейкСэнс', 'admin@makesense.ru', '$2y$10$yoursecurehash', 1);

INSERT INTO users (first_name, last_name, email, password_hash, role_id) VALUES 
('Александр', 'Иванов', 'teacher@makesense.ru', '$2y$10$yoursecurehash', 2);

INSERT INTO teacher_profiles (user_id, specialization) VALUES 
(2, 'Веб-разработка');

INSERT INTO categories (category_name) VALUES 
('Разработка'),
('Дизайн'),
('Бизнес');
