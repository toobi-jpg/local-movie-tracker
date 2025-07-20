import "./App.css";

import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";

import Trending from "./components/Trending";
import Released from "./components/Released";
import SearchScreen from "./components/Search/SearchScreen";
import Popular from "./components/Popular";
import Upcoming from "./components/Upcoming";
import SimilarMoviesScreen from "./components/SimilarMovies/SimilarMoviesScreen";
import SearchButton from "./components/Search/SearchButton";
import Tracking from "./components/Tracking";
import Settings from "./components/Settings";
import { SearchResultsContext } from "./context/SearchResultsContext";

import { SimilarMoviesContext } from "./context/SimilarMoviesContext";
import { SavedContext } from "./context/SavedContext";

function App() {
  const { searchResults, resultsOpen } = useContext(SearchResultsContext);
  const { released, saved } = useContext(SavedContext);

  const { isOpen } = useContext(SimilarMoviesContext);

  return (
    <main className="relative py-10 px-4 md:px-10 hide-scrollbar">
      <div
        id="settings-button"
        className="fixed right-3 top-2 flex flex-col gap-4"
        style={{ zIndex: 999 }}
      >
        <Settings />
      </div>

      <div
        id="search-button"
        className="fixed right-3 bottom-2 flex flex-col gap-4"
        style={{ zIndex: 999 }}
      >
        <SearchButton />
      </div>

      <div
        id="movies-content"
        className="relative w-full h-full flex flex-col items-center gap-5"
      >
        <AnimatePresence>
          {resultsOpen && searchResults.length > 0 && <SearchScreen />}
        </AnimatePresence>

        {isOpen && <SimilarMoviesScreen />}
        <Upcoming />
        <Trending />
        <AnimatePresence>{released.length > 0 && <Released />}</AnimatePresence>
        <AnimatePresence>{saved.length > 0 && <Tracking />}</AnimatePresence>
        <Popular />
      </div>
    </main>
  );
}

export default App;
