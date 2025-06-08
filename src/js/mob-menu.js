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
//------ Закрытие меню и плавный скролл по клику на ссылку ---------
menuLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();

    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      mobileMenu.classList.remove('is-open');
      document.body.style.overflow = '';
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});