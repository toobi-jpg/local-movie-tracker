/* eslint-disable */
const { scrapeMovieData } = require("../routes/scrape.js");
const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

function parseMassToInt(massText) {
  const MassIncludes = process.env.MASS_INCLUDES;
  const MassIncludes2 = process.env.MASS_INCLUDES_2;

  if (typeof massText !== "string") return Infinity;
  const massValue = parseFloat(massText.replace(/,/g, ""));
  if (isNaN(massValue)) return Infinity;

  if (MassIncludes && massText.includes(MassIncludes)) {
    return massValue * 1024;
  }

  if (MassIncludes2 && massText.includes(MassIncludes2)) {
    return massValue;
  }

  return Infinity;
}

function getScoreFromTitle(title) {
  const lowerCaseTitle = title.toLowerCase();
  const keywordsString = process.env.FILTER_SCORING_KEYWORDS || "";
  const scoringKeywords = keywordsString.split(",").map((pair) => {
    const [keyword, score] = pair.split(":");
    return { keyword: keyword.trim(), score: parseInt(score, 10) };
  });

  for (const { keyword, score } of scoringKeywords) {
    if (keyword && lowerCaseTitle.includes(keyword)) {
      return score;
    }
  }
  return 0;
}

function findBestCandidate(candidates) {
  if (!candidates || candidates.length === 0) {
    return null;
  }
  candidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return b.popularity - a.popularity;
  });
  return candidates[0];
}

function isMatch(item, rules, baseInfo) {
  const { normalizedMovieTitle, movieYear, movieReleaseDate } = baseInfo;
  const normalizedScrapedTitle = item.title
    ? item.title.toLowerCase().replace(/[\.\_]/g, " ")
    : "";
  const doDebug = process.env.DEBUG_FILTERING === "true";

  const reject = (reason) => {
    if (doDebug) {
      console.log(`[Debug] Rejected: "${item.title}" (Reason: ${reason})`);
    }
    return false;
  };

  if (!normalizedScrapedTitle.includes(normalizedMovieTitle))
    return reject(`Title mismatch. Expected to find "${normalizedMovieTitle}"`);
  if (!normalizedScrapedTitle.includes(movieYear.toString()))
    return reject(`Year mismatch. Expected to find "${movieYear}"`);
  if (new Date(item.uploadedDate) < movieReleaseDate)
    return reject(
      `Uploaded too early. Uploaded: ${item.uploadedDate}, Released: ${
        movieReleaseDate.toISOString().split("T")[0]
      }`
    );

  if (rules.mustInclude && !normalizedScrapedTitle.includes(rules.mustInclude))
    return reject(`Missing keyword. Expected "${rules.mustInclude}"`);
  if (rules.mustExclude && normalizedScrapedTitle.includes(rules.mustExclude))
    return reject(`Contains excluded keyword "${rules.mustExclude}"`);
  if (rules.minPopularity && item.popularity < rules.minPopularity)
    return reject(
      `Popularity too low. Has ${item.popularity}, needs ${rules.minPopularity}`
    );
  if (rules.allowedIcons && !rules.allowedIcons.includes(item.icon))
    return reject(
      `Icon not allowed. Has "${
        item.icon
      }", needs one of "${rules.allowedIcons.join(",")}"`
    );
  if (rules.iconMustMatch && item.icon !== rules.iconMustMatch)
    return reject(
      `Icon mismatch. Has "${item.icon}", needs "${rules.iconMustMatch}"`
    );
  if (
    rules.preferredSource &&
    !normalizedScrapedTitle.includes(rules.preferredSource)
  )
    return reject(
      `Missing preferred source keyword "${rules.preferredSource}"`
    );

  const exclude1 = process.env.FILTER_GLOBAL_EXCLUDE_1;
  const exclude2 = process.env.FILTER_GLOBAL_EXCLUDE_2;
  if (exclude1 && normalizedScrapedTitle.includes(exclude1))
    return reject(`Contains global excluded keyword "${exclude1}"`);
  if (exclude2 && normalizedScrapedTitle.includes(exclude2))
    return reject(`Contains global excluded keyword "${exclude2}"`);

  return true;
}

function findBestHighMatch(scrapedResults, baseInfo) {
  const t1_rules = {
    mustInclude: process.env.FILTER_HIGH_T1_MUST_INCLUDE,
    minPopularity: parseInt(process.env.FILTER_HIGH_T1_MIN_POPULARITY, 10),
    allowedIcons: (process.env.FILTER_HIGH_T1_ALLOWED_ICONS || "").split(","),
  };
  const tier1Matches = scrapedResults.filter((item) =>
    isMatch(item, t1_rules, baseInfo)
  );
  if (tier1Matches.length > 0) {
    console.log(`Found ${tier1Matches.length} Tier-1 HIGH match(es).`);
    return tier1Matches.sort((a, b) => {
      const massA = parseMassToInt(a.massText);
      const massB = parseMassToInt(b.massText);
      return massA - massB;
    })[0];
  }

  const t2_rules = {
    mustInclude: process.env.FILTER_HIGH_T2_MUST_INCLUDE,
    mustExclude: process.env.FILTER_HIGH_T2_MUST_EXCLUDE,
    allowedIcons: (process.env.FILTER_HIGH_T1_ALLOWED_ICONS || "").split(","),
    minPopularity: parseInt(process.env.FILTER_HIGH_T1_MIN_POPULARITY, 10),
  };
  const tier2Matches = scrapedResults.filter((item) =>
    isMatch(item, t2_rules, baseInfo)
  );
  if (tier2Matches.length > 0) {
    console.log(`Found ${tier2Matches.length} Tier-2 HIGH match(es).`);
    return tier2Matches.sort((a, b) => {
      const massA = parseMassToInt(a.massText);
      const massB = parseMassToInt(b.massText);
      return massA - massB;
    })[0];
  }

  return null;
}

function findBestLowMatch(scrapedResults, baseInfo) {
  const rules = {
    mustInclude: process.env.FILTER_LOW_MUST_INCLUDE,
    preferredSource: process.env.FILTER_LOW_PREFERRED_SOURCE,
    iconMustMatch: process.env.FILTER_LOW_ICON_MUST_MATCH,
    maxMass: parseFloat(process.env.FILTER_LOW_MAX_MASS),
    minPopSmall: parseInt(
      process.env.FILTER_LOW_MIN_POPULARITY_SMALL_RELEASE,
      10
    ),
    minPopLarge: parseInt(
      process.env.FILTER_LOW_MIN_POPULARITY_LARGE_RELEASE,
      10
    ),
    sourceMustInclude: process.env.FILTER_LOW_SOURCE_MUST_INCLUDE,
    sourceMinPop: parseInt(process.env.FILTER_LOW_SOURCE_MIN_POPULARITY, 10),
    sourceProviders: (
      process.env.FILTER_LOW_SOURCE_ALLOWED_PROVIDERS || ""
    ).split(","),
  };

  const { normalizedMovieTitle, movieYear, movieReleaseDate } = baseInfo;
  const exclude1 = process.env.FILTER_GLOBAL_EXCLUDE_1;
  const exclude2 = process.env.FILTER_GLOBAL_EXCLUDE_2;

  const candidates = [];

  for (const item of scrapedResults) {
    const normalizedScrapedTitle = item.title
      ? item.title.toLowerCase().replace(/[\.\_]/g, " ")
      : "";

    if (!normalizedScrapedTitle.includes(normalizedMovieTitle)) continue;
    if (!normalizedScrapedTitle.includes(movieYear.toString())) continue;
    if (new Date(item.uploadedDate) < movieReleaseDate) continue;
    if (
      rules.mustInclude &&
      !normalizedScrapedTitle.includes(rules.mustInclude)
    )
      continue;
    if (
      rules.preferredSource &&
      !normalizedScrapedTitle.includes(rules.preferredSource)
    )
      continue;
    if (rules.iconMustMatch && item.icon !== rules.iconMustMatch) continue;
    if (exclude1 && normalizedScrapedTitle.includes(exclude1)) continue;
    if (exclude2 && normalizedScrapedTitle.includes(exclude2)) continue;

    const itemMass = parseMassToInt(item.massText) / 1024;

    const isSmallAndPopular =
      itemMass < rules.maxMass && item.popularity >= rules.minPopSmall;
    const isVeryPopular = item.popularity >= rules.minPopLarge;

    const isTrustedSource =
      rules.sourceMustInclude &&
      normalizedScrapedTitle.includes(rules.sourceMustInclude) &&
      item.popularity >= rules.sourceMinPop &&
      rules.sourceProviders.includes(item.provider);

    if (isSmallAndPopular || isVeryPopular || isTrustedSource) {
      candidates.push(item);
    }
  }

  if (candidates.length > 0) {
    console.log(`Found ${candidates.length} LOW match(es) to evaluate.`);
    const scoredCandidates = candidates.map((item) => {
      item.score = getScoreFromTitle(item.title);
      return item;
    });
    return findBestCandidate(scoredCandidates);
  }

  return null;
}

async function fetchImages(movieId, storageData, movieIndex) {
  if (!TMDB_TOKEN) return;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/images`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      }
    );
    if (!response.ok) return;
    const imageData = await response.json();
    storageData[movieIndex].images = {
      backdrops: imageData.backdrops.slice(0, 3).map((img) => img.file_path),
      posters: imageData.posters.slice(0, 3).map((img) => img.file_path),
    };
  } catch (error) {
    console.error(`Error fetching images for movie ID ${movieId}:`, error);
  }
}

async function processAndSaveScrapedData(storageData, movieData, io) {
  const { id, title, release_date } = movieData;

  const normalizedMovieTitle = title
    .toLowerCase()
    .replace("*", "")
    .replace(/[^a-z0-9\s]/g, "");
  const movieYear = new Date(release_date).getFullYear();
  const baseInfo = {
    normalizedMovieTitle,
    movieYear,
    movieReleaseDate: new Date(release_date),
  };

  let bestMatch = null;

  const highSearchTerm = `${title} ${movieYear} ${
    process.env.SEARCH_TERM_HIGH || ""
  }`.trim();
  const highResults = await scrapeMovieData(highSearchTerm, id, io);
  if (highResults.length > 0) {
    bestMatch = findBestHighMatch(highResults, baseInfo);
    if (bestMatch) {
      bestMatch.sourceType = "HIGH";
    }
  }

  if (!bestMatch) {
    console.log("No suitable HIGH match found. Falling back to LOW search...");
    const lowSearchTerm = `${title} ${movieYear}`;
    const lowResults = await scrapeMovieData(lowSearchTerm, id, io);
    if (lowResults.length > 0) {
      bestMatch = findBestLowMatch(lowResults, baseInfo);
      if (bestMatch) {
        bestMatch.sourceType = "LOW";
      }
    }
  }

  if (bestMatch) {
    console.log(`✅ Success! Best match found: "${bestMatch.title}"`);
    const movieIndex = storageData.findIndex((movie) => movie.id === id);
    if (movieIndex !== -1) {
      storageData[movieIndex].scrapedDetails = bestMatch;
      await fetchImages(id, storageData, movieIndex);
    }
  } else {
    console.log(
      `❌ No suitable match found for "${title}" after all attempts. ❌`
    );
  }

  return storageData;
}

module.exports = {
  processAndSaveScrapedData,
};
