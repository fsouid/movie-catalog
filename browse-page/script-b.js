// Movies API: "http://www.omdbapi.com/?i=tt3896198&apikey=bcfa3d7f"

// Get DOM elements
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const movieList = document.getElementById("movie-list");
const loading = document.querySelector(".loading-state");
const success = document.querySelector(".success-state");
const sortBy = document.getElementById("sort-by");
const resetBtn = document.getElementById("reset-filter");
const sortingBar = document.querySelector(".sorting-bar");

let currentMovies = []; // Store fetched movies
let originalMovies = []; // Store original fetched movies for reset

// Fetch movies from API
const fetchMovies = async (query) => {
  const apiKey = "bcfa3d7f";
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`
  );
  const data = await response.json();
  return data.Search || []; // Return an empty array if no movies found
};

// Fetch movie details
const fetchMovieDetails = async (imdbID, key="s") => {
  const apiKey = "bcfa3d7f";
  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${apiKey}&${key}=${imdbID}`
  );
  const data = await response.json();
  return data;
};

// Sort movies
const sortMovies = () => {
  if (!currentMovies || currentMovies.length === 0) return;

  const sortValue = sortBy.value;
  if (sortValue === "A-Z") {
    currentMovies.sort((a, b) => a.Title.localeCompare(b.Title));
  } else if (sortValue === "Z-A") {
    currentMovies.sort((a, b) => b.Title.localeCompare(a.Title));
  } else if (sortValue === "Newest First") {
    currentMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  } else if (sortValue === "Oldest First") {
    currentMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  }
  displayMovies(currentMovies);
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
    sortingBar.style.display = "none";
    document.querySelectorAll(".movie").forEach((item) => (item.style.display = "none"));

    setTimeout(async () => {
    try {
    const movies = await fetchMovies(query);

    // Clear loading state
    loading.style.display = "none";
    // Activate success state
    if (movies && movies.length > 0) {
      success.style.display = "block";
      sortingBar.style.display = "flex"; // Show sorting bar when movies are found
      originalMovies = [...movies]; // Store original movies
      currentMovies = [...movies]; // Copy original movies to currentMovies
      sortMovies(); // Sort and display movies based on the selected option
    } else {
      movieList.innerHTML = "<p>No movies found :(</p>";
      sortingBar.style.display = "none"; // Keep sorting bar hidden when no movies are found
    }
  } catch (error) {
    loading.style.display = "none";
    sortingBar.style.display = "none"; // Keep sorting bar hidden when an error occurs
    movieList.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    console.error(error);
  }
}, 2250);
  } else {
    loading.style.display = "none";
    success.style.display = "none";
    sortingBar.style.display = "none"; // Keep sorting bar hidden when input is invalid
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

// Event listener for sort dropdown
sortBy.addEventListener("change", sortMovies);

// Event listener for reset button
resetBtn.addEventListener("click", () => {
  sortBy.value = ""; // Reset sort dropdown
  if (originalMovies.length > 0) {
    currentMovies = [...originalMovies];
    displayMovies(currentMovies);
  }
});

// Open/close side menu
function toggleMenu() {
    const phoneNav = document.getElementById("phoneNav");
    phoneNav.classList.toggle("active");
}