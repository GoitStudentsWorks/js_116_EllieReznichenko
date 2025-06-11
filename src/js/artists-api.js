import axios from 'axios';

export const API_BASE = 'https://sound-wave.b.goit.study/api';

export let currentPage = 1;
export const limit = 8;

export function showToast(message) {
  alert(message);
}

export async function fetchArtists(page = 1, limit = 8) {
  const res = await fetch(`${API_BASE}/artists?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error('Не вдалося завантажити артистів');
  return await res.json();
}

export async function fetchArtistById(id) {
  const res = await fetch(`${API_BASE}/artists/${id}`);
  if (!res.ok) throw new Error('Не вдалося завантажити деталі артиста');
  return await res.json();
}

export async function renderArtists() {
  showLoader();

  try {
    const data = await fetchArtists(currentPage, limit);
    const cardsMarkup = data.artists.map(createCard).join('');
    container.insertAdjacentHTML('beforeend', cardsMarkup);
    if (currentPage * limit >= data.total) {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error(error);
    showToast('⚠️ Помилка завантаження артистів. Спробуйте пізніше.');
  } finally {
    hideLoader();
  }
}

export const FEEDBACK_API = `${API_BASE}/feedbacks`;

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

export async function sendFeedback(feedbackData) {
  try {
    const response = await axios.post(FEEDBACK_API, feedbackData);
    showToast('🎉 Дякуємо за ваш відгук!');
    return response.data;
  } catch (error) {
    console.error('Помилка при відправці фідбеку:', error);
    throw error;
  }
}
