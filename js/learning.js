// Скрипт для страницы прохождения курса

document.addEventListener("DOMContentLoaded", () => {
    // Инициализация функциональности страницы прохождения курса
    initLearningPage();
});

/**
 * Инициализация функциональности страницы прохождения курса
 */
function initLearningPage() {
    // Скрываем прелоадер
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    }
    
    // Инициализация меню пользователя в шапке
    initUserMenu();
    
    // Инициализация боковой панели на мобильных устройствах
    initSidebar();
    
    // Инициализация модулей курса
    initCourseModules();
    
    // Инициализация вкладок с контентом
    initContentTabs();
    
    // Инициализация навигации по урокам
    initLessonNavigation();
    
    // Отслеживание прогресса просмотра видео
    initVideoProgress();
    
    // Сохранение прогресса прохождения урока
    initLessonProgress();
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
 * Инициализация боковой панели на мобильных устройствах
 */
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.course-sidebar');
    const closeBtn = document.querySelector('.course-sidebar__close');
    
    if (!sidebarToggle || !sidebar) return;
    
    // Создаем оверлей для закрытия сайдбара при клике вне его
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
        sidebarToggle.classList.toggle('active');
        overlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
    });
    
    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarToggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    });
    
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarToggle.classList.remove('active');
        overlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    });
    
    // Закрытие сайдбара при изменении размера окна
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            sidebarToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    });
    
    // Закрытие сайдбара при клике на урок (на мобильных)
    const lessonItems = document.querySelectorAll('.course-module__lesson');
    lessonItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                sidebarToggle.classList.remove('active');
                overlay.classList.remove('active');
                document.body.classList.remove('sidebar-open');
            }
        });
    });
}

/**
 * Инициализация модулей курса
 */
function initCourseModules() {
    const moduleHeaders = document.querySelectorAll('.course-module__header');
    
    moduleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const module = header.closest('.course-module');
            module.classList.toggle('active');
            
            // Сохраняем состояние открытого модуля в localStorage
            saveModuleState();
        });
    });
    
    // Загружаем сохраненное состояние модулей
    loadModuleState();
    
    // Раскрываем модуль с активным уроком
    const activeLesson = document.querySelector('.course-module__lesson--active');
    if (activeLesson) {
        const activeModule = activeLesson.closest('.course-module');
        if (activeModule) {
            activeModule.classList.add('active');
        }
    }
}

/**
 * Сохранение состояния открытых модулей
 */
function saveModuleState() {
    const moduleStates = {};
    const modules = document.querySelectorAll('.course-module');
    
    modules.forEach((module, index) => {
        moduleStates[`module_${index}`] = module.classList.contains('active');
    });
    
    localStorage.setItem('courseModuleStates', JSON.stringify(moduleStates));
}

/**
 * Загрузка состояния открытых модулей
 */
function loadModuleState() {
    const savedStates = localStorage.getItem('courseModuleStates');
    if (!savedStates) return;
    
    try {
        const moduleStates = JSON.parse(savedStates);
        const modules = document.querySelectorAll('.course-module');
        
        modules.forEach((module, index) => {
            if (moduleStates[`module_${index}`]) {
                module.classList.add('active');
            } else {
                module.classList.remove('active');
            }
        });
    } catch (error) {
        console.error('Failed to parse module states:', error);
    }
}

/**
 * Инициализация вкладок с контентом
 */
function initContentTabs() {
    const tabs = document.querySelectorAll('.learning-tabs__tab');
    const tabContents = document.querySelectorAll('.learning-tab-content');
    
    if (tabs.length === 0 || tabContents.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Убираем активное состояние со всех вкладок
            tabs.forEach(t => {
                t.classList.remove('learning-tabs__tab--active');
            });
            
            // Активируем текущую вкладку
            tab.classList.add('learning-tabs__tab--active');
            
            // Скрываем все содержимое вкладок
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Показываем содержимое активной вкладки
            const tabId = tab.getAttribute('data-tab');
            const activeContent = document.getElementById(tabId);
            if (activeContent) {
                activeContent.style.display = 'block';
            }
            
            // Сохраняем активную вкладку в localStorage
            localStorage.setItem('activeTab', tabId);
        });
    });
    
    // Загружаем сохраненную активную вкладку
    const savedTab = localStorage.getItem('activeTab');
    if (savedTab) {
        const tabToActivate = document.querySelector(`.learning-tabs__tab[data-tab="${savedTab}"]`);
        if (tabToActivate) {
            tabToActivate.click();
        }
    }
}

/**
 * Инициализация навигации по урокам
 */
function initLessonNavigation() {
    const nextLessonBtn = document.getElementById('nextLessonBtn');
    const lessonItems = document.querySelectorAll('.course-module__lesson');
    
    if (!nextLessonBtn || lessonItems.length === 0) return;
    
    // Поиск следующего урока
    const findNextLesson = () => {
        let activeFound = false;
        let nextLesson = null;
        
        lessonItems.forEach(item => {
            if (activeFound && !nextLesson) {
                nextLesson = item;
            }
            
            if (item.classList.contains('course-module__lesson--active')) {
                activeFound = true;
            }
        });
        
        return nextLesson;
    };
    
    // Обработчик для кнопки "Следующий урок"
    nextLessonBtn.addEventListener('click', () => {
        const nextLesson = findNextLesson();
        
        if (nextLesson) {
            const lessonId = nextLesson.getAttribute('data-lesson-id');
            // Симуляция сохранения прогресса
            markLessonComplete();
            // Переход к следующему уроку (в реальном приложении здесь был бы
            // редирект или загрузка нового контента)
            navigateToLesson(lessonId);
        } else {
            // Если это последний урок, показываем кнопку "Пройти тест"
            nextLessonBtn.textContent = 'Пройти тест';
            nextLessonBtn.addEventListener('click', () => {
                window.location.href = 'student-test.html'; // Редирект на страницу теста
            }, { once: true });
        }
    });
    
    // Обработчик клика по уроку в сайдбаре
    lessonItems.forEach(item => {
        item.addEventListener('click', () => {
            // Подтверждение перехода к другому уроку (опционально)
            const isActive = item.classList.contains('course-module__lesson--active');
            
            if (!isActive) {
                const lessonId = item.getAttribute('data-lesson-id');
                navigateToLesson(lessonId);
            }
        });
    });
}

/**
 * Функция перехода к другому уроку (симуляция)
 */
function navigateToLesson(lessonId) {
    console.log(`Navigating to lesson ${lessonId}`);
    
    // В реальном приложении здесь была бы загрузка данных урока через AJAX
    // и обновление контента на странице без перезагрузки
    
    // Симуляция перехода - обновляем активный урок в сайдбаре
    const lessonItems = document.querySelectorAll('.course-module__lesson');
    lessonItems.forEach(item => {
        item.classList.remove('course-module__lesson--active');
        
        if (item.getAttribute('data-lesson-id') === lessonId) {
            item.classList.add('course-module__lesson--active');
            
            // Раскрываем модуль с активным уроком
            const activeModule = item.closest('.course-module');
            if (activeModule) {
                const modules = document.querySelectorAll('.course-module');
                modules.forEach(module => {
                    module.classList.remove('active');
                });
                activeModule.classList.add('active');
            }
        }
    });
    
    // Сохраняем активный урок в localStorage
    localStorage.setItem('activeLesson', lessonId);
    
    // Прокрутка к началу контента
    document.querySelector('.learning-content').scrollTop = 0;
    window.scrollTo(0, 0);
    
    // Обновление заголовка урока (в реальном приложении)
    const lessonTitle = document.querySelector(`.course-module__lesson[data-lesson-id="${lessonId}"] .course-module__lesson-title`).textContent;
    document.querySelector('.learning-header__title').textContent = lessonTitle;
    
    // Обновляем прогресс-бар
    updateLessonProgress(lessonId);
}

/**
 * Обновление индикатора прогресса урока
 */
function updateLessonProgress(currentLessonId) {
    const lessonItems = document.querySelectorAll('.course-module__lesson');
    const totalLessons = lessonItems.length;
    let currentLessonIndex = 0;
    
    // Находим индекс текущего урока
    lessonItems.forEach((item, index) => {
        if (item.getAttribute('data-lesson-id') === currentLessonId) {
            currentLessonIndex = index;
        }
    });
    
    // Обновляем индикаторы прогресса
    const lessonProgress = document.querySelector('.learning-footer__progress-text');
    const progressBar = document.querySelector('.learning-footer__progress-fill');
    const courseProgressBar = document.querySelector('.course-progress__fill');
    const progressPercent = document.getElementById('progressPercent');
    
    if (lessonProgress) {
        lessonProgress.textContent = `Урок ${currentLessonIndex + 1} из ${totalLessons}`;
    }
    
    const progressPercentage = ((currentLessonIndex + 1) / totalLessons) * 100;
    
    if (progressBar) {
        progressBar.style.width = `${progressPercentage}%`;
    }
    
    if (courseProgressBar && progressPercent) {
        courseProgressBar.style.width = `${progressPercentage}%`;
        progressPercent.textContent = `${Math.round(progressPercentage)}%`;
    }
}

/**
 * Отметка урока как завершенного
 */
function markLessonComplete() {
    const activeLesson = document.querySelector('.course-module__lesson--active');
    if (!activeLesson) return;
    
    // Добавляем класс completed
    activeLesson.classList.add('course-module__lesson--completed');
    
    // Обновляем иконку статуса (в реальном приложении)
    const statusIcon = activeLesson.querySelector('.course-module__lesson-status svg');
    if (statusIcon) {
        statusIcon.outerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1952 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }
    
    // Сохраняем прогресс в localStorage
    saveCompletedLessons();
}

/**
 * Сохранение завершенных уроков
 */
function saveCompletedLessons() {
    const completedLessons = [];
    const lessonItems = document.querySelectorAll('.course-module__lesson--completed');
    
    lessonItems.forEach(item => {
        const lessonId = item.getAttribute('data-lesson-id');
        completedLessons.push(lessonId);
    });
    
    localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
}

/**
 * Загрузка завершенных уроков
 */
function loadCompletedLessons() {
    const savedLessons = localStorage.getItem('completedLessons');
    if (!savedLessons) return;
    
    try {
        const completedLessons = JSON.parse(savedLessons);
        const lessonItems = document.querySelectorAll('.course-module__lesson');
        
        lessonItems.forEach(item => {
            const lessonId = item.getAttribute('data-lesson-id');
            
            if (completedLessons.includes(lessonId)) {
                item.classList.add('course-module__lesson--completed');
                
                // Обновляем иконку статуса
                const statusIcon = item.querySelector('.course-module__lesson-status svg');
                if (statusIcon) {
                    statusIcon.outerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1952 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `;
                }
            }
        });
    } catch (error) {
        console.error('Failed to parse completed lessons:', error);
    }
}

/**
 * Отслеживание прогресса просмотра видео
 */
function initVideoProgress() {
    // Получаем iframe с видео
    const videoFrame = document.getElementById('lessonVideo');
    
    if (!videoFrame) return;
    
    // Этот код работает только если видео размещено на YouTube и поддерживает API
    // В реальном приложении нужно реализовать интеграцию с YouTube API или другим видеосервисом
    try {
        // Отслеживаем сообщения от iframe
        window.addEventListener('message', (event) => {
            // Проверяем, что сообщение от YouTube
            if (event.origin !== 'https://www.youtube.com') return;
            
            try {
                const data = JSON.parse(event.data);
                
                // Отслеживаем события видео
                if (data.event === 'onStateChange' && data.info === 0) {
                    // Видео завершилось (0 - статус завершения)
                    console.log('Video completed');
                    // Отмечаем урок как просмотренный
                    markVideoAsWatched();
                }
            } catch (e) {
                // Ошибка парсинга JSON может возникнуть из-за других сообщений от YouTube
            }
        });
    } catch (error) {
        console.error('Failed to initialize video tracking:', error);
    }
}

/**
 * Отметка видео как просмотренного
 */
function markVideoAsWatched() {
    const activeLesson = document.querySelector('.course-module__lesson--active');
    if (!activeLesson) return;
    
    const lessonId = activeLesson.getAttribute('data-lesson-id');
    
    // Сохраняем ID просмотренного видео в localStorage
    const watchedVideos = JSON.parse(localStorage.getItem('watchedVideos') || '[]');
    
    if (!watchedVideos.includes(lessonId)) {
        watchedVideos.push(lessonId);
        localStorage.setItem('watchedVideos', JSON.stringify(watchedVideos));
    }
    
    // Автоматически переходим к следующему уроку (опционально)
    // Раскомментируйте строку ниже, если нужен автопереход
    // document.getElementById('nextLessonBtn').click();
}

/**
 * Сохранение прогресса прохождения урока
 */
function initLessonProgress() {
    // Загружаем сохраненный прогресс
    loadCompletedLessons();
    
    // Восстанавливаем активный урок
    const savedLesson = localStorage.getItem('activeLesson');
    if (savedLesson) {
        const lessonToActivate = document.querySelector(`.course-module__lesson[data-lesson-id="${savedLesson}"]`);
        if (lessonToActivate && !lessonToActivate.classList.contains('course-module__lesson--active')) {
            // Симулируем клик по уроку для активации
            lessonToActivate.click();
        }
    }
    
    // Обновляем прогресс-бар для текущего урока
    const activeLesson = document.querySelector('.course-module__lesson--active');
    if (activeLesson) {
        const lessonId = activeLesson.getAttribute('data-lesson-id');
        updateLessonProgress(lessonId);
    }
}
