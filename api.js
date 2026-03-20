import { OMDB_API_KEY } from "@env";
const BASE_URL = "https://www.omdbapi.com";

export async function getMovies(page = 1, query = "Marvel") {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${OMDB_API_KEY}&s=${query}&page=${page}&type=movie`,
    );
    const data = await response.json();

    if (data.Response === "False") return [];

    const detailedMovies = await Promise.all(
      data.Search.map(async (movie) => {
        const detailRes = await fetch(
          `${BASE_URL}?apikey=${OMDB_API_KEY}&i=${movie.imdbID}&plot=short`,
        );
        return detailRes.json();
      }),
    );

    return detailedMovies.map((m) => ({
      id: m.imdbID,
      title: m.Title,
      description: m.Plot,
      image: m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com",
      year: m.Year,
      rating: m.imdbRating,
      genre: m.Genre,
      director: m.Director,
    }));
  } catch (error) {
    return [];
  }
}
