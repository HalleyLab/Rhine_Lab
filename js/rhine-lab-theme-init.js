(function () {
    'use strict';
    const now = new Date();
    const dark = now.getHours() < 6 || now.getHours() >= 18;
    document.documentElement.classList.toggle('boot-dark-theme', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    const color = document.querySelector('meta[name="theme-color"]');
    if (color) color.setAttribute('content', dark ? '#1b2420' : '#f2f4ed');
}());
