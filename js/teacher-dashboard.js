document.addEventListener("DOMContentLoaded", () => {
    // Инициализация функциональности личного кабинета преподавателя
    initTeacherDashboard();
});

/**
 * Инициализация функциональности личного кабинета преподавателя
 */
function initTeacherDashboard() {
    // Скрываем прелоадер
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    }
    
    // Инициализация меню пользователя в шапке
    initUserMenu();
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация модальных окон
    initModals();
    
    // Инициализация формы создания/редактирования курса
    initCourseForm();
    
    // Инициализация функциональности курсов
    initCourses();
    
    // Инициализация кнопки "Наверх"
    initBackToTop();
}

/**
 * Инициализация меню пользователя в шапке
 */
function initUserMenu() {
    const userMenuTrigger = document.querySelector('.user-menu__trigger');
    const userMenu = document.querySelector('.user-menu');
    
    if (!userMenuTrigger || !userMenu) return;
    
    userMenuTrigger.addEventListener('click', () => {
        userMenu.classList.toggle('active');
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });
}

/**
 * Инициализация мобильного меню
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (!mobileMenuToggle || !sidebar) return;
    
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        sidebar.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            mobileMenuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/**
 * Инициализация модальных окон
 */
function initModals() {
    // Кнопки для открытия модальных окон
    const addCourseBtn = document.getElementById('addCourseBtn');
    const cancelCourseBtn = document.getElementById('cancelCourseBtn');
    const editButtons = document.querySelectorAll('.course-card__edit-btn');
    const deleteButtons = document.querySelectorAll('.course-card__delete-btn');
    
    // Модальные окна
    const courseModal = document.getElementById('courseModal');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    
    // Элементы закрытия модальных окон
    const closeButtons = document.querySelectorAll('.modal__close');
    const cancelDeleteBtn = document.querySelector('.cancel-delete-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Функция открытия модального окна
    const openModal = (modal) => {
        if (!modal) return;
        
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // Функция закрытия модального окна
    const closeModal = (modal) => {
        if (!modal) return;
        
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    // Функция закрытия всех модальных окон
    const closeAllModals = () => {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal);
        });
    };
    
    // Обработчики для кнопок открытия модальных окон
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', () => {
            resetCourseForm(); // Сбрасываем форму перед открытием
            document.getElementById('courseModalTitle').textContent = 'Создание нового курса';
            openModal(courseModal);
        });
    }
    
    // Кнопки редактирования курса
    editButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            
            const courseId = button.getAttribute('data-course-id');
            document.getElementById('courseModalTitle').textContent = 'Редактирование курса';
            document.getElementById('courseId').value = courseId;
            
            // Загружаем данные курса для редактирования
            loadCourseData(courseId);
            
            openModal(courseModal);
        });
    });
    
    // Кнопки удаления курса
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Предотвращаем всплытие события
            
            const courseId = button.getAttribute('data-course-id');
            const courseTitle = document.querySelector(`.course-card[data-course-id="${courseId}"] .course-card__title`).textContent;
            
            document.getElementById('deleteCourseTitle').textContent = courseTitle;
            document.getElementById('confirmDeleteBtn').setAttribute('data-course-id', courseId);
            
            openModal(deleteConfirmModal);
        });
    });
    
    // Кнопка отмены создания/редактирования курса
    if (cancelCourseBtn) {
        cancelCourseBtn.addEventListener('click', () => {
            closeModal(courseModal);
        });
    }
    
    // Кнопка отмены удаления курса
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            closeModal(deleteConfirmModal);
        });
    }
    
    // Кнопка подтверждения удаления курса
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            const courseId = confirmDeleteBtn.getAttribute('data-course-id');
            deleteCourse(courseId);
            closeModal(deleteConfirmModal);
        });
    }
    
    // Кнопки закрытия модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Закрытие модального окна при клике на оверлей
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => {
            closeAllModals();
        });
    }
    
    // Закрытие модального окна при нажатии Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Инициализация формы создания/редактирования курса
 */
function initCourseForm() {
    const courseForm = document.getElementById('courseForm');
    const courseImage = document.getElementById('courseImage');
    const imagePreview = document.getElementById('uploadedImage');
    const addLessonBtn = document.getElementById('addLessonBtn');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    
    // Обработчик загрузки изображения
    if (courseImage) {
        courseImage.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    imagePreview.src = event.target.result;
                    imagePreview.style.display = 'block';
                    document.querySelector('.upload-image__placeholder').style.display = 'none';
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Обработчик кнопки "Добавить урок"
    if (addLessonBtn) {
        addLessonBtn.addEventListener('click', () => {
            addLesson();
        });
    }
    
    // Обработчик кнопки "Добавить вопрос"
    if (addQuestionBtn) {
        addQuestionBtn.addEventListener('click', () => {
            addQuestion();
        });
    }
    
    // Обработчик отправки формы
    if (courseForm) {
        courseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateCourseForm()) {
                saveCourse();
            }
        });
    }
    
    // Добавляем первый урок по умолчанию
    addLesson();
    
    // Добавляем первый вопрос теста по умолчанию
    addQuestion();
}

/**
 * Добавление нового урока в форму
 */
function addLesson() {
    const lessonsContainer = document.getElementById('lessonsContainer');
    const lessonTemplate = document.getElementById('lessonTemplate');
    
    if (!lessonsContainer || !lessonTemplate) return;
    
    // Клонируем шаблон урока
    const lessonItem = lessonTemplate.content.cloneNode(true);
    
    // Находим элемент для номера урока
    const lessonNumber = lessonItem.querySelector('.lesson-number');
    const lessonCount = lessonsContainer.querySelectorAll('.lesson-item').length + 1;
    
    // Устанавливаем номер урока
    lessonNumber.textContent = lessonCount;
    
    // Обработчик кнопки "Удалить урок"
    const deleteButton = lessonItem.querySelector('.delete-lesson-btn');
    deleteButton.addEventListener('click', (e) => {
        const lessonItem = e.target.closest('.lesson-item');
        if (lessonItem) {
            lessonItem.remove();
            updateLessonNumbers();
        }
    });
    
    // Обработчик кнопки "Свернуть/развернуть урок"
    const toggleButton = lessonItem.querySelector('.toggle-lesson-btn');
    toggleButton.addEventListener('click', (e) => {
        const lessonItem = e.target.closest('.lesson-item');
        if (lessonItem) {
            lessonItem.classList.toggle('collapsed');
        }
    });
    
    // Добавляем новый урок в контейнер
    lessonsContainer.appendChild(lessonItem);
}

/**
 * Обновление нумерации уроков
 */
function updateLessonNumbers() {
    const lessons = document.querySelectorAll('#lessonsContainer .lesson-item');
    
    lessons.forEach((lesson, index) => {
        const lessonNumber = lesson.querySelector('.lesson-number');
        if (lessonNumber) {
            lessonNumber.textContent = index + 1;
        }
    });
}

/**
 * Добавление нового вопроса для теста
 */
function addQuestion() {
    const questionsContainer = document.getElementById('testQuestionsContainer');
    const questionTemplate = document.getElementById('questionTemplate');
    
    if (!questionsContainer || !questionTemplate) return;
    
    // Клонируем шаблон вопроса
    const questionItem = questionTemplate.content.cloneNode(true);
    
    // Находим элемент для номера вопроса
    const questionNumber = questionItem.querySelector('.question-number');
    const questionCount = questionsContainer.querySelectorAll('.question-item').length + 1;
    
    // Устанавливаем номер вопроса и обновляем атрибуты
    questionNumber.textContent = questionCount;
    
    // Обновляем имена радио-кнопок
    const radioInputs = questionItem.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => {
        input.name = `correctOption_${questionCount}`;
    });
    
    // Обновляем имена полей ввода вариантов ответа
    const optionInputs = questionItem.querySelectorAll('input[type="text"]');
    optionInputs.forEach((input, index) => {
        if (input.name.startsWith('option')) {
            input.name = `option${index % 4 + 1}_${questionCount}`;
        }
    });
    
    // Обработчик кнопки "Удалить вопрос"
    const deleteButton = questionItem.querySelector('.delete-question-btn');
    deleteButton.addEventListener('click', (e) => {
        const questionItem = e.target.closest('.question-item');
        if (questionItem) {
            questionItem.remove();
            updateQuestionNumbers();
        }
    });
    
    // Обработчик кнопки "Свернуть/развернуть вопрос"
    const toggleButton = questionItem.querySelector('.toggle-question-btn');
    toggleButton.addEventListener('click', (e) => {
        const questionItem = e.target.closest('.question-item');
        if (questionItem) {
            questionItem.classList.toggle('collapsed');
        }
    });
    
    // Добавляем новый вопрос в контейнер
    questionsContainer.appendChild(questionItem);
}

/**
 * Обновление нумерации вопросов
 */
function updateQuestionNumbers() {
    const questions = document.querySelectorAll('#testQuestionsContainer .question-item');
    
    questions.forEach((question, index) => {
        const questionNumber = question.querySelector('.question-number');
        if (questionNumber) {
            questionNumber.textContent = index + 1;
        }
        
        // Обновляем имена радио-кнопок
        const radioInputs = question.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            input.name = `correctOption_${index + 1}`;
        });
        
        // Обновляем имена полей ввода вариантов ответа
        const optionGroups = question.querySelectorAll('.option-group');
        optionGroups.forEach((group, groupIndex) => {
            const input = group.querySelector('input[type="text"]');
            if (input) {
                input.name = `option${groupIndex + 1}_${index + 1}`;
            }
        });
    });
}

/**
 * Валидация формы создания/редактирования курса
 */
function validateCourseForm() {
    const courseForm = document.getElementById('courseForm');
    let isValid = true;
    
    // Очищаем предыдущие ошибки
    const errorElements = courseForm.querySelectorAll('.form-error');
    errorElements.forEach(error => {
        error.textContent = '';
    });
    
    const formInputs = courseForm.querySelectorAll('input[required], textarea[required]');
    formInputs.forEach(input => {
        input.classList.remove('error');
        
        if (!input.value.trim()) {
            const errorElement = input.nextElementSibling;
            if (errorElement && errorElement.classList.contains('form-error')) {
                errorElement.textContent = 'Это поле обязательно для заполнения';
            }
            input.classList.add('error');
            isValid = false;
        }
    });
    
    // Проверка выбора правильного ответа в каждом вопросе
    const questions = courseForm.querySelectorAll('.question-item');
    questions.forEach((question, index) => {
        const radios = question.querySelectorAll('input[type="radio"]');
        const checked = Array.from(radios).some(radio => radio.checked);
        
        if (!checked) {
            const firstRadio = radios[0];
            if (firstRadio) {
                const errorElement = firstRadio.closest('.option-group').querySelector('.form-error');
                if (errorElement) {
                    errorElement.textContent = 'Необходимо отметить правильный ответ';
                }
                isValid = false;
            }
        }
    });
    
    return isValid;
}

/**
 * Сохранение курса
 */
function saveCourse() {
    const courseForm = document.getElementById('courseForm');
    const courseId = document.getElementById('courseId').value;
    
    // Получение данных формы
    const formData = new FormData(courseForm);
    
    // В реальном приложении здесь был бы запрос к API для сохранения данных
    // Например:
    // fetch('/api/courses', {
    //     method: courseId ? 'PUT' : 'POST',
    //     body: formData
    // });
    
    // Для демонстрации просто отображаем сообщение об успехе
    showNotification(courseId ? 'Курс успешно обновлен' : 'Курс успешно создан', 'success');
    
    // Закрываем модальное окно
    const courseModal = document.getElementById('courseModal');
    courseModal.classList.remove('active');
    document.querySelector('.modal-overlay').classList.remove('active');
    document.body.style.overflow = '';
    
    // В реальном приложении здесь было бы обновление списка курсов
    // Для демонстрации мы просто перезагружаем страницу через небольшую задержку
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

/**
 * Загрузка данных курса для редактирования
 */
function loadCourseData(courseId) {
    // В реальном приложении здесь был бы запрос к API для получения данных курса
    // Например:
    // fetch(`/api/courses/${courseId}`).then(response => response.json()).then(data => { ... });
    
    // Для демонстрации используем заглушечные данные
    const courseMockData = {
        id: courseId,
        title: courseId === '1' ? 'JavaScript для начинающих' : 'HTML и CSS с нуля',
        shortDescription: courseId === '1' ? 
            'Научитесь основам программирования на самом популярном языке для web-разработки.' : 
            'Изучите основы веб-разработки и создайте свои первые сайты.',
        fullDescription: courseId === '1' ? 
            'JavaScript — один из самых популярных языков программирования, который используется для создания интерактивных веб-сайтов и приложений. Этот курс разработан специально для начинающих, которые хотят освоить основы программирования и получить практические навыки разработки.' : 
            'HTML и CSS — это основные технологии для создания веб-страниц и веб-приложений. HTML обеспечивает структуру страницы, а CSS отвечает за визуальное представление. Этот курс поможет вам освоить эти технологии с нуля.',
        lessons: [
            {
                title: 'Введение в JavaScript',
                videoUrl: 'https://www.youtube.com/embed/8aGhZQkoFbQ',
                content: 'В этом уроке мы познакомимся с историей JavaScript и его ролью в современной веб-разработке.'
            },
            {
                title: 'Переменные и типы данных',
                videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg',
                content: 'В этом уроке мы изучим переменные, константы и основные типы данных в JavaScript.'
            }
        ],
        questions: [
            {
                text: 'В чем отличие между операторами == и === в JavaScript?',
                options: [
                    'Оператор == сравнивает значения, а === сравнивает значения и типы данных',
                    'Операторы == и === делают одно и то же',
                    'Оператор === сравнивает значения, а == сравнивает значения и типы данных',
                    'Оператор == не существует в JavaScript'
                ],
                correctOption: 1
            },
            {
                text: 'Какая функция используется для вывода сообщения в консоль браузера?',
                options: [
                    'print()',
                    'console.log()',
                    'alert()',
                    'system.out.println()'
                ],
                correctOption: 2
            }
        ],
        image: courseId === '1' ? 'images/course-javascript.jpg' : 'images/course-html-css.jpg'
    };
    
    // Заполняем форму данными курса
    document.getElementById('courseId').value = courseMockData.id;
    document.getElementById('courseTitle').value = courseMockData.title;
    document.getElementById('courseShortDescription').value = courseMockData.shortDescription;
    document.getElementById('courseFullDescription').value = courseMockData.fullDescription;
    
    // Показываем изображение курса
    const uploadedImage = document.getElementById('uploadedImage');
    if (uploadedImage) {
        uploadedImage.src = courseMockData.image;
        uploadedImage.style.display = 'block';
        document.querySelector('.upload-image__placeholder').style.display = 'none';
    }
    
    // Очищаем контейнеры уроков и вопросов
    document.getElementById('lessonsContainer').innerHTML = '';
    document.getElementById('testQuestionsContainer').innerHTML = '';
    
    // Добавляем уроки
    courseMockData.lessons.forEach(lesson => {
        addLesson();
        const lessonItems = document.querySelectorAll('.lesson-item');
        const lastLesson = lessonItems[lessonItems.length - 1];
        
        if (lastLesson) {
            const titleInput = lastLesson.querySelector('input[name="lessonTitle[]"]');
            const videoInput = lastLesson.querySelector('input[name="lessonVideo[]"]');
            const contentInput = lastLesson.querySelector('textarea[name="lessonContent[]"]');
            
            if (titleInput) titleInput.value = lesson.title;
            if (videoInput) videoInput.value = lesson.videoUrl;
            if (contentInput) contentInput.value = lesson.content;
        }
    });
    
    // Добавляем вопросы теста
    courseMockData.questions.forEach(question => {
        addQuestion();
        const questionItems = document.querySelectorAll('.question-item');
        const lastQuestion = questionItems[questionItems.length - 1];
        
        if (lastQuestion) {
            const textInput = lastQuestion.querySelector('input[name="questionText[]"]');
            if (textInput) textInput.value = question.text;
            
            // Заполняем варианты ответов
            const optionInputs = lastQuestion.querySelectorAll('.option-input input[type="text"]');
            question.options.forEach((option, index) => {
                if (optionInputs[index]) optionInputs[index].value = option;
            });
            
            // Отмечаем правильный ответ
            const correctRadio = lastQuestion.querySelector(`.option-input:nth-child(${question.correctOption}) input[type="radio"]`);
            if (correctRadio) correctRadio.checked = true;
        }
    });
}

/**
 * Сброс формы создания/редактирования курса
 */
function resetCourseForm() {
    const courseForm = document.getElementById('courseForm');
    if (courseForm) courseForm.reset();
    
    // Очищаем ID курса
    document.getElementById('courseId').value = '';
    
    // Скрываем изображение
    const uploadedImage = document.getElementById('uploadedImage');
    if (uploadedImage) {
        uploadedImage.style.display = 'none';
        document.querySelector('.upload-image__placeholder').style.display = 'block';
    }
    
    // Очищаем контейнеры уроков и вопросов
    document.getElementById('lessonsContainer').innerHTML = '';
    document.getElementById('testQuestionsContainer').innerHTML = '';
    
    // Добавляем один урок по умолчанию
    addLesson();
    
    // Добавляем один вопрос по умолчанию
    addQuestion();
}

/**
 * Удаление курса
 */
function deleteCourse(courseId) {
    // В реальном приложении здесь был бы запрос к API для удаления курса
    // Например:
    // fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
    
    // Для демонстрации удаляем элемент из DOM
    const courseCard = document.querySelector(`.course-card[data-course-id="${courseId}"]`);
    if (courseCard) {
        courseCard.remove();
        showNotification('Курс успешно удален', 'success');
    }
}

/**
 * Инициализация функциональности курсов
 */
function initCourses() {
    // В реальном приложении здесь был бы запрос к API для загрузки курсов
    // Для демонстрации у нас уже есть статические карточки курсов в HTML
}

/**
 * Отображение уведомления
 */
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    notification.innerHTML = `
        <div class="notification__content">
            <div class="notification__message">${message}</div>
        </div>
        <button class="notification__close" aria-label="Закрыть">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `;
    
    // Добавляем уведомление в DOM
    document.body.appendChild(notification);
    
    // Добавляем стили для уведомления, если их еще нет
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                min-width: 300px;
                max-width: 400px;
                background-color: white;
                border-radius: var(--border-radius-md);
                box-shadow: var(--shadow-lg);
                padding: var(--spacing-md) var(--spacing-lg);
                display: flex;
                align-items: center;
                justify-content: space-between;
                z-index: 9999;
                animation: slideIn 0.3s ease-out;
            }
            
            .notification--success {
                border-left: 4px solid var(--color-success);
            }
            
            .notification--error {
                border-left: 4px solid var(--color-error);
            }
            
            .notification--info {
                border-left: 4px solid var(--color-primary);
            }
            
            .notification__content {
                flex: 1;
            }
            
            .notification__message {
                font-size: 0.9375rem;
                color: var(--color-gray-800);
            }
            
            .notification__close {
                background: none;
                border: none;
                color: var(--color-gray-500);
                cursor: pointer;
                margin-left: var(--spacing-md);
                padding: 0;
            }
            
            .notification__close:hover {
                color: var(--color-gray-900);
            }
            
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .notification.hiding {
                animation: slideOut 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Добавляем обработчик для кнопки закрытия
    const closeBtn = notification.querySelector('.notification__close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // Автоматически скрываем уведомление через 5 секунд
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
}

/**
 * Скрытие уведомления
 */
function hideNotification(notification) {
    notification.classList.add('hiding');
    
    // Удаляем элемент после завершения анимации
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Инициализация кнопки "Наверх"
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    // Показываем кнопку при прокрутке
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    // Прокрутка наверх при клике
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}