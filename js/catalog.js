document.addEventListener("DOMContentLoaded", () => {
    // Инициализация функциональности каталога
    initCatalog();
});

/**
 * Инициализация функциональности каталога курсов
 */
function initCatalog() {
    // Прелоадер
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    }
    
    // Инициализация дропдаунов для фильтров
    initDropdowns();
    
    // Инициализация фильтрации и поиска
    initFiltering();
    
    // Инициализация пагинации
    initPagination();
    
    // Инициализация анимации карточек
    initCardAnimations();
    
    // Инициализация кнопки "Наверх"
    initBackToTop();
}

/**
 * Инициализация дропдаунов для фильтров
 */
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('.dropdown__button');
        const content = dropdown.querySelector('.dropdown__content');
        
        if (button && content) {
            // Клик по кнопке дропдауна
            button.addEventListener('click', () => {
                dropdown.classList.toggle('active');
                
                // Закрыть другие дропдауны
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                        otherDropdown.classList.remove('active');
                    }
                });
            });
            
            // Клик вне дропдауна
            document.addEventListener('click', (event) => {
                if (!dropdown.contains(event.target)) {
                    dropdown.classList.remove('active');
                }
            });
        }
    });
}

/**
 * Инициализация фильтрации и поиска
 */
function initFiltering() {
    const searchInput = document.getElementById('courseSearch');
    const coursesGrid = document.getElementById('coursesGrid');
    const courseCards = document.querySelectorAll('.course-card');
    const courseCount = document.getElementById('courseCount');
    const emptyState = document.getElementById('emptyState');
    const resetFiltersBtn = document.getElementById('resetFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const activeFiltersList = document.getElementById('activeFiltersList');
    
    // Категории курсов
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    
    // Уровни сложности
    const levelCheckboxes = document.querySelectorAll('.level-checkbox');
    
    // Сортировка
    const sortSelect = document.getElementById('sortSelect');
    
    // Объект для хранения текущих фильтров
    const filters = {
        search: '',
        categories: ['all'],
        levels: ['all'],
        sort: 'popular'
    };
    
    // Функция для обновления активных фильтров
    function updateActiveFilters() {
        // Очистить текущие фильтры
        activeFiltersList.innerHTML = '';
        
        // Добавить поисковый запрос, если есть
        if (filters.search) {
            const searchFilter = createFilterItem(`Поиск: ${filters.search}`, 'search');
            activeFiltersList.appendChild(searchFilter);
        }
        
        // Добавить категории
        if (!filters.categories.includes('all')) {
            filters.categories.forEach(category => {
                const categoryLabel = getCategoryLabel(category);
                const categoryFilter = createFilterItem(categoryLabel, `category-${category}`);
                activeFiltersList.appendChild(categoryFilter);
            });
        } else {
            const allCategoriesFilter = createFilterItem('Все категории', 'category-all');
            activeFiltersList.appendChild(allCategoriesFilter);
        }
        
        // Добавить уровни
        if (!filters.levels.includes('all')) {
            filters.levels.forEach(level => {
                const levelLabel = getLevelLabel(level);
                const levelFilter = createFilterItem(levelLabel, `level-${level}`);
                activeFiltersList.appendChild(levelFilter);
            });
        } else if (activeFiltersList.children.length === 0) { // Только если других фильтров нет
            const allLevelsFilter = createFilterItem('Все уровни', 'level-all');
            activeFiltersList.appendChild(allLevelsFilter);
        }
    }
    
    // Функция для создания элемента активного фильтра
    function createFilterItem(text, id) {
        const filterItem = document.createElement('span');
        filterItem.className = 'active-filters__item';
        filterItem.dataset.id = id;
        
        filterItem.innerHTML = `
            ${text} <button class="active-filters__remove" aria-label="Удалить фильтр">×</button>
        `;
        
        // Добавляем обработчик для удаления фильтра
        const removeBtn = filterItem.querySelector('.active-filters__remove');
        removeBtn.addEventListener('click', () => {
            if (id === 'search') {
                searchInput.value = '';
                filters.search = '';
            } else if (id.startsWith('category-')) {
                const category = id.replace('category-', '');
                if (category === 'all') {
                    // Если убираем "Все категории", выбираем первую доступную
                    const firstCategory = document.querySelector('.category-checkbox:not([value="all"])');
                    if (firstCategory) {
                        firstCategory.checked = true;
                        filters.categories = [firstCategory.value];
                    }
                } else {
                    filters.categories = filters.categories.filter(c => c !== category);
                    if (filters.categories.length === 0) {
                        // Если ничего не выбрано, возвращаемся к "Все категории"
                        document.getElementById('all').checked = true;
                        filters.categories = ['all'];
                    }
                    document.querySelector(`.category-checkbox[value="${category}"]`).checked = false;
                }
            } else if (id.startsWith('level-')) {
                const level = id.replace('level-', '');
                if (level === 'all') {
                    // Если убираем "Все уровни", выбираем первый доступный
                    const firstLevel = document.querySelector('.level-checkbox:not([value="all"])');
                    if (firstLevel) {
                        firstLevel.checked = true;
                        filters.levels = [firstLevel.value];
                    }
                } else {
                    filters.levels = filters.levels.filter(l => l !== level);
                    if (filters.levels.length === 0) {
                        // Если ничего не выбрано, возвращаемся к "Все уровни"
                        document.getElementById('all-levels').checked = true;
                        filters.levels = ['all'];
                    }
                    document.querySelector(`.level-checkbox[value="${level}"]`).checked = false;
                }
            }
            
            applyFilters();
        });
        
        return filterItem;
    }
    
    // Функция для получения читабельного названия категории
    function getCategoryLabel(category) {
        const labels = {
            'all': 'Все категории',
            'development': 'Разработка',
            'design': 'Дизайн',
            'marketing': 'Маркетинг',
            'business': 'Бизнес',
            'science': 'Наука'
        };
        return labels[category] || category;
    }
    
    // Функция для получения читабельного названия уровня
    function getLevelLabel(level) {
        const labels = {
            'all': 'Все уровни',
            'beginner': 'Начальный',
            'intermediate': 'Средний',
            'advanced': 'Продвинутый'
        };
        return labels[level] || level;
    }
    
    // Обработчик поискового поля
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            filters.search = searchInput.value.toLowerCase().trim();
            applyFilters();
        }, 300));
    }
    
    // Обработчики чекбоксов категорий
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.value === 'all' && checkbox.checked) {
                // Если выбрали "Все категории", снимаем выделение с других категорий
                categoryCheckboxes.forEach(cb => {
                    if (cb.value !== 'all') {
                        cb.checked = false;
                    }
                });
                filters.categories = ['all'];
            } else if (checkbox.checked) {
                // Если выбрали конкретную категорию, снимаем "Все категории"
                const allCheckbox = document.getElementById('all');
                if (allCheckbox) {
                    allCheckbox.checked = false;
                }
                
                // Добавляем категорию, если её ещё нет
                if (!filters.categories.includes(checkbox.value) && filters.categories.includes('all')) {
                    filters.categories = []; // Очищаем "все категории"
                }
                
                if (!filters.categories.includes(checkbox.value)) {
                    filters.categories.push(checkbox.value);
                }
            } else {
                // Если сняли категорию, удаляем её из фильтров
                filters.categories = filters.categories.filter(c => c !== checkbox.value);
                
                // Если не осталось категорий, добавляем "Все категории"
                if (filters.categories.length === 0) {
                    const allCheckbox = document.getElementById('all');
                    if (allCheckbox) {
                        allCheckbox.checked = true;
                    }
                    filters.categories = ['all'];
                }
            }
            
            applyFilters();
        });
    });
    
    // Обработчики чекбоксов уровней
    levelCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.value === 'all' && checkbox.checked) {
                // Если выбрали "Все уровни", снимаем выделение с других уровней
                levelCheckboxes.forEach(cb => {
                    if (cb.value !== 'all') {
                        cb.checked = false;
                    }
                });
                filters.levels = ['all'];
            } else if (checkbox.checked) {
                // Если выбрали конкретный уровень, снимаем "Все уровни"
                const allLevelsCheckbox = document.getElementById('all-levels');
                if (allLevelsCheckbox) {
                    allLevelsCheckbox.checked = false;
                }
                
                // Добавляем уровень, если его ещё нет
                if (!filters.levels.includes(checkbox.value) && filters.levels.includes('all')) {
                    filters.levels = []; // Очищаем "все уровни"
                }
                
                if (!filters.levels.includes(checkbox.value)) {
                    filters.levels.push(checkbox.value);
                }
            } else {
                // Если сняли уровень, удаляем его из фильтров
                filters.levels = filters.levels.filter(l => l !== checkbox.value);
                
                // Если не осталось уровней, добавляем "Все уровни"
                if (filters.levels.length === 0) {
                    const allLevelsCheckbox = document.getElementById('all-levels');
                    if (allLevelsCheckbox) {
                        allLevelsCheckbox.checked = true;
                    }
                    filters.levels = ['all'];
                }
            }
            
            applyFilters();
        });
    });
    
    // Обработчик сортировки
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            filters.sort = sortSelect.value;
            applyFilters();
        });
    }
    
    // Обработчик кнопки сброса фильтров
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Обработчик кнопки очистки всех фильтров
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Функция для сброса всех фильтров
    function resetFilters() {
        // Сбрасываем поле поиска
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Сбрасываем категории
        categoryCheckboxes.forEach(cb => {
            cb.checked = cb.value === 'all';
        });
        
        // Сбрасываем уровни
        levelCheckboxes.forEach(cb => {
            cb.checked = cb.value === 'all';
        });
        
        // Сбрасываем сортировку
        if (sortSelect) {
            sortSelect.value = 'popular';
        }
        
        // Сбрасываем объект фильтров
        filters.search = '';
        filters.categories = ['all'];
        filters.levels = ['all'];
        filters.sort = 'popular';
        
        // Применяем фильтры
        applyFilters();
    }
    
    // Функция для применения фильтров
    function applyFilters() {
        // Обновляем активные фильтры
        updateActiveFilters();
        
        let visibleCount = 0;
        
        // Проходим по всем карточкам и применяем фильтры
        courseCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const cardLevel = card.dataset.level;
            const cardTitle = card.querySelector('.course-card__title').textContent.toLowerCase();
            const cardDescription = card.querySelector('.course-card__description').textContent.toLowerCase();
            
            // Проверяем соответствие фильтрам
            const matchesSearch = !filters.search || 
                cardTitle.includes(filters.search) || 
                cardDescription.includes(filters.search);
            
            const matchesCategory = filters.categories.includes('all') || 
                filters.categories.includes(cardCategory);
            
            const matchesLevel = filters.levels.includes('all') || 
                filters.levels.includes(cardLevel);
            
            // Если карточка проходит все фильтры, показываем её
            if (matchesSearch && matchesCategory && matchesLevel) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Обновляем счетчик найденных курсов
        if (courseCount) {
            courseCount.textContent = visibleCount;
        }
        
        // Показываем пустое состояние, если нет результатов
        if (emptyState) {
            if (visibleCount === 0) {
                emptyState.style.display = 'block';
                if (coursesGrid) {
                    coursesGrid.style.display = 'none';
                }
            } else {
                emptyState.style.display = 'none';
                if (coursesGrid) {
                    coursesGrid.style.display = 'grid';
                }
            }
        }
        
        // Применяем сортировку
        applySorting();
    }
    
    // Функция для применения сортировки
    function applySorting() {
        const cards = Array.from(courseCards).filter(card => card.style.display !== 'none');
        
        // Сортируем карточки в зависимости от выбранного способа сортировки
        cards.sort((a, b) => {
            switch (filters.sort) {
                case 'newest':
                    // Предполагаем, что у более новых курсов будет data-attribute "data-date"
                    // В данном примере сортируем просто по ID (имитация)
                    return parseInt(b.dataset.id || 0) - parseInt(a.dataset.id || 0);
                    
                case 'price-asc':
                    return parseInt(a.dataset.price || 0) - parseInt(b.dataset.price || 0);
                    
                case 'price-desc':
                    return parseInt(b.dataset.price || 0) - parseInt(a.dataset.price || 0);
                    
                case 'rating':
                    return parseFloat(b.dataset.rating || 0) - parseFloat(a.dataset.rating || 0);
                    
                case 'popular':
                default:
                    // По умолчанию сортируем по рейтингу и количеству отзывов (имитация популярности)
                    const aRating = parseFloat(a.dataset.rating || 0);
                    const bRating = parseFloat(b.dataset.rating || 0);
                    if (Math.abs(aRating - bRating) < 0.1) { // Если рейтинги близки
                        // Сортируем по количеству отзывов (используем data-attribute для имитации)
                        return parseInt(b.querySelector('.count').textContent.match(/\d+/) || 0) - 
                               parseInt(a.querySelector('.count').textContent.match(/\d+/) || 0);
                    }
                    return bRating - aRating;
            }
        });
        
        // Переупорядочиваем элементы DOM согласно сортировке
        if (coursesGrid) {
            cards.forEach(card => {
                coursesGrid.appendChild(card);
            });
        }
    }
    
    // Вспомогательная функция debounce для оптимизации поиска
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}


    document.querySelectorAll('.course-card__button').forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'course.html';
        });
    });


/**
 * Инициализация пагинации
 */
function initPagination() {
    const paginationPages = document.querySelectorAll('.pagination__page');
    const prevBtn = document.querySelector('.pagination__button--prev');
    const nextBtn = document.querySelector('.pagination__button--next');
    
    if (paginationPages.length) {
        paginationPages.forEach(page => {
            page.addEventListener('click', () => {
                // Убираем активный класс со всех страниц
                paginationPages.forEach(p => p.classList.remove('pagination__page--active'));
                
                // Добавляем активный класс текущей странице
                page.classList.add('pagination__page--active');
                
                // Обновляем состояние кнопок Next/Prev
                updatePaginationButtons();
                
                // В реальном приложении здесь бы загружались новые курсы
                // Для демонстрации просто прокрутим страницу вверх к каталогу
                document.querySelector('.catalog-banner').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    // Обработчики для кнопок Previous и Next
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (prevBtn.disabled) return;
            
            // Находим текущую активную страницу
            const activePage = document.querySelector('.pagination__page--active');
            const activeIndex = Array.from(paginationPages).indexOf(activePage);
            
            if (activeIndex > 0) {
                // Переключаемся на предыдущую страницу
                paginationPages[activeIndex - 1].click();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (nextBtn.disabled) return;
            
            // Находим текущую активную страницу
            const activePage = document.querySelector('.pagination__page--active');
            const activeIndex = Array.from(paginationPages).indexOf(activePage);
            
            if (activeIndex < paginationPages.length - 1) {
                // Переключаемся на следующую страницу
                paginationPages[activeIndex + 1].click();
            }
        });
    }
    
    // Функция для обновления состояния кнопок пагинации
    function updatePaginationButtons() {
        const activePage = document.querySelector('.pagination__page--active');
        const activeIndex = Array.from(paginationPages).indexOf(activePage);
        
        if (prevBtn) {
            prevBtn.disabled = activeIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = activeIndex === paginationPages.length - 1;
        }
    }
    
    // Инициализация начального состояния кнопок
    updatePaginationButtons();
}

/**
 * Инициализация анимации карточек
 */
function initCardAnimations() {
    // Добавляем анимацию при наведении на карточки
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        // Анимация тени и трансформации уже есть в CSS, но можно добавить дополнительные эффекты
        card.addEventListener('mouseenter', () => {
            // Например, можно анимировать кнопку
            const button = card.querySelector('.course-card__button');
            if (button) {
                button.style.backgroundColor = '#007f39'; // Темно-зеленый при наведении
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const button = card.querySelector('.course-card__button');
            if (button) {
                button.style.backgroundColor = ''; // Возвращаем стандартный цвет
            }
        });
    });
}

/**
 * Инициализация кнопки "Наверх"
 */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
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
}
```

## Дополнительные файлы

### SVG для пустого состояния поиска (images/empty-search.svg)

```svg
<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" fill="#f5f7fa"/>
    <circle cx="100" cy="100" r="70" stroke="#e5e7eb" stroke-width="2"/>
    <path d="M75 90C75 81.716 81.716 75 90 75H140C148.284 75 155 81.716 155 90V140C155 148.284 148.284 155 140 155H90C81.716 155 75 148.284 75 140V90Z" fill="white" stroke="#e5e7eb" stroke-width="2"/>
    <path d="M45 60C45 51.716 51.716 45 60 45H110C118.284 45 125 51.716 125 60V110C125 118.284 118.284 125 110 125H60C51.716 125 45 118.284 45 110V60Z" fill="white" stroke="#e5e7eb" stroke-width="2"/>
    <circle cx="85" cy="85" r="20" stroke="#00a34b" stroke-width="3"/>
    <line x1="100" y1="100" x2="115" y2="115" stroke="#00a34b" stroke-width="3" stroke-linecap="round"/>
    <line x1="75" y1="85" x2="95" y2="85" stroke="#00a34b" stroke-width="3" stroke-linecap="round"/>
    <path d="M130 130L140 140" stroke="#9c89b8" stroke-width="3" stroke-linecap="round"/>
    <path d="M130 140L140 130" stroke="#9c89b8" stroke-width="3" stroke-linecap="round"/>
</svg>