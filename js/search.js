document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-btn');
    const resultsContainer = document.getElementById('results-container');
    const searchHistory = document.getElementById('search-history');
    const filterPanel = document.getElementById('filter-panel');
    const filterToggleBtn = document.querySelector('.filter-toggle-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Показ/скрытие панели фильтров
    filterToggleBtn.addEventListener('click', function() {
        const isVisible = filterPanel.style.display === 'block';
        filterPanel.style.display = isVisible ? 'none' : 'block';
        this.classList.toggle('active', !isVisible);
    });

    // Обработка ввода поиска
    searchInput.addEventListener('input', function() {
        if (this.value.length > 0) {
            clearBtn.style.display = 'block';
            if (this.value.length > 2) {
                resultsContainer.style.display = 'block';
                searchHistory.style.display = 'none';
                filterPanel.style.display = 'none';
                filterToggleBtn.classList.remove('active');
                applyFilters();
            }
        } else {
            clearBtn.style.display = 'none';
            resultsContainer.style.display = 'none';
            searchHistory.style.display = 'block';
            applyFilters();
        }
    });

    // Кнопка очистки
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        resultsContainer.style.display = 'none';
        searchHistory.style.display = 'block';
        filterPanel.style.display = 'none';
        filterToggleBtn.classList.remove('active');
        searchInput.focus();
        applyFilters();
    });

    // Фильтры поиска
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });

    // Применение фильтров
    function applyFilters() {
        const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const testItems = document.querySelectorAll('.result-item'); // Применяем ко всем .result-item (включая "Тесты" и "Рекомендуемые тесты")

        testItems.forEach(item => {
            const difficulty = item.dataset.difficulty || '';
            const theme = item.dataset.theme || '';
            const duration = item.dataset.duration || '';

            let shouldShow = true;

            if (activeFilter !== 'all') {
                if (activeFilter.includes('difficulty')) {
                    shouldShow = difficulty === activeFilter;
                } else if (activeFilter.includes('theme')) {
                    shouldShow = theme === activeFilter;
                } else if (activeFilter.includes('duration')) {
                    shouldShow = duration === activeFilter;
                }
            }

            item.style.display = shouldShow ? 'block' : 'none';
        });
    }

    // Клик по истории поиска
    const historyItems = document.querySelectorAll('.history-item');
    historyItems.forEach(item => {
        item.addEventListener('click', function() {
            searchInput.value = this.textContent;
            clearBtn.style.display = 'block';
            if (searchInput.value.length > 2) {
                resultsContainer.style.display = 'block';
                searchHistory.style.display = 'none';
                filterPanel.style.display = 'none';
                filterToggleBtn.classList.remove('active');
                applyFilters();
            }
        });
    });

    // Клик по популярным тегам
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            searchInput.value = this.textContent;
            clearBtn.style.display = 'block';
            if (searchInput.value.length > 2) {
                resultsContainer.style.display = 'block';
                searchHistory.style.display = 'none';
                filterPanel.style.display = 'none';
                filterToggleBtn.classList.remove('active');
                applyFilters();
            }
        });
    });

    // Кнопка "Назад"
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
});