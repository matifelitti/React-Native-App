import { OMDB_API_KEY } from "@env";

const BASE_URL = "https://www.omdbapi.com";

export async function getMovies(page = 1) {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${OMDB_API_KEY}&s=Marvel&page=${page}&type=movie`,
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
      description: m.Plot !== "N/A" ? m.Plot : "No description available.",
      image: m.Poster !== "N/A" ? m.Poster : "https://via.placeholder.com",
      year: m.Year,
      rating: m.imdbRating,
    }));
  } catch (error) {
    console.error("Error in OMDb:", error);
    return [];
  }
}
