import SearchIcon from "../../icons/SearchIcon";
import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { SearchResultsContext } from "../../context/SearchResultsContext";
import { motion } from "motion/react";

export default function SearchButton() {
  const [input, setInput] = useState("");
  const { handleSearch, setResultsOpen, inputOpen, setInputOpen } =
    useContext(SearchResultsContext);

  const ref = useRef(null);

  const handleChange = useCallback((value) => {
    setInput(value);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!input) return;

    handleSearch(input);
    setResultsOpen(true);
    setInputOpen(false);

    setInput("");
    if (ref.current) {
      ref.current.value = "";
    }
  }, [input, handleSearch, setResultsOpen, setInputOpen]);

  const handleMouseEnter = useCallback(() => {
    setInputOpen(true);
  }, [setInputOpen]);

  const handleMouseLeave = useCallback(() => {
    if (document.activeElement !== ref.current) {
      setInputOpen(false);
    }
  }, [setInputOpen]);

  const handleClickOutside = useCallback(
    (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setInputOpen(false);
      }
    },
    [setInputOpen]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setInputOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setInputOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <motion.div
      layout
      animate={{ width: inputOpen ? 420 : 44 }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
      className={`h-11 hover:bg-black/40 flex justify-center items-center
        bg-black/50 z-50 group backdrop-blur-md overflow-hidden
        rounded-lg border transition-[border] duration-300 ease-in-out
        ${inputOpen ? "p-0 border-orange-800/50" : "p-2 border-white/5"}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!inputOpen && (
        <button className={`p-2 h-full w-full scale-200`}>
          <SearchIcon size={"100%"} className={"pointer-events-none z-0"} />
        </button>
      )}
      {inputOpen && (
        <div className="min-w-[420px] w-2/7 pl-3 shadow-md flex justify-center items-center h-full">
          <input
            ref={ref}
            id="movie-search-input"
            type="text"
            className="w-full h-full top-0 outline-none text-sm bg-transparent"
            placeholder="Search movie/tv-show"
            autoComplete="off"
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
          />
        </div>
      )}
    </motion.div>
  );
}
