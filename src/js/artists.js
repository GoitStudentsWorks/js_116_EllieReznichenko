import {
  fetchArtists,
  fetchArtistById,
} from './artists-api.js';
import { renderArtists } from './render-functions.js';
import { refs } from './refs.js';

let currentPage = 1;
const limit = 8;
let totalPages = null;

async function loadArtists() {
  try {
    refs.loader.style.visibility = 'visible';

    const data = await fetchArtists(currentPage, limit);

    renderArtists(data);

    totalPages = Math.ceil(data.total / limit);

    if (currentPage >= totalPages) {
      refs.loadMoreBtn.style.display = 'none';
    }

  } catch (error) {
    console.error('Failed to load artists:', error);
  } finally {
    refs.loader.style.visibility = 'hidden';
  }
}

refs.loadMoreBtn.addEventListener('click', () => {
  currentPage++;
  loadArtists().catch(error => console.error('Failed to load more artists:', error));
});

refs.artistCardsContainer.addEventListener('click', async e => {
  const button = e.target.closest('.artist-card-btn');
  if (!button) return;

  const card = button.closest('.artist-card');
  const artistId = card?.dataset?.id;

  if (!artistId) {
    console.warn('ID not found for artist card');
    return;
  }

  try {
    const artistData = await fetchArtistById(artistId);
    const albumsData = await fetchArtistsAlbumsById(artistId);

    openArtistModal({ artist: artistData, albums: albumsData });
  } catch (error) {
    console.error('Failed to open artist modal:', error);
  }
});

loadArtists();
