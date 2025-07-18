/* eslint-disable */
const TelegramBot = require("node-telegram-bot-api");

async function sendTelegramNotification(message, img) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("Telegram token or chat ID is missing. Skipping notification.");
    return;
  }

  try {
    const bot = new TelegramBot(token);

    if (img) {
      await bot.sendPhoto(chatId, img, {
        caption: message,
        parse_mode: "Markdown",
      });
    } else {
      await bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
    }

    console.log("Telegram notification sent successfully.");
  } catch (error) {
    console.error("Failed to send Telegram notification:", error.message);
  }
}

module.exports = { sendTelegramNotification };
