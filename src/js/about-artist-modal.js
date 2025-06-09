import axios from 'axios';

const modal = document.querySelector('.modal');
const modalContent = modal.querySelector('.modal-content');
const loader = document.querySelector('.loader');
if (!loader) {
  console.warn('Loader element not found in DOM!');
}

let youtubeListeners = [];

function openModal() {
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  modalContent.innerHTML = '';
  removeYoutubeListeners();
}

function removeYoutubeListeners() {
  youtubeListeners.forEach(({ element, handler }) => {
    element.removeEventListener('click', handler);
  });
  youtubeListeners = [];
}

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
  // genres: завжди масив, навіть якщо приходить рядком або undefined
  let genresArr = [];
  if (Array.isArray(artist.genres)) {
    genresArr = artist.genres.filter(Boolean);
  } else if (typeof artist.genres === 'string') {
    genresArr = artist.genres
      .split(',')
      .map(g => g.trim())
      .filter(Boolean);
  }
  const genres = genresArr.length
    ? genresArr.map(g => `<span class="genre">${g}</span>`).join(' ')
    : 'information missing';
  const imageUrl = artist.imageUrl || '';

  const albumsHtml = artist.albums?.length
    ? `<div class="albums-grid">${artist.albums
        .map(album => {
          const tracksHeader = `
            <tr>
              <th>Track</th>
              <th>Time</th>
              <th>Link</th>
            </tr>`;
          const tracksRows = album.tracks
            .map(track => {
              const youtubeLink = track.youtubeUrl
                ? `<a href="${track.youtubeUrl}" target="_blank" rel="noopener noreferrer">YouTube</a>`
                : '';
              return `
                <tr>
                  <td>${track.title}</td>
                  <td>${track.duration}</td>
                  <td>${youtubeLink}</td>
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
        .join('')}</div>`
    : '<p>Albums information missing</p>';

  modalContent.innerHTML = `
    <div class="modal-header">
      <h2 class="artist-mod-title">${artist.name}</h2>
      <button class="button-close" aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="artist-main-info">
      <img class="artist-image" src="${imageUrl}" alt="${artist.name}">
      <div class="artist-info">
        <p><strong>Years active</strong> ${yearsInfo}</p>
        <p><strong>Sex</strong> ${gender}</p>
        <p><strong>Members</strong> ${membersCount}</p>
        <p><strong>Country</strong> ${country}</p>
        <p class="biography"><strong>Biography</strong> ${biography}</p>
        <div class="genres">
          <strong>Genres</strong> ${genres}
        </div>
      </div>
    </div>
    <div class="albums">
      <h3>Albums</h3>
      ${albumsHtml}
    </div>`;

  modalContent
    .querySelector('.button-close')
    .addEventListener('click', closeModal);

  addYoutubeListeners();
}

async function fetchArtistAndOpenModal(id) {
  try {
    loader.style.display = 'block';
    modalContent.innerHTML = '';
    openModal();

    // Викликаємо API для артиста
    const response = await axios.get(
      `https://sound-wave.b.goit.study/api/artists/${id}`
    );
    const artistRaw = response.data;
    console.log(
      'MODAL artistRaw:',
      artistRaw,
      'id:',
      artistRaw._id,
      'name:',
      artistRaw.strArtist || artistRaw.name
    );
    console.log(
      'MODAL artistRaw.genres:',
      artistRaw.genres,
      'typeof:',
      typeof artistRaw.genres
    );
    // Формуємо genres для artist: якщо genres є масивом або рядком, беремо його, інакше пробуємо з artistRaw.genres
    let genres = artistRaw.genres;
    if (!genres && typeof artistRaw.genres !== 'undefined') {
      genres = artistRaw.genres;
    }
    console.log(
      'MODAL genres for artist:',
      genres,
      'typeof:',
      typeof genres,
      'id:',
      artistRaw._id,
      'name:',
      artistRaw.strArtist || artistRaw.name
    );
    // Якщо genres undefined, не чіпаємо (renderArtistModal покаже 'information missing')
    const artist = {
      name: artistRaw.strArtist || artistRaw.name || 'No name',
      imageUrl: artistRaw.strArtistThumb || artistRaw.image || '',
      yearFormed: artistRaw.intFormedYear || artistRaw.yearFormed || '',
      yearDisbanded:
        artistRaw.intDiedYear && artistRaw.intDiedYear !== 'null'
          ? artistRaw.intDiedYear
          : '',
      gender: artistRaw.strGender || artistRaw.gender || '',
      membersCount: artistRaw.intMembers || artistRaw.membersCount || '',
      country: artistRaw.strCountry || artistRaw.country || '',
      biography: artistRaw.strBiographyEN || artistRaw.bio || '',
      genres: genres,
      albums: [],
    };
    console.log(
      'MODAL artist.genres before modal:',
      artist.genres,
      'typeof:',
      typeof artist.genres,
      'id:',
      artistRaw._id,
      'name:',
      artistRaw.strArtist || artistRaw.name
    );

    // Якщо є albumsList, беремо його, інакше allAlbums
    let albumsArray = [];
    if (artistRaw.albumsList && Array.isArray(artistRaw.albumsList)) {
      albumsArray = artistRaw.albumsList;
    } else {
      // Якщо API повертає allAlbums як масив або об'єкт
      const albumsRes = await axios.get(
        `https://sound-wave.b.goit.study/api/artists/${id}/albums`
      );
      const allAlbums = albumsRes.data;
      console.log('allAlbums:', allAlbums); // Діагностика альбомів
      if (Array.isArray(allAlbums)) {
        albumsArray = allAlbums;
      } else if (allAlbums && Array.isArray(allAlbums.albums)) {
        albumsArray = allAlbums.albums;
      } else if (allAlbums && Array.isArray(allAlbums.albumsList)) {
        albumsArray = allAlbums.albumsList;
      } else if (allAlbums && Array.isArray(allAlbums.results)) {
        albumsArray = allAlbums.results;
      } else {
        // fallback: якщо структура інша, покажемо її у консолі
        console.warn('Unknown albums structure:', allAlbums);
        albumsArray = [];
      }
    }

    // Мапінг альбомів під ваш формат
    console.log('albumsArray:', albumsArray); // Діагностика
    artist.albums = albumsArray.map(album => ({
      title: album.strAlbum || album.title || 'No title',
      tracks: Array.isArray(album.tracks)
        ? album.tracks.map(track => ({
            title: track.strTrack || track.title || 'No title',
            duration: track.intDuration
              ? Math.floor(track.intDuration / 60000) +
                ':' +
                String(Math.floor((track.intDuration % 60000) / 1000)).padStart(
                  2,
                  '0'
                )
              : '',
            youtubeUrl:
              track.movie && track.movie !== 'null' ? track.movie : '',
          }))
        : [],
    }));

    renderArtistModal(artist);
  } catch (error) {
    modalContent.innerHTML = '<p>Помилка завантаження даних</p>';
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
}

// Замість .artist-list шукаємо .artists-grid (основний список артистів)
const artistList = document.querySelector('#artists-grid');
if (artistList) {
  artistList.addEventListener('click', e => {
    const btn = e.target.closest('.learn-more');
    if (!btn) return;
    const card = btn.closest('.artist-card');
    if (!card) return;
    const artistId = card.dataset.id;
    fetchArtistAndOpenModal(artistId);
  });
}

modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});
