import { motion, AnimatePresence } from "motion/react";
import CloseIcon from "../../icons/CloseIcon";

import { SimilarMoviesContext } from "../../context/SimilarMoviesContext";
import { useContext } from "react";
import SimilarMoviesResults from "./SimilarMoviesResults";

export default function SimilarMoviesScreen(params) {
  const { handleOpen, handleClose, similarMoviesData, loadSimilarMovies } =
    useContext(SimilarMoviesContext);

  const foldableAnimation = {
    initial: {
      scale: 0,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
    },
    exit: {
      scale: 0,
      opacity: 0,
    },
  };

  return (
    <motion.div
      key="similarMovies-screen"
      variants={foldableAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-1/2 top-1/2 w-6/8 border border-white/10 rounded-4xl
      h-[80%] bg-black/50 backdrop-blur-xl z-50 -translate-y-1/2 -translate-x-1/2
     flex flex-col justify-between items-center py-10 px-10"
    >
      <button
        className="absolute top-2 right-3 w-10 h-10 transition-all duration-100 ease-in-out
       rounded-lg hover:scale-125 cursor-pointer z-50"
        onClick={handleClose}
      >
        <CloseIcon size={"100%"} className={"pointer-events-none z-0"} />
      </button>

      <SimilarMoviesResults data={similarMoviesData} />
    </motion.div>
  );
}
