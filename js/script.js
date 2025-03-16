// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Скрываем прелоадер после загрузки страницы
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    });
    
    // Инициализация анимаций при появлении элементов в области видимости
    initAnimations();
    
    // Инициализация эффектов прокрутки для шапки
    initHeaderScroll();
    
    // Инициализация мобильной навигации
    initMobileNav();
    
    // Инициализация работы аккордеона
    initAccordion();
    
    // Инициализация карусели отзывов
    initCarousel();
    
    // Инициализация модальных окон
    initModals();
    
    // Инициализация валидации форм
    initFormValidation();
    
    // Инициализация измерителя надежности пароля
    initPasswordStrength();
    
    // Инициализация анимации счетчиков для статистики
    initCounters();
    
    // Инициализация кнопки возврата наверх
    initBackToTop();
    
    // Инициализация параллакс-эффекта
    initParallax();
    
    // Инициализация фильтрации курсов
    initCoursesFilter();
    
    // Инициализация плавной прокрутки к якорным ссылкам
    initSmoothScroll();
});

/**
 * Инициализация анимаций для элементов, которые появляются в области видимости
 */
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-in');
    
    // Если браузер не поддерживает Intersection Observer, просто показываем все элементы
    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach(el => el.classList.add('show'));
        return;
    }
    
    const animateElement = (element) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('show');
                    }, 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(element);
    };
    
    animatedElements.forEach((element, index) => {
        setTimeout(() => {
            animateElement(element);
        }, index * 50); // Разбиваем анимации по времени для более естественного эффекта
    });
}

/**
 * Инициализация эффектов прокрутки для шапки
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Добавляем класс scrolled при прокрутке страницы
        if (scrollTop > 10) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        // Скрываем шапку при прокрутке вниз и показываем при прокрутке вверх
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('header--hidden');
        } else {
            header.classList.remove('header--hidden');
        }
        
        lastScrollTop = scrollTop;
    });
}

/**
 * Инициализация мобильной навигации
 */
function initMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav__list');
    
    if (!navToggle || !navList) return;
    
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });
    
    // Закрываем мобильное меню при клике вне его
    document.addEventListener('click', (e) => {
        if (navList.classList.contains('active') && 
            !navList.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.classList.remove('nav-open');
        }
    });
    
    // Закрываем мобильное меню при клике на ссылку
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
}

/**
 * Инициализация работы аккордеона
 */
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion__item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion__header');
        
        if (!header) return;
        
        header.addEventListener('click', () => {
            // Проверяем, был ли этот элемент уже открыт
            const isActive = item.classList.contains('active');
            
            // Закрываем все элементы
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Если элемент не был активен, открываем его
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Инициализация карусели отзывов
 */
function initCarousel() {
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;
    
    if (!slides.length || !dots.length) return;
    
    // Функция для показа определенного слайда
    const showSlide = (index) => {
        // Убираем активный класс со всех слайдов и точек
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Добавляем активный класс к текущему слайду и точке
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    };
    
    // Обработчики событий для кнопок "вперед" и "назад"
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });
    
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });
    
    // Обработчики событий для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Автоматическое переключение слайдов каждые 5 секунд
    let interval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 5000);
    
    // Пауза автоматического переключения при наведении
    const carousel = document.querySelector('.testimonials__carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', () => clearInterval(interval));
        carousel.addEventListener('mouseleave', () => {
            interval = setInterval(() => {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }, 5000);
        });
    }
}

/**
 * Инициализация модальных окон
 */
function initModals() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtns = document.querySelectorAll('.login-btn');
    const registerBtns = document.querySelectorAll('.register-btn, .register-btn-cta');
    const closeBtns = document.querySelectorAll('.modal__close');
    const showLoginLink = document.querySelector('.show-login');
    const showRegisterLink = document.querySelector('.show-register');
    const registerTabs = document.querySelectorAll('.register-tab');
    const teacherFields = document.querySelector('.teacher-fields');
    
    if (!loginModal || !registerModal) return;
    
    // Функция открытия модального окна
    const openModal = (modal) => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // Функция закрытия модального окна
    const closeModal = (modal) => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    // Открытие модального окна входа
    loginBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal(loginModal));
    });
    
    // Открытие модального окна регистрации
    registerBtns.forEach(btn => {
        btn.addEventListener('click', () => openModal(registerModal));
    });
    
    // Закрытие модальных окон при нажатии на кнопку закрытия
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Закрытие модальных окон при клике вне области модального окна
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });
    
    // Переключение между модальными окнами входа и регистрации
    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            setTimeout(() => {
                openModal(loginModal);
            }, 300);
        });
    }
    
    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            setTimeout(() => {
                openModal(registerModal);
            }, 300);
        });
    }
    
    // Переключение видимости пароля
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const input = toggle.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
        });
    });
    
    // Переключение вкладок в форме регистрации
    if (registerTabs.length && teacherFields) {
        registerTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                registerTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                if (tab.dataset.tab === 'teacher') {
                    teacherFields.style.display = 'block';
                } else {
                    teacherFields.style.display = 'none';
                }
            });
        });
    }
}

/**
 * Инициализация валидации форм
 */
function initFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const contactForm = document.querySelector('.contact-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');
            
            // Валидация email
            if (!validateEmail(email.value)) {
                showError(email, 'Пожалуйста, введите корректный email');
                isValid = false;
            } else {
                clearError(email);
            }
            
            // Валидация пароля
            if (password.value.length < 6) {
                showError(password, 'Пароль должен содержать не менее 6 символов');
                isValid = false;
            } else {
                clearError(password);
            }
            
            if (isValid) {
                // Имитация успешного входа
                showToast('Вход выполнен успешно', 'success');
                document.getElementById('loginModal').classList.remove('active');
                document.body.style.overflow = '';
                
                // Имитация хранения данных пользователя (в реальном приложении это обрабатывалось бы бэкендом)
                localStorage.setItem('user', JSON.stringify({
                    email: email.value,
                    name: 'Пользователь',
                    role: 'student'
                }));
                
                // Обновляем UI для авторизованного пользователя
                updateAuthUI();
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const name = document.getElementById('registerName');
            const email = document.getElementById('registerEmail');
            const password = document.getElementById('registerPassword');
            const passwordConfirm = document.getElementById('registerPasswordConfirm');
            const terms = document.getElementById('termsAgreement');
            const activeTab = document.querySelector('.register-tab.active').dataset.tab;
            
            // Валидация имени
            if (name.value.trim() === '') {
                showError(name, 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else {
                clearError(name);
            }
            
            // Валидация email
            if (!validateEmail(email.value)) {
                showError(email, 'Пожалуйста, введите корректный email');
                isValid = false;
            } else {
                clearError(email);
            }
            
            // Валидация пароля
            if (password.value.length < 8) {
                showError(password, 'Пароль должен содержать не менее 8 символов');
                isValid = false;
            } else {
                clearError(password);
            }
            
            // Валидация подтверждения пароля
            if (password.value !== passwordConfirm.value) {
                showError(passwordConfirm, 'Пароли не совпадают');
                isValid = false;
            } else {
                clearError(passwordConfirm);
            }
            
            // Валидация согласия с условиями
            if (!terms.checked) {
                showError(terms, 'Вы должны согласиться с условиями');
                isValid = false;
            } else {
                clearError(terms);
            }
            
            // Валидация специализации преподавателя, если выбрана вкладка преподавателя
            if (activeTab === 'teacher') {
                const specialization = document.getElementById('teacherSpecialization');
                if (specialization.value.trim() === '') {
                    showError(specialization, 'Пожалуйста, укажите вашу специализацию');
                    isValid = false;
                } else {
                    clearError(specialization);
                }
            }
            
            if (isValid) {
                // Имитация успешной регистрации
                showToast('Регистрация выполнена успешно', 'success');
                document.getElementById('registerModal').classList.remove('active');
                document.body.style.overflow = '';
                
                // Имитация хранения данных пользователя (в реальном приложении это обрабатывалось бы бэкендом)
                localStorage.setItem('user', JSON.stringify({
                    email: email.value,
                    name: name.value,
                    role: activeTab
                }));
                
                // Обновляем UI для авторизованного пользователя
                updateAuthUI();
            }
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            
            const name = document.getElementById('contactName');
            const email = document.getElementById('contactEmail');
            const subject = document.getElementById('contactSubject');
            const message = document.getElementById('contactMessage');
            
            // Валидация имени
            if (name && name.value.trim() === '') {
                showError(name, 'Пожалуйста, введите ваше имя');
                isValid = false;
            } else if (name) {
                clearError(name);
            }
            
            // Валидация email
            if (email && !validateEmail(email.value)) {
                showError(email, 'Пожалуйста, введите корректный email');
                isValid = false;
            } else if (email) {
                clearError(email);
            }
            
            // Валидация темы
            if (subject && subject.value.trim() === '') {
                showError(subject, 'Пожалуйста, введите тему сообщения');
                isValid = false;
            } else if (subject) {
                clearError(subject);
            }
            
            // Валидация сообщения
            if (message && message.value.trim() === '') {
                showError(message, 'Пожалуйста, введите ваше сообщение');
                isValid = false;
            } else if (message) {
                clearError(message);
            }
            
            if (isValid) {
                // Имитация отправки сообщения
                showToast('Ваше сообщение успешно отправлено', 'success');
                contactForm.reset();
            }
        });
    }
    
    // Вспомогательные функции для валидации форм
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        input.classList.add('error');
        errorElement.textContent = message;
    }
    
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        
        input.classList.remove('error');
        errorElement.textContent = '';
    }
    
    // Обновление UI после авторизации
    function updateAuthUI() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            // В реальном приложении здесь бы обновился UI для авторизованного пользователя
        }
    }
    
    // Проверяем, авторизован ли пользователь при загрузке страницы
    updateAuthUI();
}

/**
 * Инициализация измерителя надежности пароля
 */
function initPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    const strengthBar = document.querySelector('.password-strength__bar');
    const strengthLabel = document.querySelector('.password-strength__label');
    
    if (!passwordInput || !strengthBar || !strengthLabel) return;
    
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = calculatePasswordStrength(password);
        
        // Удаляем все классы силы пароля
        strengthBar.classList.remove('weak', 'medium', 'strong', 'very-strong');
        
        if (password.length === 0) {
            strengthLabel.textContent = 'Надежность пароля';
        } else if (strength < 30) {
            strengthBar.classList.add('weak');
            strengthLabel.textContent = 'Слабый пароль';
        } else if (strength < 60) {
            strengthBar.classList.add('medium');
            strengthLabel.textContent = 'Средний пароль';
        } else if (strength < 80) {
            strengthBar.classList.add('strong');
            strengthLabel.textContent = 'Надежный пароль';
        } else {
            strengthBar.classList.add('very-strong');
            strengthLabel.textContent = 'Очень надежный пароль';
        }
    });
    
    // Расчет надежности пароля (от 0 до 100)
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Вклад длины пароля
        if (password.length >= 8) {
            strength += 25;
        } else if (password.length >= 6) {
            strength += 10;
        }
        
        // Вклад разнообразия символов
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
            strength += 20;
        } else if (/[a-z]/.test(password) || /[A-Z]/.test(password)) {
            strength += 10;
        }
        
        if (/[0-9]/.test(password)) {
            strength += 20;
        }
        
        if (/[^a-zA-Z0-9]/.test(password)) {
            strength += 25;
        }
        
        // Бонус за сложность
        if (password.length >= 12 && 
            /[a-z]/.test(password) && 
            /[A-Z]/.test(password) && 
            /[0-9]/.test(password) && 
            /[^a-zA-Z0-9]/.test(password)) {
            strength += 10;
        }
        
        return strength;
    }
}

/**
 * Показать уведомление toast
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastTitle = toast.querySelector('.toast__title');
    const toastMessage = toast.querySelector('.toast__message');
    const toastClose = toast.querySelector('.toast__close');
    
    // Удаляем все существующие классы
    toast.className = 'toast';
    
    // Добавляем соответствующий класс в зависимости от типа
    toast.classList.add(`toast--${type}`);
    
    // Устанавливаем содержимое toast в зависимости от типа
    switch (type) {
        case 'success':
            toastTitle.textContent = 'Успех';
            break;
        case 'error':
            toastTitle.textContent = 'Ошибка';
            break;
        case 'warning':
            toastTitle.textContent = 'Предупреждение';
            break;
        default:
            toastTitle.textContent = 'Информация';
    }
    
    toastMessage.textContent = message;
    
    // Показываем toast
    toast.classList.add('show');
    
    // Автоматически скрываем через 5 секунд
    const hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
    
    // Закрытие вручную
    toastClose.addEventListener('click', () => {
        clearTimeout(hideTimeout);
        toast.classList.remove('show');
    });
}

/**
 * Инициализация анимации счетчиков для статистики
 */
function initCounters() {
    const counters = document.querySelectorAll('.stat-card__number');
    
    if (!counters.length) return;
    
    if (!('IntersectionObserver' in window)) {
        counters.forEach(counter => {
            counter.textContent = counter.getAttribute('data-count');
        });
        return;
    }
    
    counters.forEach(counter => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000; // мс
                    const increment = target / (duration / 16); // Обновление каждые 16мс (60fps)
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.round(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };
                    
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

/**
 * Инициализация кнопки возврата наверх
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    // Показываем кнопку при прокрутке вниз
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
 * Инициализация параллакс-эффекта
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (!parallaxElements.length) return;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = 0.15;
            const distance = scrollY * speed;
            element.style.transform = `translateY(${distance}px)`;
        });
    });
}

/**
 * Инициализация фильтрации курсов
 */
function initCoursesFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courses = document.querySelectorAll('.course-card');
    
    if (!filterBtns.length || !courses.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Удаляем активный класс со всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Добавляем активный класс к нажатой кнопке
            btn.classList.add('active');
            
            // Получаем категорию для фильтрации
            const filter = btn.dataset.filter;
            
            // Фильтруем курсы
            courses.forEach(course => {
                if (filter === 'all' || course.dataset.category === filter) {
                    course.style.display = 'block';
                    setTimeout(() => {
                        course.style.opacity = '1';
                        course.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    course.style.opacity = '0';
                    course.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        course.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * Инициализация плавной прокрутки к якорным ссылкам
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}