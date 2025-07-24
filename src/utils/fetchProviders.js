export const fetchProviders = async (
  movieId,
  regionCode = "US",
  mediaType = "movie"
) => {
  try {
    let url;
    if (mediaType === "movie") {
      url = `http://localhost:3001/tmdb/providers/${movieId}`;
    } else {
      url = `http://localhost:3001/tmdb/providers-series/${movieId}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Failed to fetch backend providers api", response.status);
    }
    const initialData = await response.json();
    const regionData = initialData.results?.[regionCode];

    return regionData || {};
  } catch (error) {
    console.error("Error fetching providers", error);
  }
};
