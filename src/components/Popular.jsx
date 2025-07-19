import { useState, useRef, useEffect, useContext } from "react";
import Poster from "./Poster";
import { StarIcon } from "../icons/StarIcon";
import ScrollContainer from "react-indiana-drag-scroll";
import { SavedContext } from "../context/SavedContext";
import { AnimatePresence } from "motion/react";

export default function Popular() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const { released } = useContext(SavedContext);

  const releasedIds = new Set(released.map((movie) => movie.id));
  const popularNotReleased = results.filter(
    (movie) => !releasedIds.has(movie.id)
  );

  const fetchPopularMovies = async () => {
    try {
      const backendurl = `http://localhost:3001/tmdb/popular-movies/`;
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
    fetchPopularMovies();
  }, []);

  return (
    <div
      className="relative w-full justify-center 
    items-center flex z-0"
    >
      <div className="relative w-full h-full items-center">
        <div className="absolute -top-5 left-0 flex justify-center items-center gap-1">
          <h1 className="text-2xl text-shadow-lg ">Popular</h1>
          <StarIcon size={"1.9rem"} color="white" className={"opacity-80"} />
        </div>

        <ScrollContainer
          className="relative w-full h-full flex gap-[20px] 
          items-center overflow-x-scroll py-4"
        >
          <AnimatePresence>
            {popularNotReleased.map((item) => (
              <Poster data={item} key={item.id} />
            ))}
          </AnimatePresence>
        </ScrollContainer>
      </div>
    </div>
  );
}
