document.addEventListener("DOMContentLoaded", () => {
    // Инициализация функциональности административной панели
    initAdminDashboard();
});

/**
 * Инициализация функциональности административной панели
 */
function initAdminDashboard() {
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
    
    // Инициализация переключения разделов
    initSectionNavigation();
    
    // Инициализация сортировки таблиц
    initTableSorting();
    
    // Инициализация поиска
    initSearch();
    
    // Инициализация пагинации
    initPagination();
    
    // Инициализация модальных окон
    initModals();
    
    // Инициализация формы создания/редактирования курса
    initCourseForm();
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
        if (window.innerWidth >= 992) {
            mobileMenuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Создаем оверлей для закрытия меню при клике вне его на мобильных
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1039;
        display: none;
    `;
    document.body.appendChild(overlay);
    
    // Показываем оверлей при открытии меню
    function toggleOverlay() {
        if (sidebar.classList.contains('active')) {
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }
    }
    
    mobileMenuToggle.addEventListener('click', toggleOverlay);
    
    // Закрытие меню при клике на оверлей
    overlay.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        document.body.classList.remove('menu-open');
        overlay.style.display = 'none';
    });
}

/**
 * Инициализация переключения разделов
 */
function initSectionNavigation() {
    const menuLinks = document.querySelectorAll('.sidebar__menu-link[data-section]');
    const sections = document.querySelectorAll('.admin-section');
    
    if (menuLinks.length === 0 || sections.length === 0) return;
    
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Убираем активное состояние со всех ссылок
            menuLinks.forEach(item => {
                item.classList.remove('sidebar__menu-link--active');
            });
            
            // Добавляем активное состояние текущей ссылке
            link.classList.add('sidebar__menu-link--active');
            
            // Скрываем все разделы
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Показываем выбранный раздел
            const sectionId = link.getAttribute('data-section');
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
            }
            
            // На мобильных устройствах закрываем боковое меню
            if (window.innerWidth < 992) {
                const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
                const sidebar = document.querySelector('.sidebar');
                const overlay = document.querySelector('.sidebar-overlay');
                
                if (mobileMenuToggle && sidebar) {
                    mobileMenuToggle.classList.remove('active');
                    sidebar.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    if (overlay) overlay.style.display = 'none';
                }
            }
        });
    });
    
    // Активируем первый раздел по умолчанию
    if (menuLinks.length > 0 && sections.length > 0) {
        menuLinks[0].classList.add('sidebar__menu-link--active');
        sections[0].classList.add('active');
    }
}

/**
 * Инициализация поиска
 */
function initSearch() {
    const userSearchInput = document.getElementById('userSearchInput');
    const courseSearchInput = document.getElementById('courseSearchInput');
    
    // Поиск по пользователям
    if (userSearchInput) {
        userSearchInput.addEventListener('input', () => {
            const searchValue = userSearchInput.value.toLowerCase();
            filterTable('usersTable', searchValue);
        });
    }
    
    // Поиск по курсам
    if (courseSearchInput) {
        courseSearchInput.addEventListener('input', () => {
            const searchValue = courseSearchInput.value.toLowerCase();
            filterTable('coursesTable', searchValue);
        });
    }
    
    // Функция для фильтрации таблицы
    function filterTable(tableId, searchValue) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            let found = false;
            
            // Проверяем все ячейки строки
            Array.from(row.cells).forEach(cell => {
                if (cell.textContent.toLowerCase().includes(searchValue)) {
                    found = true;
                }
            });
            
            // Показываем или скрываем строку
            row.style.display = found ? '' : 'none';
        });
    }
}

/**
 * Инициализация пагинации
 */
function initPagination() {
    const paginationPages = document.querySelectorAll('.pagination__page');
    const prevButtons = document.querySelectorAll('.pagination__button--prev');
    const nextButtons = document.querySelectorAll('.pagination__button--next');
    
    if (paginationPages.length === 0) return;
    
    // Обработчик для кнопок страниц
    paginationPages.forEach(page => {
        page.addEventListener('click', () => {
            // Находим все кнопки страниц в том же контейнере
            const container = page.closest('.pagination');
            const pages = container.querySelectorAll('.pagination__page');
            
            // Убираем активное состояние со всех кнопок
            pages.forEach(p => p.classList.remove('pagination__page--active'));
            
            // Активируем выбранную кнопку
            page.classList.add('pagination__page--active');
            
            // Эмуляция загрузки новой страницы
            const pageNum = page.textContent;
            console.log(`Загружаем страницу ${pageNum}`);
            
            // Обновляем состояние кнопок Prev/Next
            updatePaginationButtons(container, parseInt(pageNum), pages.length);
        });
    });
    
    // Обработчик для кнопки "Предыдущая"
    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.disabled) return;
            
            const container = button.closest('.pagination');
            const activePage = container.querySelector('.pagination__page--active');
            const pageNum = parseInt(activePage.textContent);
            
            if (pageNum > 1) {
                const prevPage = container.querySelector(`.pagination__page:nth-child(${pageNum - 1})`);
                if (prevPage) prevPage.click();
            }
        });
    });
    
    // Обработчик для кнопки "Следующая"
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.disabled) return;
            
            const container = button.closest('.pagination');
            const activePage = container.querySelector('.pagination__page--active');
            const pageNum = parseInt(activePage.textContent);
            const pages = container.querySelectorAll('.pagination__page');
            
            if (pageNum < pages.length) {
                const nextPage = container.querySelector(`.pagination__page:nth-child(${pageNum + 1})`);
                if (nextPage) nextPage.click();
            }
        });
    });
    
    // Инициализируем состояние кнопок Prev/Next для всех пагинаций
    document.querySelectorAll('.pagination').forEach(container => {
        const activePage = container.querySelector('.pagination__page--active');
        const pages = container.querySelectorAll('.pagination__page');
        
        if (activePage && pages.length > 0) {
            updatePaginationButtons(container, parseInt(activePage.textContent), pages.length);
        }
    });
    
    // Функция для обновления состояния кнопок Prev/Next
    function updatePaginationButtons(container, currentPage, totalPages) {
        const prevButton = container.querySelector('.pagination__button--prev');
        const nextButton = container.querySelector('.pagination__button--next');
        
        if (prevButton) prevButton.disabled = currentPage <= 1;
        if (nextButton) nextButton.disabled = currentPage >= totalPages;
    }
}

/**
 * Инициализация модальных окон
 */
function initModals() {
    // Кнопки удаления пользователей
    const deleteUserButtons = document.querySelectorAll('.delete-user-btn');
    // Кнопки удаления курсов
    const deleteCourseButtons = document.querySelectorAll('.delete-course-btn');
    
    // Модальные окна
    const deleteUserModal = document.getElementById('deleteUserModal');
    const deleteCourseModal = document.getElementById('deleteCourseModal');
    
    // Общие элементы для всех модальных окон
    const closeButtons = document.querySelectorAll('.modal__close');
    const cancelButtons = document.querySelectorAll('.cancel-delete-btn');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // Функция для открытия модального окна
    const openModal = (modal) => {
        if (!modal) return;
        
        modal.classList.add('active');
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // Функция для закрытия модального окна
    const closeModal = (modal) => {
        if (!modal) return;
        
        modal.classList.remove('active');
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    // Функция для закрытия всех модальных окон
    const closeAllModals = () => {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal);
        });
    };
    
    // Обработчики для кнопок удаления пользователей
    deleteUserButtons.forEach(button => {
        button.addEventListener('click', () => {
            const userId = button.getAttribute('data-user-id');
            const userRow = button.closest('tr');
            const userName = userRow.querySelector('.user-info__name').textContent;
            
            document.getElementById('deleteUserName').textContent = userName;
            document.getElementById('confirmDeleteUserBtn').setAttribute('data-user-id', userId);
            
            openModal(deleteUserModal);
        });
    });
    
    // Обработчики для кнопок удаления курсов
    deleteCourseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const courseId = button.getAttribute('data-course-id');
            const courseRow = button.closest('tr');
            const courseName = courseRow.querySelector('.course-info__title').textContent;
            
            document.getElementById('deleteCourseName').textContent = courseName;
            document.getElementById('confirmDeleteCourseBtn').setAttribute('data-course-id', courseId);
            
            openModal(deleteCourseModal);
        });
    });
    
    // Обработчик для кнопки подтверждения удаления пользователя
    const confirmDeleteUserBtn = document.getElementById('confirmDeleteUserBtn');
    if (confirmDeleteUserBtn) {
        confirmDeleteUserBtn.addEventListener('click', () => {
            const userId = confirmDeleteUserBtn.getAttribute('data-user-id');
            deleteUser(userId);
            closeModal(deleteUserModal);
        });
    }
    
    // Обработчик для кнопки подтверждения удаления курса
    const confirmDeleteCourseBtn = document.getElementById('confirmDeleteCourseBtn');
    if (confirmDeleteCourseBtn) {
        confirmDeleteCourseBtn.addEventListener('click', () => {
            const courseId = confirmDeleteCourseBtn.getAttribute('data-course-id');
            deleteCourse(courseId);
            closeModal(deleteCourseModal);
        });
    }
    
    // Обработчики для закрытия модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Обработчики для кнопок отмены
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Закрытие модальных окон при клике на оверлей
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeAllModals);
    }
    
    // Закрытие модальных окон при нажатии Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

/**
 * Удаление пользователя
 */
function deleteUser(userId) {
    // В реальном приложении здесь был бы запрос к API для удаления пользователя
    console.log(`Удаление пользователя с ID: ${userId}`);
    
    // Находим и удаляем строку пользователя из таблицы
    const userRow = document.querySelector(`.delete-user-btn[data-user-id="${userId}"]`).closest('tr');
    if (userRow) {
        // Анимация удаления
        userRow.style.transition = 'opacity 0.3s, transform 0.3s';
        userRow.style.opacity = '0';
        userRow.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            userRow.remove();
            showNotification('Пользователь успешно удален', 'success');
        }, 300);
    }
}

/**
 * Удаление курса
 */
function deleteCourse(courseId) {
    // В реальном приложении здесь был бы запрос к API для удаления курса
    console.log(`Удаление курса с ID: ${courseId}`);
    
    // Находим и удаляем строку курса из таблицы
    const courseRow = document.querySelector(`.delete-course-btn[data-course-id="${courseId}"]`).closest('tr');
    if (courseRow) {
        // Анимация удаления
        courseRow.style.transition = 'opacity 0.3s, transform 0.3s';
        courseRow.style.opacity = '0';
        courseRow.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            courseRow.remove();
            showNotification('Курс успешно удален', 'success');
        }, 300);
    }
}

/**
 * Показать уведомление
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
                border-left: 4px solid var(--admin-green);
            }
            
            .notification--error {
                border-left: 4px solid var(--admin-danger);
            }
            
            .notification--info {
                border-left: 4px solid var(--admin-primary);
            }
            
            .notification__content {
                flex: 1;
            }
            
            .notification__message {
                font-size: 0.9375rem;
                color: var(--admin-gray-800);
            }
            
            .notification__close {
                background: none;
                border: none;
                color: var(--admin-gray-500);
                cursor: pointer;
                margin-left: var(--spacing-md);
                padding: 0;
            }
            
            .notification__close:hover {
                color: var(--admin-gray-900);
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
 * Скрыть уведомление
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
 * Инициализация формы создания/редактирования курса
 */
function initCourseForm() {
    const courseForm = document.getElementById('courseForm');
    const courseImage = document.getElementById('courseImage');
    const imagePreview = document.getElementById('uploadedImage');
    const addLessonBtn = document.getElementById('addLessonBtn');
    const addQuestionBtn = document.getElementById('addQuestionBtn');
    const cancelCourseBtn = document.getElementById('cancelCourseBtn');
    
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
    
    // Обработчик кнопки "Отменить"
    if (cancelCourseBtn) {
        cancelCourseBtn.addEventListener('click', () => {
            resetCourseForm();
            // Переключаемся на раздел "Курсы"
            const coursesLink = document.querySelector('.sidebar__menu-link[data-section="courses"]');
            if (coursesLink) {
                coursesLink.click();
            }
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
    const questionCount = questionsContainer.querySelectorAll('.question-item').length + 1;
    
    // Находим элемент для номера вопроса
    const questionNumber = questionItem.querySelector('.question-number');
    
    // Устанавливаем номер вопроса
    questionNumber.textContent = questionCount;
    
    // Обновляем имена радио-кнопок и полей
    const radioButtons = questionItem.querySelectorAll('input[type="radio"]');
    const optionInputs = questionItem.querySelectorAll('input[type="text"][name^="option"]');
    
    radioButtons.forEach(radio => {
        radio.name = `correctOption_${questionCount}`;
    });
    
    optionInputs.forEach((input, index) => {
        const optionNum = index + 1;
        input.name = `option${optionNum}_${questionCount}`;
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
        const radioButtons = question.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(radio => {
            radio.name = `correctOption_${index + 1}`;
        });
        
        // Обновляем имена полей ввода вариантов
        const optionInputs = question.querySelectorAll('input[type="text"][name^="option"]');
        optionInputs.forEach((input, optIndex) => {
            const optionNum = optIndex + 1;
            input.name = `option${optionNum}_${index + 1}`;
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
    
    const formInputs = courseForm.querySelectorAll('input[required], textarea[required], select[required]');
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
        const radios = question.querySelectorAll(`input[name="correctOption_${index + 1}"]`);
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
    console.log(`Сохранение курса ${courseId ? 'с ID: ' + courseId : 'нового курса'}`);
    
    // Для демонстрации просто отображаем сообщение об успехе
    showNotification(courseId ? 'Курс успешно обновлен' : 'Курс успешно создан', 'success');
    
    // Переключаемся на раздел "Курсы"
    setTimeout(() => {
        resetCourseForm();
        const coursesLink = document.querySelector('.sidebar__menu-link[data-section="courses"]');
        if (coursesLink) {
            coursesLink.click();
        }
    }, 1000);
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