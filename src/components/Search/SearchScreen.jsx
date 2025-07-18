import Search from "./Search";
import SearchResults from "./SearchResults";
import { motion, AnimatePresence } from "motion/react";
import CloseIcon from "../../icons/CloseIcon";

import { useState, useEffect, useRef } from "react";

export default function SearchScreen({ handleClose, buttonRef }) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const searchInputRef = useRef(null);

  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      setOrigin({ x: `${x}px`, y: `${y}px` });
    }
  }, [buttonRef]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClose();
      } else return;
    };

    window.addEventListener("keydown", handleKeyDown);

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const foldableAnimation = {
    initial: {
      clipPath: `circle(30px at ${origin.x} ${origin.y})`,
      opacity: 1,
    },
    animate: {
      clipPath: `circle(200vh at ${origin.x} ${origin.y})`,
      opacity: 1,
    },
    exit: {
      clipPath: `circle(30px at ${origin.x} ${origin.y})`,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    },
  };

  const handleSearchResults = (results, error = null) => {
    setSearchResults(results);
    setSearchError(error);
  };

  return (
    <motion.div
      key="search-screen"
      variants={foldableAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 top-1/2 w-6/8 border border-white/10 rounded-4xl
      h-4/5 bg-black/50 backdrop-blur-xl z-50 -translate-y-1/2 -translate-x-1/2
     flex flex-col justify-between items-center py-10 px-10"
    >
      <button
        className="absolute top-2 right-2 w-10 h-10 transition-all duration-100 ease-in-out
       rounded-lg hover:scale-125 cursor-pointer z-50"
        onClick={handleClose}
      >
        <CloseIcon size={"100%"} className={"pointer-events-none z-0"} />
      </button>
      <SearchResults data={searchResults} />
      <Search searchResults={handleSearchResults} ref={searchInputRef} />
    </motion.div>
  );
}
