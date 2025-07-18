import { useContext, useEffect, useState } from "react";
import { motion } from "motion/react";
import { SimilarMoviesContext } from "../../context/SimilarMoviesContext";

import Poster from "../Poster";

export default function SimilarMoviesResults({ data }) {
  const { title } = useContext(SimilarMoviesContext);

  return (
    <div
      className="relative w-full justify-center 
    items-center flex z-0 h-full py-2"
    >
      <div className="relative w-full h-full items-center">
        {data.length > 0 && (
          <h1 className="absolute text-2xl -top-9 left-0 text-shadow-lg z-50">
            Similar movies to: {title}
          </h1>
        )}

        <div
          className="relative w-full h-[100%] flex gap-[20px] overflow-x-hidden
          flex-wrap overflow-y-auto justify-center items-center py-0 hide-scrollbar"
        >
          {data.map((item) => (
            <motion.div
              key={item.id}
              exit={{
                opacity: 0,
                height: 0,
                transition: { duration: 1 },
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <Poster data={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
