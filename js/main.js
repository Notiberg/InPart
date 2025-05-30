// Общие функции для обеих страниц
document.addEventListener('DOMContentLoaded', function() {
    // Подсветка активной вкладки в навигации
    const currentPage = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});

<script src="https://telegram.org/js/telegram-web-app.js"></script>