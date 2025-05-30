// Ваш оригинальный код (без изменений)
const vacanciesMock = [
    {
        id: "VAC-2025-001",
        title: "Ведущий разработчик React",
        date: "20 мая 2025",
        salary: "250 000 ₽",
        category: "Разработчик",
        status: "Открыта",
        image: "https://via.placeholder.com/80",
    },
    {
        id: "VAC-2025-002",
        title: "Технолог производства",
        date: "18 мая 2025",
        salary: "180 000 ₽",
        category: "Технолог",
        status: "Открыта",
        image: "https://via.placeholder.com/80",
    },
    {
        id: "VAC-2025-003",
        title: "UI/UX Дизайнер",
        date: "15 мая 2025",
        salary: "200 000 ₽",
        category: "Дизайнер",
        status: "Закрыта",
        image: "https://via.placeholder.com/80",
    },
];

let currentFilters = { all: true, developer: false, technologist: false, designer: false };
let currentSearch = "";

// Рендеринг вакансий
function renderVacancies(vacanciesToRender) {
    const vacanciesList = document.getElementById("vacancies-list");
    vacanciesList.innerHTML = "";
    vacanciesToRender.forEach(vacancy => {
        const vacancyCard = document.createElement("div");
        vacancyCard.className = "vacancy-card";
        vacancyCard.innerHTML = `
            <div class="vacancy-header">
                <span class="vacancy-id">Вакансия #${vacancy.id}</span>
                <span class="vacancy-status status-${vacancy.status.toLowerCase()}">${vacancy.status}</span>
            </div>
            <div class="vacancy-content">
                <div class="vacancy-image">
                    <img src="${vacancy.image}" alt="${vacancy.title}">
                </div>
                <div class="vacancy-details">
                    <div class="vacancy-title">${vacancy.title}</div>
                    <div class="vacancy-date">${vacancy.date}</div>
                    <div class="vacancy-meta">
                        <span class="vacancy-salary">${vacancy.salary}</span>
                        <span class="vacancy-category">${vacancy.category}</span>
                    </div>
                </div>
            </div>
            <div class="vacancy-actions">
                <button class="action-btn apply">Откликнуться</button>
                <button class="action-btn details">Подробнее</button>
            </div>
        `;
        vacanciesList.appendChild(vacancyCard);
    });
}

// Обработка поиска
function handleSearch(query) {
    currentSearch = query.toLowerCase();
    applyFilters();
}

// Показ/скрытие контейнера фильтров
const filterBtn = document.querySelector('.filter-btn');
const filtersContainer = document.querySelector('.filters-container');

filterBtn.addEventListener('click', () => {
    // Проверяем текущее состояние display, учитывая начальное значение
    const isHidden = filtersContainer.style.display === 'none' || 
                    getComputedStyle(filtersContainer).display === 'none';
    filtersContainer.style.display = isHidden ? 'block' : 'none';
});

// Обработка выбора фильтров
const filterOptions = document.querySelectorAll('.filter-option');
const allFilter = document.querySelector('.filter-option[data-filter="all"]');
const otherFilters = document.querySelectorAll('.filter-option:not([data-filter="all"])');

// Применение фильтров
const applyFiltersBtn = document.querySelector('.apply-filters-btn');
applyFiltersBtn.addEventListener('click', () => {
    const selectedFilters = Array.from(filterOptions)
        .filter(option => option.classList.contains('active'))
        .map(option => option.getAttribute('data-filter'));
    console.log(`Применены фильтры: ${selectedFilters.length ? selectedFilters.join(', ') : 'none'}`);
    // Здесь можно добавить логику для фильтрации вакансий
    filtersContainer.style.display = 'none';
});

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
    renderVacancies(vacanciesMock);
});

document.addEventListener('DOMContentLoaded', () => {
    const allOption = document.querySelector('[data-filter="all"]');
    const otherOptions = document.querySelectorAll('.filter-option:not([data-filter="all"])');

    function updateUI() {
        document.querySelectorAll('.filter-option').forEach(option => {
            const input = option.querySelector('input');
            if (input.checked) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Обработка клика на фильтре "Все"
    allOption.addEventListener('click', () => {
        // Сбросить все остальные
        allOption.querySelector('input').checked = true;
        allOption.classList.add('active');
        otherOptions.forEach(option => {
            option.querySelector('input').checked = false;
            option.classList.remove('active');
        });
        updateUI();
    });

    // Обработка кликов на остальных фильтрах
    otherOptions.forEach(option => {
        option.addEventListener('click', () => {
            const input = option.querySelector('input');
            input.checked = !input.checked;

            // Деактивировать "Все"
            allOption.querySelector('input').checked = false;
            allOption.classList.remove('active');

            updateUI();
        });
    });

    updateUI();
});

// Новый функционал для работы с hh.ru API
let vacancies = vacanciesMock; // Изначально используем мок-данные

// Маппинг ролей hh.ru на ваши категории
const roleMapping = {
    "Программист, разработчик": "Разработчик",
    "Веб-инженер": "Разработчик",
    "Тестировщик": "Разработчик",
    "Инженер": "Технолог",
    "Технолог": "Технолог",
    "Дизайнер, художник": "Дизайнер",
    "Дизайнер интерфейсов": "Дизайнер",
    "default": "Разработчик"
};

// Функция для получения вакансий с hh.ru
async function fetchVacancies() {
    const vacanciesList = document.getElementById("vacancies-list");
    vacanciesList.innerHTML = '<div class="loading">Загрузка...</div>';
    
    try {
        const response = await fetch('https://api.hh.ru/vacancies?area=1&text=IT&per_page=20', {
            headers: {
                'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Замените на ваш токен
                'User-Agent': 'MyVacancyApp/1.0 (your.email@example.com)'
            }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        vacancies = data.items.map(item => ({
            id: item.id,
            title: item.name || "Без названия",
            date: item.published_at ? new Date(item.published_at).toLocaleDateString('ru-RU') : "Не указана",
            salary: item.salary ? 
                `${item.salary.from ? item.salary.from.toLocaleString() : 'Не указано'} ₽${item.salary.to ? ` - ${item.salary.to.toLocaleString()} ₽` : ''}` : 
                'По договоренности',
            category: roleMapping[item.professional_roles[0]?.name] || roleMapping.default,
            status: item.accept_temporary ? 'Открыта' : 'Закрыта',
            image: item.employer?.logo_urls?.['90'] || 'https://via.placeholder.com/80'
        }));
        applyFilters();
    } catch (error) {
        console.error('Error fetching vacancies:', error);
        vacanciesList.innerHTML = '<div class="loading">Ошибка загрузки вакансий. Используются тестовые данные.</div>';
        vacancies = vacanciesMock;
        applyFilters();
    }
}

// Обновленная функция применения фильтров
function applyFilters() {
    const selectedFilters = Array.from(filterOptions)
        .filter(option => option.classList.contains('active'))
        .map(option => option.getAttribute('data-filter'));

    let filtered = vacancies.filter(vacancy => 
        vacancy.title.toLowerCase().includes(currentSearch)
    );

    if (!selectedFilters.includes('all')) {
        filtered = filtered.filter(vacancy => 
            selectedFilters.includes(vacancy.category.toLowerCase())
        );
    }

    renderVacancies(filtered.length > 0 ? filtered : vacancies);
}

// Переопределение обработчика применения фильтров
applyFiltersBtn.addEventListener('click', () => {
    const selectedFilters = Array.from(filterOptions)
        .filter(option => option.classList.contains('active'))
        .map(option => option.getAttribute('data-filter'));
    console.log(`Применены фильтры: ${selectedFilters.length ? selectedFilters.join(', ') : 'none'}`);
    applyFilters();
    filtersContainer.style.display = 'none';
});

// Инициализация с подгрузкой данных из hh.ru
document.addEventListener("DOMContentLoaded", () => {
    fetchVacancies(); // Загружаем вакансии из hh.ru
});