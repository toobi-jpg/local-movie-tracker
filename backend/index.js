/* eslint-disable */
require("dotenv").config({ path: ".env.local" });

const express = require("express");
const cron = require("node-cron");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const port = 3001;
const cors = require("cors");
const fs = require("fs").promises;
const path = require("path");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const storageRoutes = require("./routes/storage");
const tmdbRoutes = require("./routes/tmdb");
const settingsRoutes = require("./routes/settings");
const { scrapeMovieData } = require("./routes/scrape");
const { sendTelegramNotification } = require("./utils/telegramBot");
const { readSettings } = require("./utils/settingsManager");
const { processAndSaveScrapedData } = require("./utils/dataProcessor");

let localFeatureHandler;

try {
  const { executeLocalFeature } = require("../local-feature/local.js");
  localFeatureHandler = executeLocalFeature;
  console.log("local feature module loaded.");
} catch (e) {
  console.log("local feature not found. module is disabled.");
  localFeatureHandler = () => Promise.resolve();
}

let cronJob;
let appSettings;
const STORAGE_FILE = path.join(__dirname, "routes", "storage.json");

const dateToday = () => new Date().toISOString().split("T")[0];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/tmdb", tmdbRoutes.router);
app.use("/settings", settingsRoutes);
app.use(
  "/storage",
  storageRoutes(io, () => appSettings)
);

async function scrapeAllMovies() {
  io.emit("search:start", { message: "Scheduled search has begun" });
  console.log("Server starting up. Initiating full movie scrape...");

  let allMovies = [];
  try {
    const data = await fs.readFile(STORAGE_FILE, "utf8");
    allMovies = JSON.parse(data);
  } catch (e) {
    console.log("storage.json not found or empty, nothing to scrape.");
    io.emit("search:end", { message: "No movies to search for." });
    return;
  }

  const moviesToScrape = allMovies.filter((movie) => !movie.scrapedDetails);

  if (moviesToScrape.length === 0) {
    console.log("No new movies to scrape.");
    io.emit("search:end", { message: "No new movies to search for." });
    return;
  }

  console.log(`Found ${moviesToScrape.length} movies to scrape. Starting...`);

  const today = dateToday();
  let updatedStorageData = [...allMovies];

  for (const movie of moviesToScrape) {
    try {
      if (movie.release_date > today) {
        console.log(`Skipping future release: "${movie.title}"`);
        continue;
      }

      io.emit("search:progress", { message: `Searching ${movie.title}...` });
      console.log(`Initiating processing for "${movie.title}"...`);

      updatedStorageData = await processAndSaveScrapedData(
        updatedStorageData,
        movie,
        io
      );
    } catch (error) {
      console.error(`Scheduled scrape for "${movie.title}" failed:`, error);
    }

    console.log("Waiting for 5 seconds before the next movie...");
    await delay(5000);
  }

  await fs.writeFile(
    STORAGE_FILE,
    JSON.stringify(updatedStorageData, null, 2),
    "utf8"
  );
  console.log("Storage.json updated with new scrape details.");
  io.emit("storage:updated", updatedStorageData);

  console.log("Full movie scrape completed.");
  io.emit("search:end", { message: "Search for movies has finished" });
}

app.post("/scrape/all", (req, res) => {
  console.log("Manual full scrape initiated via API request");
  scrapeAllMovies();
  res.status(202).json({ message: "Search process initiated successfully" });
});

function scheduleCronJob() {
  if (cronJob) {
    cronJob.stop();
  }
  console.log(
    `Scheduling cron job with pattern: "${appSettings.scheduleTime}"`
  );
  cronJob = cron.schedule(
    appSettings.scheduleTime,
    () => {
      console.log("Running scheduled scrape...");
      scrapeAllMovies();
    },
    {
      scheduled: true,
      timezone: "Europe/Amsterdam",
    }
  );
}

server.listen(port, async () => {
  console.log(`Server listening on port: ${port}`);
  appSettings = await readSettings();

  scheduleCronJob();
});
