import starFilled from '/img/feedback/star-filled.png';
import starEmpty from '/img/feedback/star-empty.png';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('[data-feedback-modal]');
  const openBtn = document.querySelector('[data-feedback-modal-open]');
  const closeBtn = document.querySelector('[data-feedback-modal-close]');
  const starsContainer = document.getElementById('feedback-star-rating');
  const form = modal.querySelector('.feedback-modal-form');

  function lockBodyScroll() {
    document.body.classList.add('body-lock');
  }
  function unlockBodyScroll() {
    document.body.classList.remove('body-lock');
  }

  openBtn?.addEventListener('click', () => {
    modal.classList.remove('is-hidden');
    lockBodyScroll();
  });
  closeBtn?.addEventListener('click', () => {
    modal.classList.add('is-hidden');
    unlockBodyScroll();
  });
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('is-hidden');
      unlockBodyScroll();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('is-hidden')) {
      modal.classList.add('is-hidden');
      unlockBodyScroll();
    }
  });

  let currentRating = 0;

  function renderStars(rating) {
    starsContainer.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('img');
      star.src = i <= rating ? starFilled : starEmpty;
      star.alt = `Star ${i}`;
      star.dataset.value = i;
      star.style.cursor = 'pointer';
      star.addEventListener('click', () => {
        currentRating = i;
        renderStars(currentRating);
      });
      starsContainer.appendChild(star);
    }
  }
  renderStars(0);

  // Отключаем встроенную валидацию, чтобы кастомная сработала без конфликтов
  form.setAttribute('novalidate', true);

  form.addEventListener('submit', (e) => {
    // Удаляем старые ошибки
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.classList.remove('input-error');
      const error = input.parentElement.querySelector('.error-text');
      if (error) error.remove();
    });

    let hasError = false;

    // Проверяем рейтинг
    if (currentRating === 0) {
      e.preventDefault();
      alert('Пожалуйста, выберите рейтинг звёзд.');
      hasError = true;
    }

    // Проверяем имя: не менее 2 символов
    const nameInput = form.querySelector('#user-name');
    const nameValue = nameInput.value.trim();
    if (nameValue.length < 2) {
      e.preventDefault();
      nameInput.classList.add('input-error');

      const errorMsg = document.createElement('div');
      errorMsg.classList.add('error-text');
      errorMsg.textContent = 'Please enter a valid name';
      nameInput.parentElement.appendChild(errorMsg);

      hasError = true;
    }

    // Проверяем сообщение (textarea) — не пустое
    const messageInput = form.querySelector('#user-message');
    if (messageInput.value.trim() === '') {
      e.preventDefault();
      messageInput.classList.add('input-error');

      const errorMsg = document.createElement('div');
      errorMsg.classList.add('error-text');
      errorMsg.textContent = 'Text error';
      messageInput.parentElement.appendChild(errorMsg);

      hasError = true;
    }

    if (hasError) {
      e.preventDefault();  // Гарантированно блокируем отправку
    }
  });
});