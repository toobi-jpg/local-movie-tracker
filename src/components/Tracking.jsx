import { useContext, useEffect, useState } from "react";
import { SavedContext } from "../context/SavedContext";
import Poster from "./Poster";
import FullSearchButton from "./FullSearchButton";

import ScrollContainer from "react-indiana-drag-scroll";

import { motion, AnimatePresence } from "motion/react";

export default function Tracking() {
  const { saved } = useContext(SavedContext);

  const notReleased = saved.filter((m) => !m.scrapedDetails);

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
      <div
        className="absolute -top-5 left-0 flex 
      justify-center items-center gap-3"
      >
        <h1 className="text-2xl text-shadow-lg">Tracking Watchlist</h1>

        <FullSearchButton />
      </div>

      <div className="relative w-full h-full items-center">
        <ScrollContainer
          className="relative w-full h-full flex gap-[20px] 
                  items-center overflow-x-scroll py-4"
        >
          <AnimatePresence>
            {notReleased.map((item) => (
              <Poster data={item} key={item.id} />
            ))}
          </AnimatePresence>
        </ScrollContainer>
      </div>
    </motion.div>
  );
}
