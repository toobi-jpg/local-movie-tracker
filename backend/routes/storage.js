/* eslint-disable */
const express = require("express");
const router = express.Router();
const fs = require("fs").promises;
const path = require("path");
const { processAndSaveScrapedData } = require("../utils/dataProcessor");
const STORAGE_FILE = path.join(__dirname, "storage.json");

const dateToday = () => new Date().toISOString().split("T")[0];

module.exports = function (io, getSettings) {
  router.post("/add-movie", async (req, res) => {
    const movieData = req.body;

    if (!movieData.id || !movieData.title || !movieData.release_date) {
      return res
        .status(400)
        .json({ error: "Movie ID, title, and release_date are required." });
    }

    try {
      let storageData = [];
      try {
        const data = await fs.readFile(STORAGE_FILE, "utf8");
        storageData = JSON.parse(data);
        if (!Array.isArray(storageData)) storageData = [];
      } catch (readError) {
        console.warn(
          "storage.json not found or invalid, initializing as empty array."
        );
        storageData = [];
      }

      if (storageData.some((movie) => movie.id === movieData.id)) {
        console.log("Movie already in storage");
        return res.status(409).json({ message: "Movie already in storage." });
      }

      const movieToAdd = {
        id: movieData.id,
        title: movieData.title,
        release_date: movieData.release_date,
        poster_path: movieData.poster_path,
        media_type: movieData.media_type || "movie",
        tv_id: movieData.tv_id || null,
      };

      if (movieData.release_date > dateToday()) {
        console.log(
          `"${movieData.title}" is a future release. Saving without scraping.`
        );
        storageData.push(movieToAdd);
        await fs.writeFile(
          STORAGE_FILE,
          JSON.stringify(storageData, null, 2),
          "utf8"
        );
        io.emit("storage:updated", storageData);
        return res
          .status(200)
          .json({ message: "Future movie added to track list." });
      }

      console.log(
        `Movie "${movieData.title}" is released. Initiating processing...`
      );

      storageData.push(movieToAdd);
      io.emit("storage:updated", storageData);

      const updatedStorageData = await processAndSaveScrapedData(
        storageData,
        movieToAdd,
        io
      );

      await fs.writeFile(
        STORAGE_FILE,
        JSON.stringify(updatedStorageData, null, 2),
        "utf8"
      );

      console.log(
        `Storage.json successfully updated for "${movieData.title}".`
      );

      io.emit("storage:updated", updatedStorageData);

      res.status(200).json({
        message: "Movie added and processed successfully!",
        movie: movieData,
      });
    } catch (error) {
      console.error("Error during the add movie process:", error);
      res.status(500).json({ error: "Failed to add or process movie." });
    }
  });

  router.get("/get-movies", async (req, res) => {
    try {
      const data = await fs.readFile(STORAGE_FILE, "utf8");
      res.status(200).json(JSON.parse(data));
    } catch (error) {
      if (error.code === "ENOENT") {
        return res.status(200).json([]);
      }
      console.error("Error reading storage.json:", error);
      res
        .status(500)
        .json({ error: "Failed to retrieve movies from storage." });
    }
  });

  router.post("/remove-movie", async (req, res) => {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ error: "Movie ID is required for removal." });
    }
    try {
      let storageData = [];
      try {
        const data = await fs.readFile(STORAGE_FILE, "utf8");
        storageData = JSON.parse(data);
      } catch (readError) {
        storageData = [];
      }
      const initialLength = storageData.length;
      const updatedStorageData = storageData.filter((movie) => movie.id !== id);

      if (updatedStorageData.length === initialLength) {
        return res.status(404).json({ message: "Movie not found in storage." });
      }

      await fs.writeFile(
        STORAGE_FILE,
        JSON.stringify(updatedStorageData, null, 2),
        "utf8"
      );
      io.emit("storage:updated", updatedStorageData);
      res
        .status(200)
        .json({ message: "Movie removed successfully!", movie: { id } });
    } catch (error) {
      console.error("Error removing movie from storage:", error);
      res.status(500).json({ error: "Failed to remove movie to storage." });
    }
  });

  return router;
};
