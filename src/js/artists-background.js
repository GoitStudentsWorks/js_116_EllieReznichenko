import { fetchArtists } from './artists-api.js';

const columnLeft = document.querySelector('.column-left');
const columnRight = document.querySelector('.column-right');

async function renderHeroBackground() {
  try {
    const data = await fetchArtists();
    const artists = data.artists;

    const repeatCount = 10;

    for (let i = 0; i < repeatCount; i++) {
      artists.forEach((artistRaw, index) => {
        const imageUrl =
          artistRaw.strArtistThumb?.trim() ||
          artistRaw.image?.trim() ||
          artistRaw.photoUrl?.trim() ||
          null;

        if (!imageUrl) return;

        const name = artistRaw.strArtist || artistRaw.name || 'Unknown Artist';

        if (!imageUrl) return; // skip if no image

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = name;
        img.classList.add('hero-img');

        if (index % 2 === 0) {
          columnLeft.appendChild(img.cloneNode(true));
        } else {
          columnRight.appendChild(img.cloneNode(true));
        }
      });
    }

    columnLeft.classList.add('animate-up');
    columnRight.classList.add('animate-down');
  } catch (error) {
    console.error('Error loading hero artists:', error);
  }
}

renderHeroBackground();
