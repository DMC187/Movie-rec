const TRAKT_CLIENT_ID = "f5347bc644ec7a0abfb0e5872255f90f901c396feee2ee9f52078fa77db97c30"; // Replace with your Trakt Client ID
const REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob"; // Replace with your live URL for production

// Log in button event listener
document.getElementById("login-btn").addEventListener("click", () => {
  console.log("Login button clicked");
  const authUrl = `https://trakt.tv/oauth/authorize?response_type=code&client_id=${TRAKT_CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  console.log("Redirecting to:", authUrl);
  window.location.href = authUrl; // Redirect to Trakt login page
});

// Check for authorization code in URL
if (window.location.search.includes("code=")) {
  console.log("Authorization code detected in URL");
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get("code");
  console.log("Auth code:", authCode);
  exchangeAuthCode(authCode);
}

// Function to exchange auth code for access token
async function exchangeAuthCode(authCode) {
  console.log("Exchanging authorization code...");
  const response = await fetch("https://api.trakt.tv/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: authCode,
      client_id: TRAKT_CLIENT_ID,
      client_secret: "your_trakt_client_secret", // Replace with your Trakt Client Secret
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log("Access token received:", data.access_token);
    fetchWatchedMovies(data.access_token);
  } else {
    console.error("Failed to exchange auth code:", response.statusText);
  }
}

// Function to fetch watched movies
async function fetchWatchedMovies(accessToken) {
  console.log("Fetching watched movies...");
  const response = await fetch("https://api.trakt.tv/sync/watched/movies", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "trakt-api-version": "2",
    },
  });

  if (response.ok) {
    const movies = await response.json();
    console.log("Watched movies:", movies);
    renderMovies(movies);
  } else {
    console.error("Failed to fetch watched movies:", response.statusText);
  }
}

// Function to render movies on the page
function renderMovies(movies) {
  const movieList = document.getElementById("movie-list");
  movieList.innerHTML = movies
    .map(
      (item) => `
      <div class="movie-card">
        <h3>${item.movie.title}</h3>
        <p>Year: ${item.movie.year}</p>
      </div>
    `
    )
    .join("");
}
