const refs = {
  artistCardsContainer: document.querySelector('.artists-grid'),
  modal: document.getElementById('artist-modal'),
  modalName: document.getElementById('modal-artist-name'),
  modalImage: document.getElementById('modal-artist-image'),
  modalGenres: document.getElementById('modal-artist-genres'),
  modalBio: document.getElementById('modal-artist-bio'),
  modalClose: document.getElementById('modal-close'),
  loadMoreBtn: document.getElementById('load-more-btn'),
};

const artists = [
  { id: '1', name: 'Ren',
     genres: ['Alternative', 'Pop', 'Rock', 'Indie'], 
     image: '/img/artists/Placeholder_Image.jpg', 
     bio: 'Ren Eryn Gill, known professionally as Ren, is a multi-award-winning...' },
  { id: '2', name: 'Unlike Pluto', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image1.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
  { id: '3', name: 'Sleepy Hallow', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image2.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
  { id: '4', name: 'Samara Cyn', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image3.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
  { id: '5', name: 'Oliver Tree', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image4.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
  { id: '6', name: 'Logic', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image5.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
  { id: '7', name: 'Mother Mother', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image6.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
  { id: '8', name: 'Livingston', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image7.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
  { id: '9', name: 'Sleepy Hallow', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image2.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
  { id: '10', name: 'Sleepy Hallow', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image2.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
  { id: '11', name: 'Sleepy Hallow', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image2.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
  { id: '12', name: 'Sleepy Hallow', genres: ['Alternative', 'Pop', 'Rock', 'Indie'], image: '/img/artists/Placeholder_Image2.jpg', bio: 'A look at the influential figures who shaped jazz music history.' },
];

let currentIndex = 0;
const artistsPerPage = 8;

function renderArtistsChunk() {
  const nextArtists = artists.slice(currentIndex, currentIndex + artistsPerPage);
  const markup = nextArtists
    .map(({ id, name, genres, image, bio }) => {
      const genreTags = genres.map(genre => `<span class="genre">${genre}</span>`).join('');
      const shortBio = bio.length > 100 ? bio.slice(0, 100) + '...' : bio;

      return `
        <li class="artist-card" data-id="${id}">
          <img src="${image}" alt="${name}" />
          <div class="genres">${genreTags}</div>
          <h3 class="artist-name">${name}</h3>
          <p class="description">${shortBio}</p>
          <button class="learn-more" data-id="${id}">
            Learn More
            <svg class="icon" width="24" height="24">
              <use href="/img/sprite.svg#icon-caret-right-learn-more"></use>
            </svg>
          </button>
        </li>
      `;
    })
    .join('');

  refs.artistCardsContainer.insertAdjacentHTML('beforeend', markup);
  currentIndex += artistsPerPage;

  if (currentIndex >= artists.length) {
    refs.loadMoreBtn.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderArtistsChunk();

  refs.loadMoreBtn.addEventListener('click', renderArtistsChunk);

  refs.artistCardsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.learn-more');
    if (!btn) return;

    const artistId = btn.dataset.id;
    const artist = artists.find(a => a.id === artistId);
    if (!artist) return;

    refs.modalName.textContent = artist.name;
    refs.modalImage.src = artist.image;
    refs.modalImage.alt = artist.name;
    refs.modalGenres.innerHTML = artist.genres.map(g => `<span class="genre">${g}</span>`).join('');
    refs.modalBio.textContent = artist.bio;
    refs.modal.classList.remove('hidden');
  });


  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !refs.modal.classList.contains('hidden')) {
      refs.modal.classList.add('hidden');
    }
  });
});
