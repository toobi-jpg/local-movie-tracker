/* eslint-disable */
const express = require("express");
const router = express.Router();
const { fetchImdbRating } = require("./omdb.js");

const TMDB_TOKEN = process.env.TMDB_ACCESS_TOKEN;

router.use((req, res, next) => {
  if (!TMDB_TOKEN) {
    return res
      .status(500)
      .json({ error: "TMDb Bearer Token is not configured on the server." });
  }
  next();
});

router.get("/search/:query", async (req, res) => {
  const query = encodeURIComponent(req.params.query);
  try {
    const url = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error searching movies on TMDb:", error);
    res.status(500).json({ error: "Failed to search movies." });
  }
});

router.get("/popular-movies", async (req, res) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching popular movies from TMDb:", error);
    res.status(500).json({ error: "Failed to fetch popular movies." });
  }
});

router.get("/trending-movies", async (req, res) => {
  try {
    const url =
      "https://api.themoviedb.org/3/trending/movie/week?language=en-US";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching popular movies from TMDb:", error);
    res.status(500).json({ error: "Failed to fetch popular movies." });
  }
});

router.get("/trending-series", async (req, res) => {
  try {
    const url = "https://api.themoviedb.org/3/trending/tv/week?language=en-US";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching popular movies from TMDb:", error);
    res.status(500).json({ error: "Failed to fetch popular movies." });
  }
});

router.get("/upcoming-movies", async (req, res) => {
  const { date, endDate } = req.query;

  if (!date || !endDate) {
    return res
      .status(400)
      .json({ error: "A date query parameter is required" });
  }

  try {
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&primary_release_date.gte=${date}&primary_release_date.lte=${endDate}&sort_by=popularity.desc`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching popular movies from TMDb:", error);
    res.status(500).json({ error: "Failed to fetch popular movies." });
  }
});

router.get("/similar/:query", async (req, res) => {
  const query = encodeURIComponent(req.params.query);
  try {
    const url = `https://api.themoviedb.org/3/movie/${query}/similar?language=en-US&page=1`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching similar movies on TMDb:", error);
    res.status(500).json({ error: "Failed to fetch similar movies." });
  }
});

router.get("/get-regions", async (req, res) => {
  try {
    const url =
      "https://api.themoviedb.org/3/watch/providers/regions?language=en-US";

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching regions from TMDb:", error);
    res.status(500).json({ error: "Failed to fetch regions." });
  }
});

router.get("/providers/:query", async (req, res) => {
  const query = encodeURIComponent(req.params.query);

  try {
    const url = `https://api.themoviedb.org/3/movie/${query}/watch/providers`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching providers movies on TMDb:", error);
    res.status(500).json({ error: "Failed to fetch providers movies." });
  }
});

router.get("/providers-series/:query", async (req, res) => {
  const query = encodeURIComponent(req.params.query);

  try {
    const url = `https://api.themoviedb.org/3/tv/${query}/watch/providers`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching providers series on TMDb:", error);
    res.status(500).json({ error: "Failed to fetch providers series." });
  }
});

router.get("/imdb-rating-movie/:query", async (req, res) => {
  const query = encodeURIComponent(req.params.query);
  try {
    const url = `https://api.themoviedb.org/3/movie/${query}/external_ids`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    const imdbId = data.imdb_id;
    if (imdbId) {
      const omdbData = await fetchImdbRating(imdbId);
      res.json(omdbData);
    } else {
      res.status(404).json({ error: "IMDb ID not found for this movie." });
    }
  } catch (error) {
    console.error("Error fetching imdb rating movies on TMDb:", error);
    res.status(500).json({ error: "Failed to fetch imdb rating movies." });
  }
});

router.get("/imdb-rating-series/:query", async (req, res) => {
  const query = encodeURIComponent(req.params.query);
  try {
    const url = `https://api.themoviedb.org/3/tv/${query}/external_ids`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDb API Error:", response.status, errorText);
      return res
        .status(response.status)
        .json({ error: `TMDb API error: ${response.status} ${errorText}` });
    }

    const data = await response.json();
    const imdbId = data.imdb_id;
    if (imdbId) {
      const omdbData = await fetchImdbRating(imdbId);
      res.json(omdbData);
    } else {
      res.status(404).json({ error: "IMDb ID not found for this series." });
    }
  } catch (error) {
    console.error("Error fetching imdb ratings for series on TMDb:", error);
    res.status(500).json({ error: "Failed to imdb ratings for series." });
  }
});

router.get("/details-series/:query", async (req, res) => {
  const query = encodeURIComponent(req.params.query);
  try {
    const baseUrl = `https://api.themoviedb.org/3/tv/${query}?language=en-US`;

    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
      },
    };

    const baseResponse = await fetch(baseUrl, options);

    if (!baseResponse.ok) {
      const errorText = await baseResponse.text();
      console.error("TMDb API Error:", baseResponse.status, errorText);
      return res
        .status(baseResponse.status)
        .json({ error: `TMDb API error: ${baseResponse.status} ${errorText}` });
    }

    const baseData = await baseResponse.json();
    const numberOfSeasons = baseData.number_of_seasons;

    const appendParam = Array.from(
      { length: numberOfSeasons },
      (_, i) => `season/${i + 1}`
    ).join(",");

    const fullUrl = `https://api.themoviedb.org/3/tv/${query}?language=en-US&append_to_response=${appendParam}`;

    const fullResponse = await fetch(fullUrl, options);

    if (!fullResponse.ok) {
      const errorText = await fullResponse.text();
      console.error(
        "TMDb API Error (seasons):",
        fullResponse.status,
        errorText
      );
      return res
        .status(fullResponse.status)
        .json({ error: `TMDb API error: ${fullResponse.status} ${errorText}` });
    }

    const fullData = await fullResponse.json();

    const seasonDetails = [];

    for (let i = 1; i <= numberOfSeasons; i++) {
      const key = `season/${i}`;
      if (fullData[key]) {
        seasonDetails.push(fullData[key]);
        delete fullData[key];
      }
    }

    fullData.season_details = seasonDetails;

    if (fullData) {
      res.json(fullData);
    } else {
      res.status(404).json({ error: "Full series data not found." });
    }
  } catch (error) {
    console.error("Error fetching full series details on TMDb:", error);
    res.status(500).json({ error: "Failed to fetch full series details." });
  }
});

module.exports = { router };
