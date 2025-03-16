document.addEventListener("DOMContentLoaded", () => {
    // Инициализация функциональности страницы курса
    initCourse();
});

/**
 * Инициализация функциональности страницы курса
 */
function initCourse() {
    // Скрываем прелоадер
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    }
    
    // Инициализация модулей курса
    initCourseModules();
    
    // Инициализация кнопки "Поделиться"
    initShareButtons();
    
    // Инициализация кнопки "Наверх"
    initBackToTop();
    
    // Инициализация модальных окон
    initModals();
}

/**
 * Инициализация раскрывающихся модулей курса
 */
function initCourseModules() {
    const moduleHeaders = document.querySelectorAll('.course-module__header');
    
    moduleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const targetId = header.getAttribute('data-toggle');
            const moduleElement = header.closest('.course-module');
            
            // Переключаем состояние текущего модуля
            moduleElement.classList.toggle('active');
            
            // Опциональное закрытие других модулей
            // Раскомментируйте следующий код для аккордеон-эффекта
            /*
            const activeModules = document.querySelectorAll('.course-module.active');
            activeModules.forEach(activeModule => {
                if (activeModule !== moduleElement) {
                    activeModule.classList.remove('active');
                }
            });
            */
        });
    });
    
    // Открываем первый модуль по умолчанию
    const firstModule = document.querySelector('.course-module');
    if (firstModule) {
        firstModule.classList.add('active');
    }
    
    // Обработчик для кнопки "Показать все модули"
    const showAllModulesBtn = document.querySelector('.course-program__more .btn');
    if (showAllModulesBtn) {
        showAllModulesBtn.addEventListener('click', () => {
            const modules = document.querySelectorAll('.course-module');
            const isAllOpen = Array.from(modules).every(module => module.classList.contains('active'));
            
            if (isAllOpen) {
                // Если все открыты, закрываем все, кроме первого
                modules.forEach((module, index) => {
                    if (index > 0) {
                        module.classList.remove('active');
                    }
                });
                showAllModulesBtn.textContent = 'Показать все модули';
            } else {
                // Если не все открыты, открываем все
                modules.forEach(module => {
                    module.classList.add('active');
                });
                showAllModulesBtn.textContent = 'Свернуть все модули';
            }
        });
    }
}

/**
 * Инициализация кнопок "Поделиться"
 */
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.course-share__button');
    
    if (shareButtons.length === 0) return;
    
    // Получаем URL текущей страницы и заголовок курса
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.querySelector('.course-banner__title').textContent);
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Определяем тип кнопки по классу
            if (button.classList.contains('course-share__button--facebook')) {
                // Шаринг в Facebook
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`, 'facebook-share', 'width=580, height=296');
            } 
            else if (button.classList.contains('course-share__button--twitter')) {
                // Шаринг в Twitter
                window.open(`https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`, 'twitter-share', 'width=550, height=235');
            }
            else if (button.classList.contains('course-share__button--telegram')) {
                // Шаринг в Telegram
                window.open(`https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`, 'telegram-share', 'width=550, height=435');
            }
            else if (button.classList.contains('course-share__button--copy')) {
                // Копирование в буфер обмена
                navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                        showToast('Ссылка скопирована в буфер обмена', 'success');
                        
                        // Добавляем анимацию для кнопки
                        button.classList.add('copied');
                        setTimeout(() => {
                            button.classList.remove('copied');
                        }, 1500);
                    })
                    .catch(err => {
                        console.error('Не удалось скопировать ссылку: ', err);
                        showToast('Не удалось скопировать ссылку', 'error');
                    });
            }
        });
    });
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

/**
 * Инициализация модальных окон для страницы курса
 */
document.addEventListener("DOMContentLoaded", () => {
    // Кнопки для открытия модальных окон
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');
    const startLearningBtn = document.querySelector('.start-learning-btn');

    // Кнопки для переключения между модальными окнами
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const showLoginBtn = document.getElementById('showLoginBtn');

    // Модальные окна
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');

    // Элементы закрытия модальных окон
    const closeButtons = document.querySelectorAll('.modal__close');
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
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(loginModal);
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(registerModal);
        });
    }

    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showNotification('Для начала обучения необходимо зарегистрироваться', 'info');
        });
    }

    // Обработчики для кнопок переключения между модальными окнами
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    }

    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });
    }

    // Обработчики для кнопок закрытия модальных окон
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    // Закрытие модального окна при клике на оверлей
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeAllModals);
    }

    // Закрытие модального окна при нажатии Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

});


