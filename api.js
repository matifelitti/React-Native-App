const URL = "https://ghibliapi.vercel.app";

export async function getMovies() {
  const url = `${URL}/films`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    return json.map((movie) => ({
      id: movie.id,
      title: movie.title,
      description: movie.description,
      image: movie.image,
      rating: movie.rt_score,
    }));
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
