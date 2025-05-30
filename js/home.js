document.addEventListener('DOMContentLoaded', function() {
    // Обработка переключения вкладок
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Функция для показа вкладки
    function showTab(tabId) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.style.display = 'none');
        
        const button = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        button.classList.add('active');
        document.getElementById(tabId).style.display = 'block';
    }

    // Показываем вкладку "Новости" по умолчанию
    showTab('news');

    // Обработчик кликов по кнопкам
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            showTab(tabId);
        });
    });

    // Обработка кликов по карточкам компаний
    const companyCards = document.querySelectorAll('.company-card');
    const modal = document.getElementById('companyModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');

    const companyData = {
        '3dp': {
            name: '3DPrintPro',
            description: 'Ведущий производитель 3D-принтеров в России. Специализируется на высокоточных решениях для промышленности.',
            collaboration: 'Сотрудничает с МГТУ им. Баумана, предоставляя оборудование для студенческих проектов.'
        },
        'fp': {
            name: 'FastPrint Studio',
            description: 'Студия быстрого прототипирования с акцентом на качество и скорость выполнения заказов.',
            collaboration: 'Партнер СПбГУ, проводит мастер-классы по 3D-печати для студентов.'
        },
        'tl': {
            name: 'TechFab Lab',
            description: 'Инновационная лаборатория, разрабатывающая решения для автоматизации производства.',
            collaboration: 'Работает с НИТУ МИСиС, поддерживая исследования в области аддитивных технологий.'
        }
    };

    companyCards.forEach(card => {
        card.addEventListener('click', () => {
            const companyId = card.getAttribute('data-company');
            const data = companyData[companyId];
            
            modalBody.innerHTML = `
                <h3>${data.name}</h3>
                <p><strong>О компании:</strong> ${data.description}</p>
                <p><strong>Коллаборация с вузом:</strong> ${data.collaboration}</p>
            `;
            modal.style.display = 'flex';
        });
    });

    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Закрытие модального окна при клике вне контента
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(button.dataset.tab).classList.add('active');
            });
        });

        // Histogram rendering (example data)
        const histogramData = [2, 4, 6, 8, 10, 3, 1]; // Example response counts
        const histogramSvg = document.querySelector('.histogram-svg');
        const barGroup = histogramSvg.querySelector('.histogram-bars');
        const barWidth = (histogramSvg.clientWidth - 16) / 7 - 2; // Adjust for 16px padding
        const maxHeight = 50;
        histogramData.forEach((value, index) => {
            const height = (value / Math.max(...histogramData)) * maxHeight;
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', index * (barWidth + 2));
            rect.setAttribute('y', maxHeight - height);
            rect.setAttribute('width', barWidth);
            rect.setAttribute('height', height);
            rect.setAttribute('fill', 'var(--primary-color)');
            barGroup.appendChild(rect);
        });
