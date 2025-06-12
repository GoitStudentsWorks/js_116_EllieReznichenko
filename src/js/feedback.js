import starFilled from '/img/feedback/star-filled.png';
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

function processFeedbacks(rawFeedbacks) {
  return rawFeedbacks.map(fb => ({
    ...fb,
    roundedRating: roundRating(fb.rating),
  }));
}

function pickThreeMarkers(all) {
  if (all.length === 0) return [];

  const first = all[0];
  const last = all[all.length - 1];
  let middle = null;

  if (all.length > 2) {
    let i;
    do {
      i = Math.floor(Math.random() * all.length);
    } while (i === 0 || i === all.length - 1);
    middle = all[i];
  }

  return [first, middle, last].filter(Boolean);
}

(async () => {
  try {
    const swiper = new Swiper('.swiper', {
      direction: 'horizontal',
      loop: false,
      autoHeight: true,
      modules: [Navigation, Pagination],
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        renderBullet: (i, className) => {
          return i < 3 ? `<span class="${className}"></span>` : '';
        },
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      simulateTouch: true,
      grabCursor: true,
      keyboard: { enabled: true, pageUpDown: true, onlyInViewport: true },
      mousewheel: { eventsTarget: '.swiper' },
    });

    swiper.on('slideChange', function () {
      const bullets = document.querySelectorAll('.swiper-pagination-bullet');
      bullets.forEach(b =>
        b.classList.remove('swiper-pagination-bullet-active')
      );

      const activeIndex = swiper.realIndex % 3;
      if (bullets[activeIndex]) {
        bullets[activeIndex].classList.add('swiper-pagination-bullet-active');
      }
    });

    const raw = await fetchFeedbacks();
    const all = processFeedbacks(raw);

    const markers = pickThreeMarkers(all);
    const wrapper = document.querySelector('.swiper-wrapper');
    wrapper.innerHTML = '';

    all.forEach(fb => {
      const slide = document.createElement('div');
      slide.className = 'swiper-slide';
      slide.innerHTML = `
          <div class="feedback-card">
            <div class="rating" data-score="${fb.roundedRating}"></div>
            <p class="feedback_description">${fb.descr}</p>
            <h3 class="feedback_name">${fb.name}</h3>
          </div>
        `;
      wrapper.appendChild(slide);
    });

    document.querySelectorAll('.rating').forEach(el => {
      new Raty(el, {
        starOn: starFilled,
        starOff: starEmpty,
        score: parseInt(el.dataset.score, 10),
        readOnly: true,
      }).init();
    });
  } catch (error) {
    console.error('Ошибка при загрузке отзывов:', error);
  }
})();
