import axios from 'axios';
import { fetchArtistById } from './artists-api.js';

const modal = document.querySelector('.modal');
const modalContent = modal.querySelector('.modal-content');
const loader = document.querySelector('.loader');
let youtubeListeners = [];

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
}

// Плавное открытие
function openModal() {
  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    modal.classList.add('is-open');
  });
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', handleEscapeKey);
}

// Плавное закрытие
function closeModal() {
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
  modalContent.innerHTML = '';
  removeYoutubeListeners();
  window.removeEventListener('keydown', handleEscapeKey);

  setTimeout(() => {
    modal.style.display = 'none';
  }, 100);
}

function removeYoutubeListeners() {
  youtubeListeners.forEach(({ element, handler }) => {
    element.removeEventListener('click', handler);
  });
  youtubeListeners = [];
}

function addYoutubeListeners() {
  modalContent.querySelectorAll('.youtube-link').forEach(link => {
    const handler = e => {
      e.preventDefault();
      window.open(link.href, '_blank');
    };
    link.addEventListener('click', handler);
    youtubeListeners.push({ element: link, handler });
  });
}

function getGenres(artist) {
  let genresRaw = artist.genres ?? artist.genre ?? artist.tags;
  if (!genresRaw) return ['information missing'];
  return Array.from(
    new Set(
      (Array.isArray(genresRaw) ? genresRaw : [genresRaw])
        .flatMap(g => g.split(','))
        .map(g => g.trim())
        .filter(Boolean)
    )
  );
}

function renderGenres(genresArr) {
  if (genresArr[0] === 'information missing') {
    return `<ul class="genre-list"><li class="genre">information missing</li></ul>`;
  }
  return `<ul class="genre-list">${genresArr.map(g => `<li class="genre">${g}</li>`).join('')}</ul>`;
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(Number(ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function renderTracks(tracks) {
  return tracks
    .map(
      track => `
      <tr class="artist-tr">
        <td>${track.title}</td>
        <td>${track.duration}</td>
        <td>${
          track.youtubeUrl
            ? `<a href="${track.youtubeUrl}" class="youtube-link" target="_blank" rel="noopener noreferrer" title="Open on YouTube">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.228 3.5 12 3.5 12 3.5s-7.228 0-9.386.566A2.994 2.994 0 0 0 .502 6.186C0 8.344 0 12 0 12s0 3.656.502 5.814a2.994 2.994 0 0 0 2.112 2.12C4.772 20.5 12 20.5 12 20.5s7.228 0 9.386-.566a2.994 2.994 0 0 0 2.112-2.12C24 15.656 24 12 24 12s0-3.656-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>`
            : ''
        }</td>
      </tr>`
    )
    .join('');
}

function renderAlbums(albums) {
  if (!albums?.length) return '<p>Albums information missing</p>';
  return `<div class="albums-grid">${albums
    .map(
      album => `
      <div class="album">
        <h3>${album.title}</h3>
        <table>
          <thead>
            <tr class="artist-tr">
              <th>Track</th>
              <th>Time</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>
            ${renderTracks(album.tracks)}
          </tbody>
        </table>
      </div>`
    )
    .join('')}</div>`;
}

function renderArtistModal(artist) {
  const yearsInfo = artist.yearFormed
    ? artist.yearDisbanded
      ? `${artist.yearFormed} - ${artist.yearDisbanded}`
      : `${artist.yearFormed} - present`
    : 'information missing';

  const genresArr = getGenres(artist);
  const genres = renderGenres(genresArr);
  const imageUrl = artist.imageUrl || '';
  const albumsHtml = renderAlbums(artist.albums);

  modalContent.innerHTML = `
    <div class="modal-header">
      <h2 class="artist-mod-title">${artist.name}</h2>
      <button class="button-close" aria-label="Close">
        <svg class="artist-modal-close-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div class="info-block"><span class="info-label">Years active</span><span class="info-value">${yearsInfo}</span></div>
            <div class="info-block"><span class="info-label">Members</span><span class="info-value">${
              artist.membersCount || 'information missing'
            }</span></div>
          </div>
          <div class="info-col">
            <div class="info-block"><span class="info-label">Sex</span><span class="info-value">${
              artist.gender || 'information missing'
            }</span></div>
            <div class="info-block"><span class="info-label">Country</span><span class="info-value">${
              artist.country || 'information missing'
            }</span></div>
          </div>
        </div>
        <strong>Biography</strong>
        <p class="biography">${artist.biography || 'information missing'}</p>
        <div class="genres genres-artist"><strong>Genres</strong> ${genres}</div>
      </div>
    </div>
    <div class="albums">
      <h3 class="title_album">Albums</h3>
      ${albumsHtml}
    </div>`;

  modalContent.querySelector('.button-close').addEventListener('click', closeModal);
  addYoutubeListeners();
}

async function fetchArtistAndOpenModal(id) {
  try {
    loader.style.display = 'flex';
    modalContent.innerHTML = '';
    openModal();

    const artistRaw = await fetchArtistById(id);

    const formatDuration = ms => {
      const totalSeconds = Math.floor(Number(ms) / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const albumsMap = {};
    if (Array.isArray(artistRaw.tracksList)) {
      artistRaw.tracksList.forEach(track => {
        const albumName = track.strAlbum || 'Unknown Album';
        if (!albumsMap[albumName]) albumsMap[albumName] = [];
        albumsMap[albumName].push(track);
      });
    }

    const albums = Object.entries(albumsMap).map(([albumTitle, tracks]) => ({
      title: albumTitle,
      tracks: tracks.map(track => {
        const youtubeUrl = typeof track.movie === 'string' && track.movie.includes('http')
          ? track.movie.split(' ')[0]
          : '';
        return {
          title: track.strTrack || 'No title',
          duration: track.intDuration ? formatDuration(track.intDuration) : '',
          youtubeUrl,
        };
      }),
    }));

    const artist = {
      name: artistRaw.strArtist || 'No name',
      imageUrl: artistRaw.strArtistThumb || '',
      yearFormed: artistRaw.intFormedYear || '',
      yearDisbanded:
        artistRaw.intDiedYear && artistRaw.intDiedYear !== 'null'
          ? artistRaw.intDiedYear
          : '',
      gender: artistRaw.strGender || '',
      membersCount: artistRaw.intMembers || '',
      country: artistRaw.strCountry || '',
      biography: artistRaw.strBiographyEN || '',
      genres: Array.isArray(artistRaw.genres) ? artistRaw.genres : [],
      albums,
    };

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
    const card = btn.closest('.artist-cards');
    if (!card) return;
    const artistId = card.dataset.id;
    fetchArtistAndOpenModal(artistId);
  });
}

modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});