import { useState, useRef, useEffect, useContext } from "react";
import Poster from "./Poster";
import { FireIcon } from "../icons/FireIcon";
import ScrollContainer from "react-indiana-drag-scroll";
import { SavedContext } from "../context/SavedContext";

import { motion, AnimatePresence } from "motion/react";

export default function Trending() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const { released } = useContext(SavedContext);

  const releasedIds = new Set(released.map((movie) => movie.id));
  const trendingNotReleased = results.filter(
    (movie) => !releasedIds.has(movie.id)
  );

  const fetchTrendingMovies = async () => {
    try {
      const backendurl = `http://localhost:3001/tmdb/trending-movies/`;
      const response = await fetch(backendurl);
      if (!response.ok) {
        const ErrorData = await response.json();
        throw new Error(ErrorData.error || "http-error:", response.status);
      }
      const initialData = await response.json();
      const data = initialData.results;
      setResults(data || []);
    } catch (err) {
      console.log("error fetching trending movies", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

  return (
    <div
      className="relative w-full justify-center 
    items-center flex z-0"
    >
      <div className="relative w-full h-full items-center">
        <div className="absolute -top-5 left-0 flex justify-center items-center gap-1">
          <h1 className="text-2xl text-shadow-lg ">Trending</h1>
          <FireIcon size={"1.5rem"} className={"opacity-80"} />
        </div>

        <ScrollContainer
          className="relative w-full h-full flex gap-[20px] 
          items-center overflow-x-scroll py-4"
        >
          <AnimatePresence>
            {trendingNotReleased.map((item) => (
              <Poster data={item} key={item.id} />
            ))}
          </AnimatePresence>
        </ScrollContainer>
      </div>
    </div>
  );
}
