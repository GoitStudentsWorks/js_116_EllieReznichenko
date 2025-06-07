const burgerBtn = document.querySelector('[data-header-open]');
const mobileMenu = document.querySelector('[data-menu]');
const mobileCloseBtn = document.querySelector('[data-menu-close]');

burgerBtn.addEventListener('click', toggleMobileMenu);
mobileCloseBtn.addEventListener('click', toggleMobileMenu);

function toggleMobileMenu() {
  mobileMenu.classList.toggle('is-open');
}

// -------------закриття через клавішу Esc--------------
document.addEventListener('keydown', closeMobileMenu);
function closeMobileMenu(e) {
  if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
    mobileMenu.classList.remove('is-open');
  }
}
