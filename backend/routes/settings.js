/* eslint-disable */
const express = require("express");
const router = express.Router();
const { readSettings, writeSettings } = require("../utils/settingsManager");

let appSettings = {};

router.use(async (req, res, next) => {
  appSettings = await readSettings();
  next();
});

router.get("/", (req, res) => {
  res.json(appSettings);
});

router.post("/", async (req, res) => {
  const { scheduleTime, notifications, regionCode } = req.body;

  const newSettings = {
    ...appSettings,
    ...(scheduleTime !== undefined && { scheduleTime }),
    ...(notifications !== undefined && { notifications }),
    ...(regionCode !== undefined && { regionCode }),
  };

  try {
    await writeSettings(newSettings);
    res.status(200).json({
      message: "Settings updated successfully!",
      settings: newSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ error: "Failed to update settings." });
  }
});

module.exports = router;
