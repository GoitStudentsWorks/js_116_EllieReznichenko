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

  let genresRaw =
    typeof artist.genres !== 'undefined'
      ? artist.genres
      : typeof artist.genre !== 'undefined'
      ? artist.genre
      : typeof artist.tags !== 'undefined'
      ? artist.tags
      : undefined;
  let genresArr = [];
  if (Array.isArray(genresRaw)) {
    if (
      genresRaw.length === 1 &&
      typeof genresRaw[0] === 'string' &&
      genresRaw[0].includes(',')
    ) {
      genresArr = genresRaw[0]
        .split(',')
        .map(g => g.trim())
        .filter(Boolean);
    } else {
      genresArr = genresRaw
        .flatMap(g =>
          typeof g === 'string' && g.includes(',')
            ? g.split(',').map(s => s.trim())
            : [typeof g === 'string' ? g.trim() : g]
        )
        .filter(Boolean);
    }
  } else if (typeof genresRaw === 'string') {
    genresArr = genresRaw
      .split(',')
      .map(g => g.trim())
      .filter(Boolean);
  }
  genresArr = Array.from(new Set(genresArr));
  console.log(
    'MODAL genresArr:',
    genresArr,
    'artist.genres:',
    artist.genres,
    'artist.genre:',
    artist.genre,
    'artist.tags:',
    artist.tags
  );
  const genres = genresArr.length
    ? genresArr.map(g => `<span class="genre">${g}</span>`).join(' ')
    : '<span class="genre">information missing</span>';

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
                ? `<a href="${track.youtubeUrl}" class="youtube-link" target="_blank" rel="noopener noreferrer" title="Open on YouTube">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.344 0 12 0 12s0 3.656.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.772 20.5 12 20.5 12 20.5s7.228 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.656 24 12 24 12s0-3.656-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>`
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
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">Add commentMore actions
          <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <div class="artist-main-info">
      <img class="artist-image" src="${imageUrl}" alt="${artist.name}">
      <div class="artist-info">
        <div class="artist-info-grid2">
          <div class="info-col">
            <div class="info-block">
              <span class="info-label">Years active</span>
              <span class="info-value">${yearsInfo}</span>
            </div>
            <div class="info-block">
              <span class="info-label">Members</span>
              <span class="info-value">${membersCount}</span>
            </div>
          </div>
          <div class="info-col">
            <div class="info-block">
              <span class="info-label">Sex</span>
              <span class="info-value">${gender}</span>
            </div>
            <div class="info-block">
              <span class="info-label">Country</span>
              <span class="info-value">${country}</span>
            </div>
          </div>
        </div>
        <p class="biography"><strong>Biography</strong> ${biography}</p>
        <div class="genres">
          <strong>Genres</strong> ${genres}
        </div>
      </div>
    </div>
    <div class="albums">
      <h3 class="title_album">Albums</h3>
      ${albumsHtml}
    </div>`;

  modalContent
    .querySelector('.button-close')
    .addEventListener('click', closeModal);

  addYoutubeListeners();
}

async function fetchArtistAndOpenModal(id) {
  try {
    loader.style.display = 'flex';
    modalContent.innerHTML = '';
    openModal();

    const response = await axios.get(
      `https://sound-wave.b.goit.study/api/artists/${id}`
    );
    const artistRaw = response.data;

    let responseGenres = await axios.get(
      `https://sound-wave.b.goit.study/api/artists`
    );
    const genres =
      responseGenres.data.artists.find(a => a._id === id)?.genres || [];
    if (!genres && typeof artistRaw.genres !== 'undefined') {
      genres = artistRaw.genres;
    }
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
      genres: genres.join(', ') || 'information missing',
      genre: artistRaw.genre,
      tags: artistRaw.tags,
      albums: [],
    };

    let albumsArray = [];
    if (artistRaw.albumsList && Array.isArray(artistRaw.albumsList)) {
      albumsArray = artistRaw.albumsList;
    } else {
      const albumsRes = await axios.get(
        `https://sound-wave.b.goit.study/api/artists/${id}/albums`
      );
      const allAlbums = albumsRes.data;
      console.log('allAlbums:', allAlbums);
      if (Array.isArray(allAlbums)) {
        albumsArray = allAlbums;
      } else if (allAlbums && Array.isArray(allAlbums.albums)) {
        albumsArray = allAlbums.albums;
      } else if (allAlbums && Array.isArray(allAlbums.albumsList)) {
        albumsArray = allAlbums.albumsList;
      } else if (allAlbums && Array.isArray(allAlbums.results)) {
        albumsArray = allAlbums.results;
      } else {
        console.warn('Unknown albums structure:', allAlbums);
        albumsArray = [];
      }
    }

    console.log('albumsArray:', albumsArray);
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

const artistList = document.querySelector('#artists-grid');
if (artistList) {
  artistList.addEventListener('click', e => {
    const btn = e.target.closest('.learn-more');
    if (!btn) return;
    const card = btn.closest('.artist-cards'); // виправлено на .artist-cards
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
