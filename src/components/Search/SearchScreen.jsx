import { motion, AnimatePresence } from "motion/react";
import CloseIcon from "../../icons/CloseIcon";
import { SearchResultsContext } from "../../context/SearchResultsContext";
import SearchResults from "./SearchResults";

import { useState, useEffect, useRef, useContext, useCallback } from "react";

export default function SearchScreen() {
  const { setResultsOpen, setInputOpen, inputOpen } =
    useContext(SearchResultsContext);
  const resultsScreenRef = useRef(null);

  const handleClickOutside = useCallback(
    (event) => {
      if (
        resultsScreenRef.current &&
        !resultsScreenRef.current.contains(event.target) &&
        !inputOpen
      ) {
        setResultsOpen(false);
      }
    },
    [setResultsOpen, inputOpen]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setResultsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setResultsOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 500 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
      }}
      exit={{ opacity: 0, y: 500, transition: { duration: 0.6 } }}
      ref={resultsScreenRef}
      key="search-screen"
      className="fixed left-1/2 -translate-x-1/2 bottom-0 w-[99%] border border-white/5
      h-[320px] z-50 px-8 bg-black/40 backdrop-blur-lg rounded-xl
     flex justify-center items-center"
    >
      <button
        className="absolute top-1 right-2 w-7 h-7 transition-all duration-100 ease-in-out
       rounded-lg hover:scale-125 cursor-pointer z-50"
        onClick={() => (setResultsOpen(false), setInputOpen(false))}
      >
        <CloseIcon size={"100%"} className={"pointer-events-none z-0"} />
      </button>
      <SearchResults />
    </motion.div>
  );
}
