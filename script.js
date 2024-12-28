const API_URL = 'https://www.omdbapi.com/';
const API_KEY = 'your_omdb_api_key'; // Replace with your OMDb API key
let currentPage = 1;

async function fetchMovies(page) {
  const response = await fetch(`${API_URL}?s=movie&type=movie&page=${page}&apikey=${API_KEY}`);
  const data = await response.json();
  renderMovies(data.Search || []);
}

function renderMovies(movies) {
  const movieList = document.getElementById('movie-list');
  movieList.innerHTML = movies
    .map(
      movie => `
      <div class="movie-card">
        <img src="${movie.Poster}" alt="${movie.Title}">
        <h3>${movie.Title}</h3>
        <p>Year: ${movie.Year}</p>
        <div>
          <a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank">IMDb</a>
        </div>
      </div>
    `
    )
    .join('');
}

document.getElementById('prev').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchMovies(currentPage);
    updatePaginationButtons();
  }
});

document.getElementById('next').addEventListener('click', () => {
  currentPage++;
  fetchMovies(currentPage);
  updatePaginationButtons();
});

function updatePaginationButtons() {
  document.getElementById('prev').disabled = currentPage === 1;
}

fetchMovies(currentPage);