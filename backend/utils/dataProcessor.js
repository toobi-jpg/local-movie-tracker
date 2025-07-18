/* eslint-disable */
const { scrapeMovieData } = require("../routes/scrape.js");
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

function parseSizeToInt(massText) {
  if (typeof massText !== "string" || !massText.includes("GiB")) {
    return Infinity;
  }
  const sizeParts = massText.split(" ");
  const sizeAsInt = parseInt(sizeParts[0]);
  return isNaN(sizeAsInt) ? Infinity : sizeAsInt;
}

function findBestMatchInResults(
  scrapedResults,
  normalizedMovieTitle,
  movieYear,
  movieReleaseDate
) {
  const mustInclude1 = process.env.FILTER_TITLE_MUST_INCLUDE_1;
  const mustInclude2 = process.env.FILTER_TITLE_MUST_INCLUDE_2;
  const mustExclude1 = process.env.FILTER_TITLE_MUST_EXCLUDE_1;
  const iconMustMatch = process.env.FILTER_ICON_MUST_MATCH;
  let bestMatch = null;

  for (const scrapedItem of scrapedResults) {
    const normalizedScrapedTitle = scrapedItem.title
      ? scrapedItem.title.toLowerCase().replace(/[\.\_]/g, " ")
      : "";

    const titleMatches =
      normalizedScrapedTitle.includes(normalizedMovieTitle) &&
      normalizedScrapedTitle.includes(movieYear.toString());

    const hasRequiredKeyword1 =
      !mustInclude1 || normalizedScrapedTitle.includes(mustInclude1);
    const hasRequiredKeyword2 =
      !mustInclude2 || normalizedScrapedTitle.includes(mustInclude2);
    const doesNotHaveExcludedKeyword =
      !mustExclude1 || !normalizedScrapedTitle.includes(mustExclude1);
    const hasMatchingIcon =
      !iconMustMatch || scrapedItem.icon === iconMustMatch;
    const uploadedIsAfterRelease =
      new Date(scrapedItem.uploadedDate) > movieReleaseDate;

    const yearRequirement = movieYear < 2020 || hasRequiredKeyword2;

    if (
      titleMatches &&
      hasRequiredKeyword1 &&
      hasMatchingIcon &&
      uploadedIsAfterRelease &&
      yearRequirement &&
      doesNotHaveExcludedKeyword
    ) {
      if (!bestMatch) {
        bestMatch = scrapedItem;
      } else {
        const currentBestMass = parseSizeToInt(bestMatch.massText);
        const newCandidateMass = parseSizeToInt(scrapedItem.massText);
        if (newCandidateMass < currentBestMass) {
          bestMatch = scrapedItem;
        }
      }
    }
  }
  return bestMatch;
}

async function fetchImages(movieId, storageData, movieIndex) {
  if (!TMDB_TOKEN) {
    console.warn("TMDB_TOKEN is not configured. Skipping image fetch.");
    return;
  }
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/images`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error("TMDb API Error fetching images:", response.status);
      return;
    }
    const imageData = await response.json();
    const backdrops = imageData.backdrops
      .slice(0, 3)
      .map((img) => img.file_path);
    const posters = imageData.posters.slice(0, 3).map((img) => img.file_path);
    storageData[movieIndex].images = { backdrops, posters };
    console.log(`🖼️  Image data prepared for movie ID: ${movieId}`);
  } catch (error) {
    console.error(
      `An error occurred while fetching images for movie ID ${movieId}:`,
      error
    );
  }
}

async function processAndSaveScrapedData(
  storageData,
  movieData,
  scrapedResults,
  io,
  appSettings
) {
  const { id, title, release_date, poster_path } = movieData;

  storageData.push({ id, title, release_date, poster_path });
  io.emit("storage:updated", storageData);

  const normalizedMovieTitle = title
    .toLowerCase()
    .replace("*", "")
    .replace(/[^a-z0-9\s]/g, "");
  const movieYear = new Date(release_date).getFullYear();
  const movieReleaseDateObj = new Date(release_date);

  console.log(`Performing first scrape analysis for "${title}"...`);
  let bestMatch = findBestMatchInResults(
    scrapedResults,
    normalizedMovieTitle,
    movieYear,
    movieReleaseDateObj
  );

  if (!bestMatch) {
    console.log(
      "No match found. Checking if movie is eligible for a re-scrape..."
    );
    const today = new Date();
    const threeMonthsAgo = new Date(today);
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    const threeMonthsFromNow = new Date(today);
    threeMonthsFromNow.setMonth(today.getMonth() + 3);

    const isRecent =
      movieReleaseDateObj >= threeMonthsAgo &&
      movieReleaseDateObj <= threeMonthsFromNow;

    const isOld = movieYear < 2020;

    if (isRecent || isOld) {
      console.log(
        `Movie is eligible for a re-scrape (isRecent: ${isRecent}, isOld: ${isOld}). Performing second scrape.`
      );
      const newScrapedResults = await scrapeMovieData(
        title,
        release_date,
        id,
        io
      );
      console.log(`Analyzing results from second scrape...`);
      bestMatch = findBestMatchInResults(
        newScrapedResults,
        normalizedMovieTitle,
        movieYear,
        movieReleaseDateObj
      );
    } else {
      console.log("Movie is not recent or old. Skipping re-scrape.");
    }
  }

  if (bestMatch) {
    console.log(`Success! Best match found: "${bestMatch.title}"`);
    const movieIndex = storageData.findIndex((movie) => movie.id === id);
    if (movieIndex !== -1) {
      storageData[movieIndex].scrapedDetails = bestMatch;
      await fetchImages(id, storageData, movieIndex);
    }
  } else {
    console.log(`No suitable match found for "${title}" after all attempts.`);
  }

  return storageData;
}

module.exports = {
  processAndSaveScrapedData,
  findBestMatchInResults,
};
