import starFilled from '/img/feedback/star-filled.png';
import starEmpty from '/img/feedback/star-empty.png';
import { sendFeedback } from '/js/artists-api';

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
  modal?.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.add('is-hidden');
      unlockBodyScroll();
    }
  });
  document.addEventListener('keydown', e => {
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

  form.addEventListener('submit', async e => {
    e.preventDefault(); 

    // Видаляємо старі помилки
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.classList.remove('input-error');
      const error = input.parentElement.querySelector('.error-text');
      if (error) error.remove();
    });

    let hasError = false;

    // Перевіряємо ім'я
    const nameInput = form.querySelector('#user-name');
    const nameValue = nameInput.value.trim();
    if (nameValue.length < 2 || nameValue.length > 16) {
      nameInput.classList.add('input-error');
      const errorMsg = document.createElement('div');
      errorMsg.classList.add('error-text');
      errorMsg.textContent = 'Please enter a valid name (2-16 characters)';
      nameInput.parentElement.appendChild(errorMsg);
      hasError = true;
    }

    // Перевіряємо повідомлення
    const messageInput = form.querySelector('#user-message');
    const messageValue = messageInput.value.trim();
    if (messageValue.length < 10 || messageValue.length > 512) {
      messageInput.classList.add('input-error');
      const errorMsg = document.createElement('div');
      errorMsg.classList.add('error-text');
      errorMsg.textContent = 'Please enter a message (10-512 characters)';
      messageInput.parentElement.appendChild(errorMsg);
      hasError = true;
    }

    // Перевіряємо рейтинг
    const oldError = starsContainer.querySelector('.error-text');
    if (oldError) oldError.remove();

    if (currentRating === 0) {
      starsContainer.classList.add('input-error');

      const errorMsg = document.createElement('div');
      errorMsg.classList.add('error-text');
      errorMsg.textContent = 'Please choose a rating';

      starsContainer.appendChild(errorMsg);

      hasError = true;
    } else {
      starsContainer.classList.remove('input-error');
    }

    if (hasError) {
      return;
    }

    try {
      await sendFeedback({
        name: nameValue,
        rating: currentRating,
        descr: messageValue,
      });

      // Якщо успішно — закриваємо модалку і розблокуємо скролл
      modal.classList.add('is-hidden');
      unlockBodyScroll();

      // Можна додати очищення форми, якщо треба
      form.reset();
      currentRating = 0;
      renderStars(currentRating);
    } catch (error) {
      alert('Помилка при відправці фідбеку. Спробуйте пізніше.');
      console.error(error);
    }
  });
});
