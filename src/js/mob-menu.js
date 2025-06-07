const burgerBtn = document.querySelector('[data-header-open]');
const mobileMenu = document.querySelector('[data-menu]');
const mobileCloseBtn = document.querySelector('[data-menu-close]');

burgerBtn.addEventListener('click', toggleMobileMenu);
mobileCloseBtn.addEventListener('click', toggleMobileMenu);

function toggleMobileMenu() {
  mobileMenu.classList.toggle('is-open');
}
