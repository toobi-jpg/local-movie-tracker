/* eslint-disable */
const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

async function scrapeMovieData(movieTitle, release_date, movieId, io) {
  let browser;
  try {
    if (io) io.emit("scrapefor:start", movieId);
    console.log("Initiating scrape for:", movieTitle);
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const urlTemplate = process.env.SCRAPE_URL_TEMPLATE;

    if (!urlTemplate) {
      console.error("SCRAPE_URL_TEMPLATE is not configured in .env.local file");
      return [];
    }

    const selectors = {
      resultsContainer: process.env.SELECTOR_RESULTS_CONTAINER,
      movieEntry: process.env.SELECTOR_MOVIE_ENTRY,
      type: process.env.SELECTOR_TYPE,
      title: process.env.SELECTOR_TITLE,
      uploaded: process.env.SELECTOR_UPLOADED,
      icon: process.env.SELECTOR_ICON,
      bond: process.env.SELECTOR_BOND,
      bondAttribute: process.env.BOND_ATTRIBUTE,
      mass: process.env.SELECTOR_MASS,
      popularity: process.env.SELECTOR_POPULARITY,
      sourceCount: process.env.SELECTOR_SOURCE_COUNT,
      provider: process.env.SELECTOR_PROVIDER,
    };

    if (!selectors.resultsContainer || !selectors.movieEntry) {
      console.error(
        "Essential scraper selectors are not configured in environment variables."
      );
      return [];
    }

    let searchTerm = movieTitle;
    if (
      release_date &&
      typeof release_date === "string" &&
      release_date.length > 0
    ) {
      const releaseYear = release_date.split("-")[0];
      if (releaseYear) {
        searchTerm += " " + releaseYear;
      }
    }

    const urlToScrape = urlTemplate.replace(
      "%%MOVIE_TITLE%%",
      encodeURIComponent(searchTerm)
    );

    await page.goto(urlToScrape, { waitUntil: "networkidle2" });

    const extractedMovies = await page.evaluate((sel) => {
      const results = [];
      const resultsList = document.querySelector(sel.resultsContainer);

      if (!resultsList) {
        console.warn(
          "Could not find the main list container using selector:",
          sel.resultsContainer
        );
        return results;
      }

      const movieEntries = Array.from(
        resultsList.querySelectorAll(sel.movieEntry)
      );

      for (let i = 0; i < Math.min(movieEntries.length, 5); i++) {
        const entry = movieEntries[i];
        const typeElement = entry.querySelector(sel.type);
        const titleElement = entry.querySelector(sel.title);
        const uploadedSpan = entry.querySelector(sel.uploaded);
        const iconElement = entry.querySelector(sel.icon);
        const bondElement = entry.querySelector(sel.bond);
        const massElement = entry.querySelector(sel.mass);
        const popularityElement = entry.querySelector(sel.popularity);
        const sourceCountElement = entry.querySelector(sel.sourceCount);
        const providerElement = entry.querySelector(sel.provider);

        results.push({
          type: typeElement ? typeElement.innerText.trim() : "N/A",
          title: titleElement ? titleElement.innerText.trim() : "N/A",
          uploadedTimestamp: uploadedSpan
            ? uploadedSpan.getAttribute("title")
            : "N/A",
          uploadedDate: uploadedSpan ? uploadedSpan.innerText.trim() : "N/A",
          icon: iconElement ? iconElement.alt : "N/A",
          bond: bondElement
            ? bondElement.getAttribute(sel.bondAttribute)
            : null,
          massText: massElement ? massElement.innerText.trim() : "N/A",
          popularity: popularityElement
            ? parseInt(popularityElement.innerText.trim(), 10)
            : 0,
          sourceCount: sourceCountElement
            ? parseInt(sourceCountElement.innerText.trim(), 10)
            : 0,
          provider: providerElement ? providerElement.innerText.trim() : "N/A",
        });
      }
      return results;
    }, selectors);

    console.log("Scraping completed for:", movieTitle);
    return extractedMovies;
  } catch (error) {
    console.error(`Scraping failed for ${movieTitle}:`, error);
    return [];
  } finally {
    if (io) io.emit("scrapefor:end", movieId);
    if (browser) {
      await browser.close();
    }
  }
}

router.get("/:movie", async (req, res) => {
  const movie = req.params.movie;
  const release_date = req.query.release_date;

  if (!release_date) {
    return res
      .status(400)
      .json({ error: "The 'release_date' query parameter is required." });
  }

  try {
    const extractedMovies = await scrapeMovieData(movie, release_date);
    res.json({
      items: extractedMovies,
      message: `Scraped data for: ${movie}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to scrape data" });
  }
});

module.exports = {
  router,
  scrapeMovieData,
};
