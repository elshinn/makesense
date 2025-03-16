// Скрипт для страницы прохождения теста

document.addEventListener("DOMContentLoaded", () => {
    // Инициализация функциональности теста
    initTest();
});

/**
 * Инициализация теста
 */
function initTest() {
    // Скрываем прелоадер
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 500);
    }
    
    // Инициализация меню пользователя в шапке
    initUserMenu();
    
    // Инициализация данных теста
    initTestData();
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

// Данные для теста
const testData = {
    questions: [
        {
            id: 1,
            text: "В чем отличие между операторами == и === в JavaScript?",
            options: [
                { id: 1, text: "Оператор == сравнивает значения, а === сравнивает значения и типы данных" },
                { id: 2, text: "Операторы == и === делают одно и то же" },
                { id: 3, text: "Оператор === сравнивает значения, а == сравнивает значения и типы данных" },
                { id: 4, text: "Оператор == не существует в JavaScript" }
            ],
            correctOption: 1
        },
        {
            id: 2,
            text: "Какая функция используется для вывода сообщения в консоль браузера?",
            options: [
                { id: 1, text: "print()" },
                { id: 2, text: "console.log()" },
                { id: 3, text: "alert()" },
                { id: 4, text: "system.out.println()" }
            ],
            correctOption: 2
        },
        {
            id: 3,
            text: "Какой оператор используется для создания переменной в современном JavaScript?",
            options: [
                { id: 1, text: "var" },
                { id: 2, text: "int" },
                { id: 3, text: "const" },
                { id: 4, text: "string" }
            ],
            correctOption: 3
        },
        {
            id: 4,
            text: "Какая функция преобразует JSON строку в JavaScript объект?",
            options: [
                { id: 1, text: "JSON.parse()" },
                { id: 2, text: "JSON.stringify()" },
                { id: 3, text: "JSON.toObject()" },
                { id: 4, text: "JSON.convert()" }
            ],
            correctOption: 1
        },
        {
            id: 5,
            text: "Как объявить функцию в JavaScript?",
            options: [
                { id: 1, text: "function:myFunction() {}" },
                { id: 2, text: "function myFunction() {}" },
                { id: 3, text: "def myFunction() {}" },
                { id: 4, text: "func myFunction() {}" }
            ],
            correctOption: 2
        },
        {
            id: 6,
            text: "Какое свойство используется для определения количества элементов в массиве?",
            options: [
                { id: 1, text: "size" },
                { id: 2, text: "count" },
                { id: 3, text: "length" },
                { id: 4, text: "items" }
            ],
            correctOption: 3
        },
        {
            id: 7,
            text: "Как добавить элемент в конец массива в JavaScript?",
            options: [
                { id: 1, text: "arr.push(item)" },
                { id: 2, text: "arr.add(item)" },
                { id: 3, text: "arr.append(item)" },
                { id: 4, text: "arr.insert(item)" }
            ],
            correctOption: 1
        },
        {
            id: 8,
            text: "Как объявить переменную, значение которой нельзя изменить?",
            options: [
                { id: 1, text: "let x = 5;" },
                { id: 2, text: "var x = 5;" },
                { id: 3, text: "const x = 5;" },
                { id: 4, text: "static x = 5;" }
            ],
            correctOption: 3
        },
        {
            id: 9,
            text: "Как записать стрелочную функцию, которая принимает параметр и возвращает его удвоенное значение?",
            options: [
                { id: 1, text: "const double = (x) => { return x * 2; }" },
                { id: 2, text: "const double = x => x * 2;" },
                { id: 3, text: "function double(x) => x * 2;" },
                { id: 4, text: "const double = x -> x * 2;" }
            ],
            correctOption: 2
        },
        {
            id: 10,
            text: "Какой метод массива используется для создания нового массива, применяя функцию к каждому элементу?",
            options: [
                { id: 1, text: "forEach()" },
                { id: 2, text: "filter()" },
                { id: 3, text: "reduce()" },
                { id: 4, text: "map()" }
            ],
            correctOption: 4
        }
    ]
};

// Состояние теста
let testState = {
    currentQuestion: 1,
    answers: {},
    totalQuestions: 0
};

/**
 * Инициализация данных теста
 */
function initTestData() {
    // Загрузка сохраненного состояния из localStorage
    const savedState = localStorage.getItem('testState');
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            if (parsedState.answers && Object.keys(parsedState.answers).length > 0) {
                // Если в localStorage есть ответы, восстанавливаем состояние
                testState = parsedState;
            } else {
                // Если нет ответов, используем начальное состояние
                testState.totalQuestions = testData.questions.length;
            }
        } catch (e) {
            console.error('Failed to parse test state:', e);
            testState.totalQuestions = testData.questions.length;
        }
    } else {
        testState.totalQuestions = testData.questions.length;
    }
    
    // Обновляем информацию о количестве вопросов
    document.getElementById('totalQuestions').textContent = testState.totalQuestions;
    document.getElementById('currentQuestionNumber').textContent = testState.currentQuestion;
    
    // Создаем индикаторы вопросов
    createQuestionIndicators();
    
    // Загружаем первый вопрос
    loadQuestion(testState.currentQuestion);
    
    // Инициализация навигации по вопросам
    initNavigation();
    
    // Проверяем, можно ли активировать кнопку "Завершить тест"
    checkFinishButton();
}

/**
 * Создание индикаторов вопросов
 */
function createQuestionIndicators() {
    const indicatorsContainer = document.getElementById('questionIndicators');
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    
    for (let i = 1; i <= testState.totalQuestions; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'question-indicator';
        indicator.textContent = i;
        indicator.setAttribute('data-question', i);
        
        // Добавляем классы в зависимости от состояния
        if (i === testState.currentQuestion) {
            indicator.classList.add('active');
        }
        
        if (testState.answers[i] !== undefined) {
            indicator.classList.add('answered');
        }
        
        // Добавляем обработчик клика
        indicator.addEventListener('click', () => {
            navigateToQuestion(parseInt(indicator.getAttribute('data-question')));
        });
        
        indicatorsContainer.appendChild(indicator);
    }
}

/**
 * Загрузка вопроса по его номеру
 */
function loadQuestion(questionNumber) {
    const question = testData.questions[questionNumber - 1];
    if (!question) return;
    
    // Обновляем номер текущего вопроса
    document.getElementById('currentQuestionNumber').textContent = questionNumber;
    
    // Обновляем текст вопроса
    document.getElementById('questionText').textContent = question.text;
    
    // Обновляем варианты ответа
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';
    
    question.options.forEach(option => {
        const optionElement = document.createElement('label');
        optionElement.className = 'option';
        optionElement.setAttribute('for', `option_${option.id}`);
        
        // Если этот вариант был выбран ранее, добавляем класс selected
        if (testState.answers[questionNumber] === option.id) {
            optionElement.classList.add('selected');
        }
        
        optionElement.innerHTML = `
            <input type="radio" id="option_${option.id}" name="answer" value="${option.id}" ${testState.answers[questionNumber] === option.id ? 'checked' : ''}>
            <span class="option__radio"></span>
            <span class="option__text">${option.text}</span>
        `;
        
        optionsContainer.appendChild(optionElement);
        
        // Добавляем обработчик для выбора варианта
        const radioInput = optionElement.querySelector('input[type="radio"]');
        radioInput.addEventListener('change', () => {
            // Снимаем класс selected со всех опций
            const allOptions = optionsContainer.querySelectorAll('.option');
            allOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Добавляем класс selected к выбранной опции
            optionElement.classList.add('selected');
            
            // Сохраняем ответ
            saveAnswer(questionNumber, option.id);
        });
    });
    
    // Обновляем состояние кнопок
    updateNavigationButtons();
    
    // Обновляем индикаторы вопросов
    updateQuestionIndicators();
}

/**
 * Сохранение ответа на вопрос
 */
function saveAnswer(questionNumber, optionId) {
    testState.answers[questionNumber] = optionId;
    
    // Сохраняем состояние в localStorage
    localStorage.setItem('testState', JSON.stringify(testState));
    
    // Обновляем индикаторы вопросов
    updateQuestionIndicators();
    
    // Проверяем, можно ли активировать кнопку "Завершить тест"
    checkFinishButton();
}

/**
 * Обновление индикаторов вопросов
 */
function updateQuestionIndicators() {
    const indicators = document.querySelectorAll('.question-indicator');
    
    indicators.forEach(indicator => {
        const questionNum = parseInt(indicator.getAttribute('data-question'));
        
        // Снимаем все классы состояния
        indicator.classList.remove('active', 'answered');
        
        // Добавляем класс active для текущего вопроса
        if (questionNum === testState.currentQuestion) {
            indicator.classList.add('active');
        }
        
        // Добавляем класс answered, если на вопрос уже ответили
        if (testState.answers[questionNum] !== undefined) {
            indicator.classList.add('answered');
        }
    });
}

/**
 * Обновление кнопок навигации
 */
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Кнопка "Предыдущий" активна, если текущий вопрос не первый
    prevBtn.disabled = testState.currentQuestion === 1;
    
    // Кнопка "Следующий" активна, если текущий вопрос не последний
    nextBtn.disabled = testState.currentQuestion === testState.totalQuestions;
}

/**
 * Проверка возможности активации кнопки "Завершить тест"
 */
function checkFinishButton() {
    const finishBtn = document.getElementById('finishBtn');
    if (!finishBtn) return;
    
    // Кнопка активна, если на все вопросы даны ответы
    const answeredQuestions = Object.keys(testState.answers).length;
    finishBtn.disabled = answeredQuestions < testState.totalQuestions;
}

/**
 * Инициализация навигации по вопросам
 */
function initNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');
    
    // Обработчик для кнопки "Предыдущий"
    prevBtn.addEventListener('click', () => {
        if (testState.currentQuestion > 1) {
            navigateToQuestion(testState.currentQuestion - 1);
        }
    });
    
    // Обработчик для кнопки "Следующий"
    nextBtn.addEventListener('click', () => {
        if (testState.currentQuestion < testState.totalQuestions) {
            navigateToQuestion(testState.currentQuestion + 1);
        }
    });
    
    // Обработчик для кнопки "Завершить тест"
    finishBtn.addEventListener('click', () => {
        const confirmed = confirm('Вы уверены, что хотите завершить тест? После этого вы не сможете изменить свои ответы.');
        
        if (confirmed) {
            finishTest();
        }
    });
}

/**
 * Навигация к определенному вопросу
 */
function navigateToQuestion(questionNumber) {
    if (questionNumber < 1 || questionNumber > testState.totalQuestions) return;
    
    // Обновляем текущий вопрос
    testState.currentQuestion = questionNumber;
    
    // Сохраняем состояние
    localStorage.setItem('testState', JSON.stringify(testState));
    
    // Загружаем вопрос
    loadQuestion(questionNumber);
}

/**
 * Завершение теста и подсчет результатов
 */
function finishTest() {
    // Подсчитываем результаты
    const results = calculateResults();
    
    // Скрываем блок с тестом
    document.querySelector('.test-content').style.display = 'none';
    
    // Отображаем блок с результатами
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.style.display = 'block';
    
    // Обновляем информацию о результатах
    document.getElementById('correctAnswers').textContent = results.correctAnswers;
    document.getElementById('totalQuestionsResult').textContent = testState.totalQuestions;
    
    // Обновляем статус (пройден/не пройден)
    const resultStatus = document.getElementById('resultStatus');
    if (results.percentage >= 80) {
        resultStatus.textContent = 'Тест пройден';
        resultStatus.className = 'results-details__value results-details__value--success';
    } else {
        resultStatus.textContent = 'Тест не пройден';
        resultStatus.className = 'results-details__value results-details__value--error';
    }
    
    // Обновляем процент в круговой диаграмме
    document.getElementById('resultPercentage').textContent = `${results.percentage}%`;
    
    // Анимируем круговую диаграмму
    const circle = document.getElementById('resultCircle');
    const circumference = 2 * Math.PI * 90; // 2πr, где r=90 (из SVG)
    
    // Обратный offset для заполнения круга (0% - полностью заполнен, 100% - пустой)
    const offset = circumference - (results.percentage / 100) * circumference;
    
    // Применяем анимацию с задержкой для эффекта рисования
    setTimeout(() => {
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;
        
        // Устанавливаем цвет в зависимости от результата
        if (results.percentage >= 80) {
            circle.style.stroke = '#00a34b'; // Зеленый для успешного результата
        } else if (results.percentage >= 60) {
            circle.style.stroke = '#f59e0b'; // Оранжевый для среднего результата
        } else {
            circle.style.stroke = '#ef4444'; // Красный для низкого результата
        }
        
        // Добавляем анимацию
        circle.style.transition = 'stroke-dashoffset 1s ease-out';
    }, 500);
    
    // Очищаем состояние теста из localStorage
    localStorage.removeItem('testState');
}

/**
 * Расчет результатов теста
 */
function calculateResults() {
    let correctAnswers = 0;
    
    // Проверяем каждый ответ
    for (let questionId in testState.answers) {
        const question = testData.questions[parseInt(questionId) - 1];
        if (question && testState.answers[questionId] === question.correctOption) {
            correctAnswers++;
        }
    }
    
    // Рассчитываем процент правильных ответов
    const percentage = Math.round((correctAnswers / testState.totalQuestions) * 100);
    
    return {
        correctAnswers,
        percentage
    };
}
