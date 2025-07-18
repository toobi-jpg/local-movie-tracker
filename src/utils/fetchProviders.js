export const fetchProviders = async (movieId, regionCode) => {
  try {
    const response = await fetch(
      `http://localhost:3001/tmdb/providers/${movieId}`
    );
    if (!response.ok) {
      console.log("Failed to fetch backend providers api", response.status);
    }
    const initialData = await response.json();
    const regionData = initialData.results[regionCode];

    return regionData || {};
  } catch (error) {
    console.error("Error fetching providers", error);
  }
};
