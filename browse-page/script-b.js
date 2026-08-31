// Movies API: "http://www.omdbapi.com/?i=tt3896198&apikey=bcfa3d7f"

// Get DOM elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const movieList = document.getElementById("movie-list");
const loading = document.querySelector(".loading-state");
const success = document.querySelector(".success-state");

// Fetch movies from API
const fetchMovies = async (query) => {
  const apiKey = "bcfa3d7f";
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
  );
  const data = await response.json();
  return data.Search;
};

// Fetch movie details
const fetchMovieDetails = async (imdbID, key="s") => {
  const apiKey = "bcfa3d7f";
  const response = await fetch(
    `http://www.omdbapi.com/?apikey=${apiKey}&${key}=${imdbID}`
  );
  const data = await response.json();
  return data;
};

// Display fetched movies
const displayMovies = (movies) => {
  movieList.innerHTML = "";
  movies.forEach((movie) => {
    const movieCard = `
        <div class="movie movie-card">
            <div class="movie__img">
                <img src="${movie.Poster}" alt="${movie.Title} Poster" class="movie__img">
            </div>
            <div class="card-content">
               <span class="movie__title truncate" title="${movie.Title}" data-id="${movie.imdbID}">${movie.Title}</span>
               <p class="movie__year"><b>Year:</b> ${movie.Year}</p>
               <div class="details" data-id="${movie.imdbID}">
                <!-- Details will be dynamically added here -->
               </div>
               <button class="btn details-button" data-id="${movie.imdbID}">Details</button>
            </div>
        </div>
        `;
    movieList.innerHTML += movieCard;
  });


  // Add event listeners to all details buttons
  const detailsButtons = document.querySelectorAll(".details-button");
  detailsButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const imdbID = button.getAttribute("data-id");
      const detailsDiv = document.querySelector(
        `.details[data-id="${imdbID}"]`
        );
      const titleElement = document.querySelector(
        `.movie__title[data-id="${imdbID}"]`
        );

      // Fetch & display movie details
      const details = await fetchMovieDetails(imdbID, "i");
      detailsDiv.innerHTML = `
            <p class="detail"><b>Genre:</b> ${details.Genre}</p>
            <p class="detail"><b>Director:</b> ${details.Director}</p>
            <p class="detail"><b>Actors:</b> ${details.Actors}</p>
            <p class="detail"><b>Plot:</b> ${details.Plot}</p>
            `;

      // Show full movie title
      titleElement.textContent = details.Title;

      // Toggle details display
      detailsDiv.classList.toggle("open");
    });
  });
};

// Search movies
const searchMovies = async () => {
  const query = searchInput.value.trim();
  
  if (query.length > 1) {
    movieList.innerHTML = "";
    // Activate loading state
    loading.style.display = "block";
    success.style.display = "none";
    document.querySelectorAll(".movie").forEach((item) => (item.style.display = "none"));

    setTimeout(async () => {
    try {
    const movies = await fetchMovies(query);

    // Clear loading state
    loading.style.display = "none";
    // Activate success state
    if (movies) {
        success.style.display = "block";
      displayMovies(movies);
    } else {
      movieList.innerHTML = "<p>No movies found :(</p>";
    }
  } catch (error) {
    loading.style.display = "none";
    movieList.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    console.error(error);
  }
}, 2250);
  } else {
    loading.style.display = "none";
    success.style.display = "none";
    movieList.innerHTML = "<p>Not enough characters...</p>";
  }
};

// Event listeners for search button & input field
searchButton.addEventListener("click", searchMovies);
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchMovies();
  }
});

// Open/close side menu
function toggleMenu() {
    const phoneNav = document.getElementById("phoneNav");
    phoneNav.classList.toggle("active");
}