import { useContext, useEffect, useState, useCallback } from "react";

import { CameraIcon } from "../icons/CameraIcon";
import { NoCameraIcon } from "../icons/NoCameraIcon";
import { SquaresIcon } from "../icons/SquaresIcon";

import ImdbInfo from "./ImdbInfo";

import { SavedContext } from "../context/SavedContext";
import { SimilarMoviesContext } from "../context/SimilarMoviesContext";
import { SettingsContext } from "../context/SettingsContext";
import { useSocket } from "../context/SocketContext";

import { fetchProviders } from "../utils/fetchProviders";

import ProvidersSection from "./ProvidersSection";

import { motion, AnimatePresence } from "motion/react";

import Tooltip from "./Tooltip";
import LoadingIcon from "../icons/LoadingIcon";

export default function Poster({ data }) {
  const [mainHover, setMainHover] = useState(false);
  const [hover, setHover] = useState(false);
  const { handleSave, handleRemove, saved } = useContext(SavedContext);
  const { loadSimilarMovies, isOpen } = useContext(SimilarMoviesContext);
  const { currentRegion } = useContext(SettingsContext);
  const { socket, isConnected } = useSocket();

  const [providers, setProviders] = useState({});
  const [streamingOn, setStreamingOn] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isImdbOpen, setIsImdbOpen] = useState(false);

  const isMovieSaved = saved.some((movie) => movie.id === data.id);
  const isMovieReleased = saved.some(
    (movie) => movie.id === data.id && movie.scrapedDetails
  );
  const iconSize = "w-6 h-6";

  useEffect(() => {
    function handleScrapeStart(receivedMovieId) {
      if (String(receivedMovieId) === String(data.id)) {
        setIsSearching(true);
        // console.log("Search started for", receivedMovieId);
      }
    }

    function handleScrapeEnd(receivedMovieId) {
      if (String(receivedMovieId) === String(data.id)) {
        setIsSearching(false);
        // console.log("Search ended for", receivedMovieId);
      }
    }

    socket.on("scrapefor:start", handleScrapeStart);
    socket.on("scrapefor:end", handleScrapeEnd);
  }, [data.id, socket]);

  const handleClickSave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleSave(data);
  };

  const handleClickRemove = (event) => {
    event.preventDefault();
    event.stopPropagation();
    handleRemove(data);
  };

  const handleFetchProviders = useCallback(async () => {
    const providersData = await fetchProviders(data.id, currentRegion);
    setProviders(providersData);
    if (providersData?.flatrate) {
      setStreamingOn(providersData.flatrate);
    }
  }, [data.id, currentRegion]);

  useEffect(() => {
    if (isMovieReleased) {
      handleFetchProviders();
    }
  }, [isMovieReleased, handleFetchProviders]);

  let imageSrc = data.poster_path
    ? `https://image.tmdb.org/t/p/w300${data.poster_path}`
    : "/FALLBACK.jpg";

  if (isMovieReleased && mainHover && data.images?.backdrops?.[0]) {
    imageSrc = `https://image.tmdb.org/t/p/w780${data.images.backdrops[0]}`;
  }

  const imageVariants = {
    default: {
      height: "100%",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    hovered: {
      height: "200px",
      transition: { duration: 0.4, delay: 0.2, ease: "easeInOut" },
    },
  };

  const shadowVariants = {
    default: {
      opacity: 0,
      height: "100%",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    hovered: {
      opacity: 1,
      height: "200px",
      transition: { duration: 0.4, delay: 0.2, ease: "easeInOut" },
    },
  };

  const handleImdbClick = () => {
    setIsImdbOpen(true);
  };

  const dateToday = () => new Date().toISOString().split("T")[0];
  const today = dateToday();

  return (
    <motion.div
      layout
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{
        y: 100,
        opacity: 0,
        transition: { duration: 0.3 },
      }}
      title={data.title}
      className={`relative h-[250px] w-[165px] min-w-[165px] transition-all duration-200 ease-in-out group poster-shadow ${
        isMovieReleased
          ? "hover:w-[350px] transition-all duration-400 ease-in-out bg-black"
          : "hover:scale-105 bg-transparent"
      }`}
      onMouseEnter={() => setMainHover(true)}
      onMouseLeave={() => setMainHover(false)}
    >
      <motion.button
        layout
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        id="imdb-info-button"
        className={`absolute top-1 left-1 w-auto min-h-7 h-auto z-20
        rounded-sm flex justify-center items-center px-1
      bg-black/60 backdrop-blur-sm border border-yellow-400/40 
      transition-all duration-100 ease-in-out opacity-0 group-hover:opacity-100
      ${
        isImdbOpen
          ? "cursor-none pointer-events-none"
          : "cursor-pointer hover:scale-110"
      }`}
        onClick={() => handleImdbClick()}
      >
        <AnimatePresence>
          {isImdbOpen ? (
            <ImdbInfo movieId={data.id} />
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: 1, ease: "easeInOut" },
              }}
              exit={{ opacity: 0 }}
              className="text-[0.9rem] font-semibold font-[impact] 
        pointer-events-none tracking-wid"
            >
              IMDb
            </motion.p>
          )}
        </AnimatePresence>
      </motion.button>

      {!isMovieReleased && (
        <div
          className={`absolute bottom-1 right-1 z-20 flex flex-col backdrop-blur-xs 
        opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out
        py-0.5 px-1.5 text-center rounded-md border 
        ${
          data.release_date > today
            ? "border-orange-800/50 bg-black/30"
            : "border-green-800/50 bg-black/30"
        }`}
        >
          {data.release_date > today ? (
            <h2 className="text-[0.6rem] font-medium small-text-shadow">
              Coming:
            </h2>
          ) : (
            <h2 className="text-[0.6rem] font-medium small-text-shadow">
              Released:
            </h2>
          )}
          <h2 className="text-[0.6rem] font-medium small-text-shadow">
            {data.release_date}
          </h2>
        </div>
      )}

      {isMovieReleased && mainHover && (
        <>
          <h2 className="text-md absolute left-11 bottom-2.5">{data.title}</h2>

          <div className={`absolute bottom-2.5 right-3 opacity-70`}>
            <ProvidersSection data={streamingOn} />
          </div>
        </>
      )}

      <div
        id="gradient-overlay"
        className="w-full h-full absolute left-0 top-0 bg-linear-180 from-transparent from-80% 
        to-black/60 z-10 opacity-100 group-hover:opacity-0 transition-all duration-200 ease-in-out"
      ></div>

      <AnimatePresence>
        {isSearching && (
          <LoadingIcon
            className={
              "absolute w-10 h-10 scale-200 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 icon-shadow"
            }
          />
        )}
      </AnimatePresence>

      <motion.img
        variants={imageVariants}
        initial="default"
        animate={isMovieReleased && mainHover ? "hovered" : "default"}
        className={`absolute w-full h-full object-cover
          ${data.poster_path ? "brightness-100" : "brightness-30"}`}
        src={imageSrc}
        alt={`${data.title} poster image`}
      />
      <motion.div
        variants={shadowVariants}
        initial="default"
        animate={isMovieReleased && mainHover ? "hovered" : "default"}
        id="gradient-overlay-big"
        className={`absolute z-10 w-full 
          bg-linear-180 top-0 from-transparent from-70% 
        to-black/100 to-98%`}
      ></motion.div>

      <button
        id="similar-movies-button"
        type="button"
        className={`absolute ${
          isMovieReleased
            ? "bottom-3 scale-130 left-3"
            : "bottom-1 scale-100 left-1"
        } ${iconSize} group-hover:opacity-100 opacity-0 duration-200 
        hover:scale-110 cursor-pointer transition-all ease-in-out z-50
      `}
        onClick={() => loadSimilarMovies(data.id, data.title)}
      >
        <Tooltip text={"Find similar movies"} position="top">
          <SquaresIcon
            size={"100%"}
            color="white"
            key={data.id + "squares"}
            className={"icon-shadow"}
          />
        </Tooltip>
      </button>
      {!isMovieSaved ? (
        <button
          type="button"
          className={`absolute top-2 right-2 ${iconSize} md:group-hover:opacity-100 md:opacity-0 
      hover:scale-110 hover:-rotate-12 cursor-pointer transition-all duration-100 ease-in-out z-20
      `}
          onClick={handleClickSave}
        >
          <Tooltip
            text={"Add to track list"}
            position="left"
            className={"rotate-12"}
          >
            <CameraIcon
              size={"100%"}
              color="white"
              key={data.id + "camera"}
              className={"scale-x-[-1] icon-shadow"}
            />
          </Tooltip>
        </button>
      ) : (
        <button
          type="button"
          className={`absolute top-1 right-2 ${iconSize} opacity-100 
          transition-all duration-100 ease-in-out hover:scale-110 z-20`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleClickRemove}
        >
          {hover ? (
            <div
              className="flex justify-center items-center bg-black/60 
            rounded-sm w-[120%] h-[120%] cursor-pointer"
            >
              <Tooltip text={"Remove from track list"} position="left">
                <NoCameraIcon
                  size={"80%"}
                  color="white"
                  key={data.id + "removeCamera"}
                  className={"scale-x-[-1]"}
                />
              </Tooltip>
            </div>
          ) : (
            <div
              className="flex justify-center items-center bg-black/60 
            rounded-sm w-[120%] h-[120%] border border-orange-500/30 backdrop-blur-lg"
            >
              <CameraIcon
                size={"80%"}
                color="white"
                key={data.id + "camera"}
                className={"scale-x-[-1]"}
              />
            </div>
          )}
        </button>
      )}
      {isMovieReleased && (
        <>
          <div
            className="absolute top-2 left-2
        flex justify-center items-center gap-2"
          >
            <div
              className="border-green-500/30 bg-green-500/20 border 
          rounded-md py-0.5 px-1 icon-shadow backdrop-blur-sm"
            >
              <h2 className="text-[0.6rem] uppercase font-bold text-shadow-md tracking-wide">
                Released
              </h2>
            </div>
          </div>

          {/* <button
            id="providers-button"
            className="absolute right-2 bottom-2 w-6 h-6 bg-white/100 cursor-pointer z-50"
            onClick={() => handleLogData()}
          ></button> */}
        </>
      )}
    </motion.div>
  );
}
