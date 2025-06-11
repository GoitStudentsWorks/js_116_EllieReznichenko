import starFilled from '/img/feedback/star-filled.png';
import starEmpty from '/img/feedback/star-empty.png';
import { sendFeedback } from '/js/artists-api';

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('[data-feedback-modal]');
  const openBtn = document.querySelector('[data-feedback-modal-open]');
  const closeBtn = document.querySelector('[data-feedback-modal-close]');
  const starsContainer = document.getElementById('feedback-star-rating');
  const form = modal?.querySelector('.feedback-modal-form');
  const notificationEl = document.querySelector('.feedback-modal-notification');

  if (!modal || !form || !starsContainer) return;

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

  modal.addEventListener('click', e => {
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
  form.setAttribute('novalidate', true);

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Очистка ошибок
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.classList.remove('input-error');
      const error = input.parentElement.querySelector('.error-text');
      if (error) error.remove();
    });

    const oldStarError = starsContainer.querySelector('.error-text');
    if (oldStarError) oldStarError.remove();
    starsContainer.classList.remove('input-error');

    let hasError = false;

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

    if (currentRating === 0) {
      starsContainer.classList.add('input-error');
      const errorMsg = document.createElement('div');
      errorMsg.classList.add('error-text');
      errorMsg.textContent = 'Please choose a rating';
      starsContainer.appendChild(errorMsg);
      hasError = true;
    }

    if (hasError) return;

    try {
      await sendFeedback({
        name: nameValue,
        rating: currentRating,
        descr: messageValue,
      });

      // Закрываем модалку
      modal.classList.add('is-hidden');
      unlockBodyScroll();

      // Сбрасываем форму и рейтинг
      form.reset();
      currentRating = 0;
      renderStars(currentRating);

      // Показываем уведомление с плавным появлением
      if (notificationEl) {
        notificationEl.textContent =
          'Your feedback has been received. The universe has heard you.';
        notificationEl.classList.add('is-visible');

        setTimeout(() => {
          notificationEl.classList.remove('is-visible');
        }, 3000);
      }
    } catch (error) {
      alert('Error sending feedback. Please try again later.');
      console.error(error);
    }
  });
});