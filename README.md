# Movie Tracker & Release Notifier

A personal, self-hosted application to track movie and TV show releases. It uses Puppeteer for automated release checking and the TMDB API for movie data, with optional Telegram notifications.

---

## Features

- **Movie & TV Show Tracking:** Add movies and TV shows to your personal tracking list.
- **Discover:** Browse trending, popular, and upcoming movies.
- **Release Detection:** Automatically checks configured websites to see if a tracked item has been released.
- **Advanced Search:** Easily find movies and TV shows.
- **Similar Movies:** Get recommendations based on movies you like.
- **Provider Information:** See where a movie is available for streaming (powered by JustWatch).
- **Telegram Notifications (Optional):** Set up a Telegram bot to receive notifications for new releases.
- **Configurable:** Customize release region, check schedule, and notifications.

---

## ⚠️ Legal Disclaimer

This application includes an automated data retrieval component (Puppeteer) that is intended for **personal, local use only**.

- **User Responsibility:** You are solely responsible for how you configure and use this feature.
- **Permissions:** Only access websites for which you have explicit permission. Review and comply with the terms of service of any site you use.
- **Copyrighted Material:** Do not use this tool to access, or distribute copyrighted material without legal rights.

The user of this tool is solely responsible for any misuse or legal issues arising from its use.

---

## Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/) (includes npm)

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/toobi-jpg/local-movie-tracker
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

From the root project directory:

```bash
npm install
```

### 4. Configure Environment Variables

1. Navigate to the `backend` directory.
2. Create a new file named `.env.local`.
3. Copy the contents of `env.example.txt` into `.env.local`.
4. Fill in the required values with your own API keys and settings.

---

## Running the Application

From the root directory, start both the frontend and backend servers with:

```bash
npm run start-all
```

- The frontend will be available at: [http://localhost:5173](http://localhost:5173)
- The backend will run on: [http://localhost:3001](http://localhost:3001)

---

## Dependencies

<details>
<summary><strong>Frontend Dependencies</strong></summary>

- @tailwindcss/vite
- lottie-react
- motion
- react
- react-dom
- react-indiana-drag-scroll
- socket.io-client
- tailwindcss

</details>

<details>
<summary><strong>Backend Dependencies</strong></summary>

- cors
- dotenv
- express
- node-cron
- node-telegram-bot-api
- puppeteer
- socket.io

</details>
