Movie Tracker & Release Notifier

A personal, self-hosted application to track movie and TV show releases. It uses Puppeteer for automated release checking and the TMDB API for movie data, with optional Telegram notifications.
Features

    Movie & TV Show Tracking: Add movies and TV shows to your personal tracking list.

    Discover: Browse trending, popular, and upcoming movies.

    Release Detection: Automatically checks configured websites to see if a tracked item has been released.

    Advanced Search: Easily find movies and TV shows.

    Similar Movies: Get recommendations based on movies you like.

    Provider Information: See where a movie is available for streaming, powered by JustWatch / TMDB.

    Telegram Notifications: (Optional) Set up a Telegram bot to receive notifications for new releases.

    Configurable: Settings for release region, check schedule, and notifications.

    IMPORTANT: Legal Disclaimer

    This application includes an automated data retrieval component that is intended for personal, local use only.

        User Responsibility: You are solely responsible for how you configure and use this feature.

        Permissions: The automated checker should only be configured to access websites for which you have explicit permission to do so. It is your responsibility to review and comply with the terms of service of any website you intend to access.

        Copyrighted Material: Do not use this tool to access, download, or distribute copyrighted material for which you do not have the legal rights. The developers of this application are not responsible for any misuse or legal issues that may arise from its use.

Prerequisites

Before you begin, ensure you have the following installed on your system:

    Node.js (which includes npm)

Installation & Setup

Follow these steps to get your local environment set up.

1. Clone the Repository

git clone <https://github.com/toobi-jpg/local-movie-tracker>

2. Install Backend Dependencies

Navigate to the backend directory and install the required packages.

cd backend
npm install

3. Install Frontend Dependencies

From the root directory of the project, install the frontend packages.

npm install

4. Configure Environment Variables

The backend requires a set of environment variables to function correctly.

    Navigate to the backend directory.

    Create a new file named .env.local.

    Copy the contents from the .env.example file into your new .env.local file.

    Fill in the required values in .env.local with your own keys and configuration.

Running the Application

Once the installation and configuration are complete, you can start both the frontend and backend servers concurrently with a single command from the root directory.

npm run start-all

    The React frontend will be available at http://localhost:5173 (or configure a available port).

    The Express backend will run on http://localhost:3001. (same here).

Dependencies

<details>
<summary><strong>Frontend Dependencies</strong></summary>

    @tailwindcss/vite

    lottie-react

    motion

    react

    react-dom

    react-indiana-drag-scroll

    socket.io-client

    tailwindcss

</details>

<details>
<summary><strong>Backend Dependencies</strong></summary>

    cors

    dotenv

    express

    node-cron

    node-telegram-bot-api

    puppeteer

    socket.io

</details>
