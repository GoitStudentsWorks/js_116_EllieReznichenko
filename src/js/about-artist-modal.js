import axios from 'axios';

const modal = document.querySelector('.modal');
const modalContent = modal.querySelector('.modal-content');
const loader = document.querySelector('.loader');

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
  const genres = artist.genres?.length
    ? artist.genres.join(', ')
    : 'information missing';
  const imageUrl = artist.imageUrl || '';

  const albumsHtml = artist.albums?.length
    ? artist.albums
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
        .join('')
    : '<p>Albums information missing</p>';

  modalContent.innerHTML = `
    <button class="button-close" aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <h2 class="artist-mod-title">${artist.name}</h2>
    ${
      imageUrl
        ? `<img class="artist-image" src="${imageUrl}" alt="${artist.name}" style="width: 576px; height: 354px;">`
        : ''
    }
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
    // Мапінг артиста під ваш формат
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
      genres: artistRaw.genres || [],
      albums: [],
    };

    // Якщо є albumsList, беремо його, інакше allAlbums
    let albumsArray = [];
    if (artistRaw.albumsList && Array.isArray(artistRaw.albumsList)) {
      albumsArray = artistRaw.albumsList;
    } else {
      // Якщо API повертає allAlbums як масив
      const albumsRes = await axios.get(
        `https://sound-wave.b.goit.study/api/artists/${id}/albums`
      );
      const allAlbums = albumsRes.data;
      albumsArray = Array.isArray(allAlbums)
        ? allAlbums
        : allAlbums.albums || [];
    }

    // Мапінг альбомів під ваш формат
    artist.albums = albumsArray.map(album => ({
      title: album.strAlbum || album.title || 'No title',
      tracks: (album.tracks || []).map(track => ({
        title: track.strTrack || track.title || 'No title',
        duration: track.intDuration
          ? Math.floor(track.intDuration / 60000) +
            ':' +
            String(Math.floor((track.intDuration % 60000) / 1000)).padStart(
              2,
              '0'
            )
          : '',
        youtubeUrl: track.movie && track.movie !== 'null' ? track.movie : '',
      })),
    }));

    renderArtistModal(artist);
  } catch (error) {
    modalContent.innerHTML = '<p>Помилка завантаження даних</p>';
    console.error(error);
  } finally {
    // loader.style.display = 'none';
  }
}

// Замість .artist-list шукаємо .artists-grid (основний список артистів)
const artistList = document.querySelector('.artists-grid');
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
