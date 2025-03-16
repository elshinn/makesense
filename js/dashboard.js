// Скрипт для личного кабинета ученика

document.addEventListener("DOMContentLoaded", () => {
    // Инициализация функциональности личного кабинета
    initDashboard();
});

/**
 * Инициализация функциональности личного кабинета
 */
function initDashboard() {
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
    
    // Инициализация вкладок в боковом меню
    initSidebarTabs();
    
    // Инициализация фильтрации курсов
    initCourseFilters();
    
    // Инициализация кнопки "Наверх"
    initBackToTop();
    
    // Инициализация ленивой загрузки изображений
    initLazyLoading();
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
    
    // Закрытие меню при клике на ссылку в мобильном режиме
    const sidebarLinks = document.querySelectorAll('.sidebar__menu-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                mobileMenuToggle.classList.remove('active');
                sidebar.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });
    
    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            mobileMenuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
    
    // Добавление оверлея для закрытия мобильного меню при клике вне его
    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', () => {
        mobileMenuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
    
    // Добавление стилей для оверлея
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1040;
            display: none;
        }
        
        body.menu-open .mobile-menu-overlay {
            display: block;
        }
        
        @media (min-width: 768px) {
            .mobile-menu-overlay {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
}

/**
 * Инициализация вкладок в боковом меню
 */
function initSidebarTabs() {
    const tabLinks = document.querySelectorAll('.sidebar__menu-link[data-tab]');
    const tabs = document.querySelectorAll('.dashboard__tab');
    
    if (tabLinks.length === 0 || tabs.length === 0) return;
    
    // Функция для активации вкладки
    const activateTab = (tabId) => {
        // Скрываем все вкладки
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Убираем активное состояние со всех ссылок
        tabLinks.forEach(link => {
            link.classList.remove('sidebar__menu-link--active');
        });
        
        // Активируем нужную вкладку
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        // Активируем ссылку
        const targetLink = document.querySelector(`.sidebar__menu-link[data-tab="${tabId}"]`);
        if (targetLink) {
            targetLink.classList.add('sidebar__menu-link--active');
        }
    };
    
    // Добавляем обработчики для ссылок
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = link.getAttribute('data-tab');
            activateTab(tabId);
        });
    });
    
    // По умолчанию активируем первую вкладку
    const firstTabId = tabLinks[0].getAttribute('data-tab');
    activateTab(firstTabId);
}

/**
 * Инициализация фильтрации курсов
 */
function initCourseFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.dashboard-course-card');
    
    if (filterButtons.length === 0 || courseCards.length === 0) return;
    
    // Функция для фильтрации курсов
    const filterCourses = (filter) => {
        courseCards.forEach(card => {
            const status = card.getAttribute('data-status');
            
            if (filter === 'all' || status === filter) {
                card.style.display = 'block';
                // Добавляем анимацию появления
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    };
    
    // Добавляем обработчики для кнопок фильтрации
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Убираем активное состояние со всех кнопок
            filterButtons.forEach(btn => {
                btn.classList.remove('filter-btn--active');
            });
            
            // Активируем нажатую кнопку
            button.classList.add('filter-btn--active');
            
            // Фильтруем курсы
            const filter = button.getAttribute('data-filter');
            filterCourses(filter);
        });
    });
    
    // Инициализируем с фильтром "Все" по умолчанию
    filterCourses('all');
    
    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
        .dashboard-course-card {
            transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
    `;
    document.head.appendChild(style);
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
 * Инициализация ленивой загрузки изображений
 */
function initLazyLoading() {
    // Проверяем поддержку Intersection Observer
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Убираем атрибут loading для активации встроенной ленивой загрузки
                    img.removeAttribute('loading');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}
