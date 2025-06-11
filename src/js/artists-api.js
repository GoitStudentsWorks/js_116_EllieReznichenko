import axios from 'axios';
export const API_BASE = 'https://sound-wave.b.goit.study/api';

export let currentPage = 1;
export const limit = 8;

export function showToast(message) {
  alert(message);
}

export async function fetchHeroArtists() {
  const res = await fetch(`${API_BASE}/artists`);
  if (!res.ok) throw new Error('Не вдалося завантажити артистів для hero');
  return await res.json(); // returns { artists: [...] }
}

export async function fetchArtists(page = 1, limit = 8) {
  const res = await fetch(`${API_BASE}/artists?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Не вдалося завантажити артистів');
  return await res.json();
}

// export async function fetchArtistById(id) {
//   const res = await fetch(`${API_BASE}/artists/${id}`);
//   if (!res.ok) throw new Error('Не вдалося завантажити деталі артиста');
//   return await res.json();
// }

// this one I changed
export async function fetchArtistById(id) {
  const res = await fetch(`${API_BASE}/artists/${id}`);
}

export async function renderArtists() {
  showLoader();
  // Показуємо індикатор завантаження

  try {
    const data = await fetchArtists(currentPage, limit);
    // Чекаємо відповіді від API, отримуємо дані артистів

    const cardsMarkup = data.artists.map(createCard).join('');
    // Для кожного артиста викликаємо createCard, отримуємо масив рядків HTML, об'єднуємо у єдиний рядок

    container.insertAdjacentHTML('beforeend', cardsMarkup);
    // Вставляємо нові картки в кінець контейнера

    if (currentPage * limit >= data.total) {
      loadMoreBtn.style.display = 'none';
      // Якщо завантажили всі артисти (поточна сторінка * ліміт >= загальна кількість), ховаємо кнопку "Load More"
    }
  } catch (error) {
    console.error(error);
    showToast('Помилка завантаження артистів. Спробуйте пізніше.');
  } finally {
    hideLoader();
    // При будь-якому результаті — ховаємо індикатор завантаження
  }
}

export const FEEDBACK_API = 'https://sound-wave.b.goit.study/api/feedbacks';

export async function fetchFeedbacks() {
  try {
    const res = await fetch(FEEDBACK_API);
    if (!res.ok) throw new Error('Failed to load feedbacks');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function fetchArtistsAlbumsById(artistId) {
  const res = await fetch(`${API_BASE}/artists/${artistId}/albums`);
  if (!res.ok) throw new Error('Не вдалося завантажити альбоми артиста');
  return await res.json();
}

export async function sendFeedback(feedbackData) {
  try {
    const response = await axios.post(FEEDBACK_API, feedbackData);
    return response.data;
  } catch (error) {
    console.error('Помилка при відправці фідбеку:', error);
    throw error;
  }

}
