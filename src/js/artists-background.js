const columnLeft = document.querySelector('.column-left');
const columnRight = document.querySelector('.column-right');

fetch('https://sound-wave.b.goit.study/api/artist')
  .then(res => res.json())
  .then(data => {
    const artists = data;

    artists.forEach((artist, index) => {
      const img = document.createElement('img');
      img.src = artist.photoUrl;
      img.alt = artist.name;

      if (index % 2 === 0) {
        columnLeft.appendChild(img.cloneNode());
        columnLeft.appendChild(img.cloneNode());
      } else {
        columnRight.appendChild(img.cloneNode());
        columnRight.appendChild(img.cloneNode());
      }
    });
  })
  .catch(error => console.error('Error loading artists:', error));
