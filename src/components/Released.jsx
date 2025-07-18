import { useContext, useEffect, useState } from "react";
// import ReleasedItem from "./ReleasedItem";
import { SavedContext } from "../context/SavedContext";
import ScrollContainer from "react-indiana-drag-scroll";
import { WebIcon } from "../icons/WebIcon";
import Poster from "./Poster";

import { motion, AnimatePresence } from "framer-motion";

export default function Released() {
  const { handleRemove, released } = useContext(SavedContext);

  const releasedItems = released
    ? released.filter((movie) => movie.scrapedDetails)
    : [];

  return (
    <motion.div
      exit={{
        x: -1000,
        transition: { duration: 1, delay: 0.3 },
      }}
      initial={{ x: -1000 }}
      animate={{ x: 0 }}
      className="relative w-full justify-center 
    items-center flex z-0"
    >
      <div className="relative w-full h-full items-center">
        <div className="absolute -top-5 left-0 flex justify-center items-center gap-1">
          <h1 className="text-2xl text-shadow-lg ">Released</h1>
          <WebIcon size={"1.6rem"} className={"opacity-80"} />
        </div>

        <ScrollContainer
          className="relative w-full h-full flex gap-[20px] 
        items-center overflow-x-scroll py-4"
        >
          <AnimatePresence>
            {releasedItems.map((movie) => (
              // <motion.div
              //   layout
              //   key={movie.id}
              //   initial={{ y: 100, opacity: 0 }}
              //   animate={{ y: 0, opacity: 1 }}
              //   exit={{
              //     y: 100,
              //     opacity: 0,
              //     transition: { duration: 0.3 },
              //   }}
              // >
              //   <ReleasedItem movie={movie} handleRemove={handleRemove} />
              // </motion.div>
              <Poster key={movie.id} data={movie} />
            ))}
          </AnimatePresence>
        </ScrollContainer>
      </div>
    </motion.div>
  );
}
