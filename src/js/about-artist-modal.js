import axios from 'axios';

const modal = document.querySelector('.modal');
const modalContent = modal.querySelector('.modal-content');
const loader = document.querySelector('.loader');

let youtubeListeners = [];

// Відкриття модалки
function openModal() {
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

// Закриття модалки і очищення слухачів
function closeModal() {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  modalContent.innerHTML = '';
  removeYoutubeListeners();
}

// Зняття слухачів з YouTube кнопок
function removeYoutubeListeners() {
  youtubeListeners.forEach(({ element, handler }) => {
    element.removeEventListener('click', handler);
  });
  youtubeListeners = [];
}

// Додавання слухачів на YouTube кнопки
function addYoutubeListeners() {
  const buttons = modalContent.querySelectorAll('.youtube-btn');
  buttons.forEach(button => {
    const handler = () => {
      const url = button.dataset.youtube;
      if (url) window.open(url, '_blank');
    };
    button.addEventListener('click', handler);
    youtubeListeners.push({ element: button, handler });
  });
}

// Рендер модального вікна виконавця
function renderArtistModal(artist) {
  const yearsInfo = artist.yearFormed
    ? artist.yearDisbanded
      ? `${artist.yearFormed} - ${artist.yearDisbanded}`
      : `${artist.yearFormed} - present`
    : 'information missing';

  const gender = artist.gender || 'information missing';
  const membersCount = artist.membersCount || 'information missing';
  const country = artist.country || 'information missing';
  const biography = artist.biography || 'information missing';
  const genres = artist.genres?.length
    ? artist.genres.join(', ')
    : 'information missing';
  const imageUrl = artist.imageUrl || '';

  const albumsHtml = artist.albums?.length
    ? artist.albums
        .map(album => {
          const tracksHeader = `
            <tr>
              <th>Назва композиції</th>
              <th>Тривалість</th>
              <th>Посилання</th>
            </tr>`;
          const tracksRows = album.tracks
            .map(track => {
              const youtubeBtn = track.youtubeUrl
                ? `<button class="youtube-btn" data-youtube="${track.youtubeUrl}">▶️</button>`
                : '';
              return `
                <tr>
                  <td>${track.title}</td>
                  <td>${track.duration}</td>
                  <td>${youtubeBtn}</td>
                </tr>`;
            })
            .join('');
          return `
            <div class="album">
              <h3>${album.title}</h3>
              <table>
                <thead>${tracksHeader}</thead>
                <tbody>${tracksRows}</tbody>
              </table>
            </div>`;
        })
        .join('')
    : '<p>Albums information missing</p>';

  modalContent.innerHTML = `
    <button class="button-close">Закрити</button>
    <h2>${artist.name}</h2>
    ${
      imageUrl
        ? `<img src="${imageUrl}" alt="${artist.name}" style="width: 576px; height: 354px;">`
        : ''
    }
    <p><strong>Роки існування:</strong> ${yearsInfo}</p>
    <p><strong>Стать:</strong> ${gender}</p>
    <p><strong>Кількість учасників:</strong> ${membersCount}</p>
    <p><strong>Країна походження:</strong> ${country}</p>
    <p><strong>Біографія:</strong> ${biography}</p>
    <p><strong>Жанри:</strong> ${genres}</p>
    <div class="albums">
      <h3>Альбоми</h3>
      ${albumsHtml}
    </div>`;

  // Закриття модалки по кнопці
  modalContent
    .querySelector('.button-close')
    .addEventListener('click', closeModal);

  // Додаємо слухачі на YouTube кнопки
  addYoutubeListeners();
}

// Функція завантаження артиста і відкриття модалки
async function fetchArtistAndOpenModal(id) {
  try {
    loader.style.display = 'block';
    modalContent.innerHTML = '';
    openModal();

    // Запит до API артиста
    const response = await axios.get(
      `https://sound-wave.b.goit.study/api/artists/${id}`
    );
    const artist = response.data;

    // Запит альбомів артиста
    const albumsRes = await axios.get(
      `https://sound-wave.b.goit.study/api/albums`
    );
    const allAlbums = albumsRes.data;
    artist.albums = allAlbums.filter(album => album.artistId === id);

    renderArtistModal(artist);
  } catch (error) {
    modalContent.innerHTML = '<p>Помилка завантаження даних</p>';
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
}

// Відкриття модалки по кліку на артиста
document.querySelector('.artist-list').addEventListener('click', e => {
  const card = e.target.closest('.artist-card');
  if (!card) return;
  const artistId = card.dataset.id;
  fetchArtistAndOpenModal(artistId);
});

// Закриття модалки по кліку на бекдроп
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// Закриття по Escape
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
