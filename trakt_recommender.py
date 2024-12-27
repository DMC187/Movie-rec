
import requests

# Replace with your Trakt API credentials
CLIENT_ID = "your_trakt_client_id"
CLIENT_SECRET = "your_trakt_client_secret"
REDIRECT_URI = "urn:ietf:wg:oauth:2.0:oob"

# OAuth2 authentication
def authenticate():
    print("Go to the following URL to authorize the app:")
    print(f"https://trakt.tv/oauth/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}")
    
    code = input("Enter the code provided by Trakt: ")
    response = requests.post(
        "https://api.trakt.tv/oauth/token",
        json={
            "code": code,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code",
        },
    )
    response.raise_for_status()
    return response.json()

# Fetch your history and ratings
def fetch_data(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": CLIENT_ID,
    }
    
    # Fetch history
    history = requests.get("https://api.trakt.tv/sync/history/movies", headers=headers).json()
    # Fetch ratings
    ratings = requests.get("https://api.trakt.tv/sync/ratings/movies", headers=headers).json()
    
    return history, ratings

# Recommend movies based on history and ratings
def recommend_movies(ratings):
    genres = {}
    for rating in ratings:
        movie = rating['movie']
        for genre in movie.get('genres', []):
            genres[genre] = genres.get(genre, 0) + 1
    
    favorite_genres = sorted(genres, key=genres.get, reverse=True)[:3]
    print(f"Your favorite genres: {', '.join(favorite_genres)}")
    
    print("Here are some recommendations:")
    for genre in favorite_genres:
        response = requests.get(
            f"https://api.trakt.tv/movies/popular?genres={genre}&limit=5",
            headers={
                "Content-Type": "application/json",
                "trakt-api-version": "2",
                "trakt-api-key": CLIENT_ID,
            },
        )
        movies = response.json()
        for movie in movies:
            print(f"{movie['title']} ({movie['year']})")

# Main workflow
def main():
    try:
        # Authenticate and fetch tokens
        tokens = authenticate()
        access_token = tokens['access_token']
        
        # Fetch data
        history, ratings = fetch_data(access_token)
        
        # Recommend movies
        recommend_movies(ratings)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
