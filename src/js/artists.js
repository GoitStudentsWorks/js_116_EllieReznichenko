import { fetchArtists, limit, showToast } from './artists-api.js';
import spriteUrl from '/img/sprite.svg?url';

const refs = {
  artistCardsContainer: document.querySelector('#artists-grid'),
  loadMoreBtn: document.getElementById('load-more-btn'),
  loader: document.querySelector('.loader'), 
};

function createArtistCard({
  _id,
  strArtist,
  genres,
  strArtistThumb,
  strBiographyEN,
}) {
  const genreTags = (genres || [])
    .map(genre => `<li class="genre">${genre}</li>`)
    .join('');

  const shortBio =
    strBiographyEN?.length > 100
      ? strBiographyEN.slice(0, 100) + '...'
      : strBiographyEN || '';

  const imgSrc = strArtistThumb?.trim()
    ? strArtistThumb
    : '/img/artists/Placeholder_Image.jpg';

  return `
    <li class="artist-cards" data-id="${_id}">
      <img class="img" src="${imgSrc}" alt="${strArtist}" />
      <ul class="genres">${genreTags}</ul>
      <h3 class="artist-name">${strArtist}</h3>
      <p class="description">${shortBio}</p>
      <button class="learn-more" data-id="${_id}">
        Learn More
        <svg class="icon" width="24" height="24">
          <use href="${spriteUrl}#icon-caret-right-learn-more"></use>
        </svg>
      </button>
    </li>
  `;
}

let page = 1;

async function renderArtistsChunk() {
  refs.loadMoreBtn.style.display = 'none';
  refs.loader.style.display = 'flex';

  try {
    const data = await fetchArtists(page, limit);

    if (!data.artists || !Array.isArray(data.artists)) {
      throw new Error('Немає артистів у відповіді');
    }

    const markup = data.artists.map(createArtistCard).join('');
    refs.artistCardsContainer.insertAdjacentHTML('beforeend', markup);

    if (page * limit >= data.total) {
      refs.loadMoreBtn.style.display = 'none';
    } else {
      refs.loadMoreBtn.style.display = 'block';
    }

    page++;
  } catch (error) {
    console.error(error);
    showToast('Помилка завантаження артистів');
    refs.loadMoreBtn.style.display = 'none';
  } finally {
    refs.loader.style.display = 'none';
  }
}

refs.loadMoreBtn.addEventListener('click', renderArtistsChunk);

document.addEventListener('DOMContentLoaded', () => {
  renderArtistsChunk();
});
