document.addEventListener('DOMContentLoaded', function() {
    // Элементы прогресс-баров
    const headerProgressBar = document.querySelector('#learning-progress-bar .progress-fill');
    const headerProgressValue = document.querySelector('#learning-progress-bar .progress-value');

    // Прогресс-бар в шапке: зависит от количества пройденных тестов
    function updateHeaderProgressBar() {
    const completedTestsCount = document.querySelectorAll('.order-card .order-status:not([textContent="В процессе"])').length;
    const maxTests = 50;
    const percentage = Math.round((completedTestsCount / maxTests) * 100);

    const bar = document.querySelector('#learning-progress-bar .learning-fill');
    const label = document.querySelector('#learning-progress-bar .learning-value');

    bar.style.width = percentage + '%';
    label.textContent = percentage + '%';

    const hue = 220;
    const saturation = 50 + (percentage / 2);
    const lightness = 50 + (percentage / 4);
    bar.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}



    // Прогресс-бар в резюме: зависит от заполненности формы (начинаем с 0%)
   function updateResumeProgressBar() {
    const sections = document.querySelectorAll('.resume-section');
    let filledSections = 0;

    sections.forEach(section => {
        const inputs = section.querySelectorAll('input, textarea');
        let sectionHasFilledInput = false;
        inputs.forEach(input => {
            if (input.value.trim() !== '') {
                sectionHasFilledInput = true;
            }
        });
        if (sectionHasFilledInput) filledSections++;
    });

    const percentage = Math.round((filledSections / sections.length) * 100);

    const bar = document.querySelector('#resume-progress-bar .resume-fill');
    const label = document.querySelector('#resume-progress-bar .resume-value');

    bar.style.width = percentage + '%';
    label.textContent = percentage + '%';

    const hue = 140;
    const saturation = 60 + (percentage / 3);
    const lightness = 50 + (percentage / 5);
    bar.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


   

    // Инициализация прогресс-баров при загрузке (начинаем с 0%)
    updateHeaderProgressBar();
    updateResumeProgressBar();

    // Обновление прогресс-бара резюме при вводе данных
    document.querySelectorAll('.resume-section input, .resume-section textarea').forEach(input => {
        input.addEventListener('input', updateResumeProgressBar);
    });

    // Логика переключения вкладок с динамической высотой и смещением
    const tabs = document.querySelectorAll('.resume-tab');
    const sections = document.querySelectorAll('.resume-section');
    const resumeContent = document.querySelector('.resume-content');
    const resumeOutput = document.querySelector('#resume-output');
    const profileSections = document.querySelectorAll('.profile-section');

    function adjustContentHeight() {
    const activeSection = document.querySelector('.resume-section.active');
    if (activeSection) {
        const sectionHeight = activeSection.scrollHeight + 60;
        resumeContent.style.height = `${sectionHeight}px`;
    } else {
        resumeContent.style.height = 'auto';
    }
}


    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);

            // Скрыть все секции и убрать активный класс у вкладок
            sections.forEach(section => section.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            // Показать выбранную секцию и выделить вкладку
            targetSection.classList.add('active');
            this.classList.add('active');
            resumeContent.classList.add('active');
            resumeOutput.classList.remove('active'); // Скрыть резюме, если оно открыто
            adjustContentHeight(); // Установить высоту и смещение
        });
    });

    // Закрытие контента при клике вне секции
    resumeContent.addEventListener('click', function(e) {
        if (e.target === resumeContent) {
            resumeContent.classList.remove('active');
            sections.forEach(section => section.classList.remove('active'));
            tabs.forEach(tab => tab.classList.remove('active'));
            resumeContent.style.height = 'auto'; // Сброс высоты при закрытии
        }
    });

    // Обработка кнопки "Назад"
    document.getElementById('back-btn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // Анимация при наведении на карточки
    document.querySelectorAll('.order-card, .settings-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.background = 'rgba(255, 255, 255, 0.4)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.background = 'transparent';
        });
    });

    // Добавление новых записей об образовании
    document.querySelector('.add-education').addEventListener('click', function() {
        const entry = document.querySelector('.education-entry').cloneNode(true);
        entry.querySelectorAll('input').forEach(input => input.value = '');
        document.querySelector('.education-entries').appendChild(entry);
        // Добавляем обработчик для новых полей
        entry.querySelectorAll('input').forEach(input => input.addEventListener('input', updateResumeProgressBar));
        adjustContentHeight(); // Обновить высоту и смещение при добавлении новых записей
    });

    // Добавление новых записей об опыте работы
    document.querySelector('.add-work').addEventListener('click', function() {
        const entry = document.querySelector('.work-experience-entry').cloneNode(true);
        entry.querySelectorAll('input, textarea').forEach(input => input.value = '');
        document.querySelector('.work-experience-entries').appendChild(entry);
        // Добавляем обработчик для новых полей
        entry.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', updateResumeProgressBar));
        adjustContentHeight(); // Обновить высоту и смещение при добавлении новых записей
    });

    // Формирование резюме
    document.querySelector('#generate-resume').addEventListener('click', function() {
        // Сбор личной информации
        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const phone = document.querySelector('#phone').value;
        const address = document.querySelector('#address').value;
        
        // Сбор данных об образовании
        const educationEntries = document.querySelectorAll('.education-entry');
        let educationHtml = '';
        educationEntries.forEach(entry => {
            const school = entry.querySelector('[name="school"]').value;
            const degree = entry.querySelector('[name="degree"]').value;
            const field = entry.querySelector('[name="field"]').value;
            const gradYear = entry.querySelector('[name="grad-year"]').value;
            if (school || degree || field || gradYear) {
                educationHtml += `<p><strong>${school}</strong> - ${degree} по специальности ${field}, ${gradYear}</p>`;
            }
        });
        
        // Сбор данных об опыте работы
        const workEntries = document.querySelectorAll('.work-experience-entry');
        let workHtml = '';
        workEntries.forEach(entry => {
            const company = entry.querySelector('[name="company"]').value;
            const position = entry.querySelector('[name="position"]').value;
            const startDate = entry.querySelector('[name="start-date"]').value;
            const endDate = entry.querySelector('[name="end-date"]').value;
            const description = entry.querySelector('[name="description"]').value;
            if (company || position || startDate || endDate || description) {
                workHtml += `<p><strong>${position}</strong> в ${company} (${startDate} - ${endDate})<br>${description}</p>`;
            }
        });
        
        // Сбор навыков
        const skills = document.querySelector('#skills').value;
        
        // Формирование HTML резюме
        const resumeHtml = `
            <h2>${name}</h2>
            <p>${email} | ${phone} | ${address}</p>
            <h3>Образование</h3>
            ${educationHtml}
            <h3>Опыт работы</h3>
            ${workHtml}
            <h3>Навыки</h3>
            <p>${skills}</p>
        `;
        
        // Отображение резюме
        document.querySelector('#resume-output').innerHTML = resumeHtml;
        document.querySelector('#resume-output').classList.add('active');
        document.querySelector('.resume-content').classList.remove('active'); // Закрыть форму, если открыта
        sections.forEach(section => section.classList.remove('active'));
        tabs.forEach(tab => tab.classList.remove('active'));
        adjustContentHeight(); // Сброс высоты и смещения
    });
});

// Модальное окно статистики
const modal = document.getElementById('stat-modal');
const modalContent = modal.querySelector('.stat-modal-content');
const modalTitle = modal.querySelector('.modal-title');
const modalDescription = modal.querySelector('.modal-description');
const modalClose = modal.querySelector('.modal-close');

document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', () => {
        const label = card.querySelector('.stat-label')?.textContent || 'Детали';
        const value = card.querySelector('.stat-value')?.textContent || '';
        const type = card.getAttribute('data-type');
        modalTitle.textContent = label;
        modalDescription.textContent = `Подробная информация по разделу "${label}". Значение: ${value}`;
        if (type) {
            modalContent.classList.add(`modal-${type}`);
        }
        modal.classList.add('show');
    });
});


modalClose.addEventListener('click', () => {
    modal.classList.remove('show');
});

modal.addEventListener('click', (e) => {
    if (!modalContent.contains(e.target)) {
        modal.classList.remove('show');
    }
});
// ===========================
// Тема: Авто, Переключение, Анимация
// ===========================
const themeToggle = document.getElementById('theme-toggle');

// Анимация темы
function animateThemeChange() {
    document.body.classList.add('theme-transition');
    setTimeout(() => {
        document.body.classList.remove('theme-transition');
    }, 300);
}

// Установка темы
function setTheme(theme, save = true) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    if (save) localStorage.setItem('theme', theme);
    animateThemeChange();
}

// Определение системной темы
function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Автоопределение по времени суток
function getTimeBasedTheme() {
    const hour = new Date().getHours();
    return (hour >= 7 && hour < 19) ? 'light' : 'dark';
}

// Применить при загрузке
const stored = localStorage.getItem('theme');
if (stored) {
    setTheme(stored, false);
} else {
    const autoTheme = getTimeBasedTheme(); // Или getSystemTheme()
    setTheme(autoTheme, false);
}

// Обработчик кнопки
themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('dark-theme') ? 'light' : 'dark';
    setTheme(newTheme);
});
