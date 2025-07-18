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
    console.error("Error fetching similar movies on TMDb:", error);
    res.status(500).json({ error: "Failed to fetch similar movies." });
  }
});

router.get("/imdb-rating/:query", async (req, res) => {
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
    console.error("Error fetching similar movies on TMDb:", error);
    res.status(500).json({ error: "Failed to fetch similar movies." });
  }
});

module.exports = { router };
