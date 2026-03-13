import { API_KEY } from "@env";

const BASE_URL = "https://api.themoviedb.org";

export async function getMovies() {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    return json.results;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
