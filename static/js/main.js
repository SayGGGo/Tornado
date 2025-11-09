document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu-btn');
    const userButton = document.getElementById('user');
    const cartButton = document.getElementById('cart');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const logoContainer = document.querySelector('.logo-container');

    menuButton.addEventListener('click', () => {
        dropdownMenu.classList.toggle('active');
        menuButton.classList.toggle('activate');
    });

    logoContainer.addEventListener('click', () => {
        window.location.href = '/';
    });
    userButton.addEventListener('click', () => {
        window.location.href = '/profile';
    });
    cartButton.addEventListener('click', () => {
        window.location.href = '/cart';
    });

    document.addEventListener('click', (event) => {
        const isClickInsideMenu = dropdownMenu.contains(event.target);
        const isClickOnButton = menuButton.contains(event.target);
        const isButtonIcon = menuButton.querySelector('i').contains(event.target);

        if (!isClickInsideMenu && !isClickOnButton && !isButtonIcon && dropdownMenu.classList.contains('active')) {
            dropdownMenu.classList.remove('active');
            menuButton.classList.remove('activate');
        }
    });
});