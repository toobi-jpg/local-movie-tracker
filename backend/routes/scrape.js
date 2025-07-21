/* eslint-disable */
const express = require("express");
const router = express.Router();
const puppeteer = require("puppeteer");

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/118.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/118.0.2088.76",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/118.0",
];

function getRandomUserAgent() {
  const randomIndex = Math.floor(Math.random() * USER_AGENTS.length);
  return USER_AGENTS[randomIndex];
}

async function scrapeMovieData(searchTerm, movieId, io) {
  let browser;
  try {
    if (io) io.emit("scrapefor:start", movieId);
    console.log(`Initiating scrape for search term: "${searchTerm}"`);
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--enable-sandbox",
        "--disable-setuid-sandbox",
        "--disable-client-side-phishing-detection",
        "--disable-extensions",
        "--disable-sync",
        "--disable-features=SafeBrowseEnhancedProtection,SafeBrowseRealTimeUrlChecks",
        "--disable-infobars",
        "--no-default-browser-check",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
    const page = await browser.newPage();
    const userAgent = getRandomUserAgent();
    console.log(`Using User-Agent: ${userAgent}`);
    await page.setUserAgent(userAgent);

    const urlTemplate = process.env.SCRAPE_URL_TEMPLATE;
    const ALLOWED_DOMAINS = [new URL(process.env.SCRAPE_URL_TEMPLATE).hostname];
    const EXTRA_DOMAIN_1 = process.env.ALLOWED_DOMAIN_1;

    if (EXTRA_DOMAIN_1) {
      ALLOWED_DOMAINS.push(EXTRA_DOMAIN_1);
    }

    const BLOCKED_RESOURCE_TYPES = ["image", "stylesheet", "font", "media"];
    const BLOCKED_URL_PATTERNS = [
      "google-analytics.com",
      "doubleclick.net",
      "adservice.google.com",
    ];

    await page.setRequestInterception(true);

    page.on("request", (request) => {
      const requestUrl = new URL(request.url());
      const resourceType = request.resourceType();

      if (BLOCKED_URL_PATTERNS.some((p) => requestUrl.hostname.includes(p))) {
        return request.abort();
      }
      if (BLOCKED_RESOURCE_TYPES.includes(resourceType)) {
        return request.abort();
      }
      if (!ALLOWED_DOMAINS.includes(requestUrl.hostname)) {
        return request.abort();
      }
      request.continue();
    });

    if (!urlTemplate) {
      throw new Error("SCRAPE_URL_TEMPLATE is not configured.");
    }

    const urlToScrape = urlTemplate.replace(
      "%%MOVIE_TITLE%%",
      encodeURIComponent(searchTerm)
    );

    let attempts = 0;
    while (attempts < 3) {
      try {
        await page.goto(urlToScrape, {
          waitUntil: "networkidle2",
          timeout: 30000,
        });
        break;
      } catch (e) {
        attempts++;
        console.warn(`Attempt ${attempts} failed for page.goto. Retrying...`);
        if (attempts >= 3) throw e;
      }
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

    const extractedMovies = await page.evaluate((sel) => {
      const results = [];
      const resultsList = document.querySelector(sel.resultsContainer);
      if (!resultsList) return results;

      const movieEntries = Array.from(
        resultsList.querySelectorAll(sel.movieEntry)
      );

      for (let i = 0; i < Math.min(movieEntries.length, 20); i++) {
        const entry = movieEntries[i];
        const popularityElement = entry.querySelector(sel.popularity);
        results.push({
          type: entry.querySelector(sel.type)?.innerText.trim() || "N/A",
          title: entry.querySelector(sel.title)?.innerText.trim() || "N/A",
          uploadedDate:
            entry.querySelector(sel.uploaded)?.innerText.trim() || "N/A",
          icon: entry.querySelector(sel.icon)?.alt || "N/A",
          bond:
            entry.querySelector(sel.bond)?.getAttribute(sel.bondAttribute) ||
            null,
          massText: entry.querySelector(sel.mass)?.innerText.trim() || "N/A",
          popularity: popularityElement
            ? parseInt(popularityElement.innerText.trim(), 10)
            : 0,
          provider:
            entry.querySelector(sel.provider)?.innerText.trim() || "N/A",
        });
      }
      return results;
    }, selectors);

    console.log(`Scraping for "${searchTerm}" completed.`);
    return extractedMovies;
  } catch (error) {
    console.error(`Scraping failed for "${searchTerm}":`, error);
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
