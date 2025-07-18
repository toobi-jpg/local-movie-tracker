import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SavedProvider } from "./context/SavedContext.jsx";
import { SimilarMoviesProvider } from "./context/SimilarMoviesContext.jsx";
import { SettingsProvider } from "./context/SettingsContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <SavedProvider>
        <SimilarMoviesProvider>
          <SettingsProvider>
            <App />
          </SettingsProvider>
        </SimilarMoviesProvider>
      </SavedProvider>
    </SocketProvider>
  </StrictMode>
);
