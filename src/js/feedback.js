import starFilled from '/img/feedback//star-filled.png';
import starEmpty from '/img/feedback/star-empty.png';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import Raty from 'raty-js';

import { fetchFeedbacks } from './artists-api';

function roundRating(rating) {
  return Math.round(rating);
}

// Обробка відгуків
function processFeedbacks(rawFeedbacks) {
  return rawFeedbacks.map(fb => ({
    ...fb,
    roundedRating: roundRating(fb.rating),
  }));
}

// Отримання випадкових відгуків

const getRandomFeedbacks = async (count = 3) => {
  try {
    const all = await fetchFeedbacks();

    const random = [];
    const used = new Set();

    while (random.length < count && used.size < all.length) {
      const i = Math.floor(Math.random() * all.length);
      if (!used.has(i)) {
        used.add(i);
        random.push(all[i]);
      }
    }

    return random;
  } catch (error) {
    console.error('Не вдалося отримати відгуки:', error);
    return [];
  }
};

// Основна логіка
document.addEventListener('DOMContentLoaded', () => {
  (async () => {
    try {
      const rawFeedbacks = await getRandomFeedbacks(3);
      const feedbacks = processFeedbacks(rawFeedbacks);

      const wrapper = document.querySelector('.swiper-wrapper');
      wrapper.innerHTML = '';

      feedbacks.forEach((fb, index) => {
        const { name, descr, roundedRating } = fb;

        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
          <div class="feedback-card">
            <div class="rating" data-score="${roundedRating}"></div>
            <p class="feedback_description">${descr}</p>
            <h3 class="feedback_name">${name}</h3>
          </div>
        `;
        wrapper.appendChild(slide);
      });

      // Ініціалізація Swiper
      new Swiper('.swiper', {
        direction: 'horizontal',
        loop: false,
        modules: [Navigation, Pagination],
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        simulateTouch: true,
        grabCursor: true,
        keyboard: {
          enabled: true,
          pageUpDown: true,
          onlyInViewport: true,
        },
        mousewheel: {
          eventsTarget: '.swiper',
        },
      });

      // Ініціалізація Raty для кожного відгуку
      const ratingEls = document.querySelectorAll('.rating');
      ratingEls.forEach(el => {
        const score = parseInt(el.dataset.score, 10);
        const raty = new Raty(el, {
          starOn: starFilled,
          starOff: starEmpty,
          score: score,
          readOnly: true,
        });
        raty.init();
      });
    } catch (error) {
      console.error('Помилка під час обробки відгуків:', error);
    }
  })();
});
