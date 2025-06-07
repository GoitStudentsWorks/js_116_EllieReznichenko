import axios from 'axios';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import 'css-star-rating/css/star-rating.min.css';

// Округлення
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

// Отримання випадкових відгуків (на фронті, бо бек не підтримує limit/sort)
export const getRandomFeedbacks = async (count = 3) => {
  try {
    const response = await axios.get(
      'https://sound-wave.b.goit.study/api/feedbacks'
    );
    const all = response.data.data;

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

// Налаштування Swiper
document.addEventListener('DOMContentLoaded', () => {
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
    scrollbar: {
      el: '.swiper-scrollbar',
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
    slidesPerGroup: 1,
    slidesPerView: 1,
  });
});

// Генерація слайдів з даних
(async () => {
  try {
    const rawFeedbacks = await getRandomFeedbacks(3);
    console.log('RAW:', rawFeedbacks);
    const feedbacks = processFeedbacks(rawFeedbacks);

    const wrapper = document.querySelector('.swiper-wrapper');
    wrapper.innerHTML = '';
    feedbacks.forEach(fb => {
      const { name, descr, rating } = fb;

      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
          <div class="feedback-card">
            <div class="rating large star-icon direction-rtl value-${rating} half label-hidden">
   <div class="label-value">1.5</div>
    <div class="star-container">
        <div class="star">
            <i class="star-empty"></i>
            <i class="star-half"></i>
            <i class="star-filled"></i>
        </div>
        <div class="star">
            <i class="star-empty"></i>
            <i class="star-half"></i>
            <i class="star-filled"></i>
        </div>
        <div class="star">
            <i class="star-empty"></i>
            <i class="star-half"></i>
            <i class="star-filled"></i>
        </div>
        <div class="star">
            <i class="star-empty"></i>
            <i class="star-half"></i>
            <i class="star-filled"></i>
        </div>
        <div class="star">
            <i class="star-empty"></i>
            <i class="star-half"></i>
            <i class="star-filled"></i>
        </div>
    </div>
</div>
            <p class="feedback_description">${descr}</p>
            <h3 class="feedback_name">${name}</h3>
          </div>
        `;
      wrapper.appendChild(slide);
    });
  } catch (error) {
    console.error('Помилка під час обробки відгуків:', error);
  }
})();
