/* eslint-disable */
const fs = require("fs").promises;
const path = require("path");

const SETTINGS_FILE = path.join(__dirname, "..", "config", "settings.json");

const DEFAULT_SETTINGS = {
  scheduleTime: "0 12,18 * * *",
  notifications: true,
  regionCode: "US",
};

/**
 * @returns {Promise<object>}
 */
async function readSettings() {
  try {
    const data = await fs.readFile(SETTINGS_FILE, "utf8");
    const userSettings = JSON.parse(data);
    return { ...DEFAULT_SETTINGS, ...userSettings };
  } catch (error) {
    if (error.code === "ENOENT") {
      console.warn("settings.json not found. Creating with default values.");
      await writeSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    console.error("Error reading settings.json:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * @param {object} data
 * @returns {Promise<void>}
 */
async function writeSettings(data) {
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { readSettings, writeSettings };
