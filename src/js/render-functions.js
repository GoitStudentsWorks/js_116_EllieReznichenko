import { refs } from './refs.js';

export function renderArtists(data) {
  const markup = data.artists
    .map(artist => {
      const { _id, strArtist, strBiographyEN, strArtistThumb, genres } = artist;
      return `
        <li class="artist-card" data-id="${_id}">
          <img class="artist-card-img" src="${strArtistThumb}" alt="${strArtist}" />
          <ul class="artist-card-genres">
            ${genres?.map(genre => `<li>${genre}</li>`).join('') || ''}
          </ul>
          <h3 class="artist-card-name">${strArtist}</h3>
          <p class="artist-card-info">
            ${strBiographyEN ? strBiographyEN.slice(0, 100) + '...' : 'No description available'}
          </p>
          <button class="artist-card-btn" type="button">
            Learn More
            <svg class="artist-card-icon" width="24" height="24">
              <use href="/img/sprite.svg#icon-caret-right-learn-more"></use>
            </svg>
          </button>
        </li>`;
    })
    .join('');

  refs.artistCardsContainer.insertAdjacentHTML('beforeend', markup);
}