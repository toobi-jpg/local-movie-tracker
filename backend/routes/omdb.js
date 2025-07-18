/* eslint-disable */
const OMDB_KEY = process.env.OMDB_API_KEY;

async function fetchImdbRating(imdbId) {
  const url = `http://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Error fetching imdb rating for IMDb id:", imdbId);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching imdb rating via OMDb:", error);
  }
}

module.exports = {
  fetchImdbRating,
};
