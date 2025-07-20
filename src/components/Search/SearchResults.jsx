import { useState, useRef, useEffect, useContext } from "react";
import Poster from "../Poster";
import ScrollContainer from "react-indiana-drag-scroll";
import { SavedContext } from "../../context/SavedContext";
import SearchIcon from "../../icons/SearchIcon";

import { motion, AnimatePresence } from "motion/react";
import { SearchResultsContext } from "../../context/SearchResultsContext";

export default function SearchResults() {
  const { searchResults, searchQuery, resultsOpen } =
    useContext(SearchResultsContext);

  return (
    <div
      className="relative w-full justify-center 
    items-center flex z-0"
    >
      <div className="relative w-full h-full items-center">
        <div className="absolute -top-3 left-0 flex justify-center items-center gap-1">
          <h1 className="text-md font-medium text-shadow-lg ">
            {searchResults.length}{" "}
            <span className="font-light">results for: </span>
            {searchQuery}
          </h1>
        </div>

        {/* <AnimatePresence> */}
        <motion.div>
          <ScrollContainer
            className="relative w-full h-full flex gap-[20px] 
          items-center overflow-x-scroll py-4"
          >
            <AnimatePresence>
              {searchResults.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 500 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: index * 0.05 },
                  }}
                  exit={{ opacity: 0, y: -500 }}
                >
                  <Poster data={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollContainer>
        </motion.div>
        {/* </AnimatePresence> */}
      </div>
    </div>
  );
}
