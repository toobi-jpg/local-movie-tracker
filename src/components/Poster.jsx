import { useContext, useEffect, useState, useCallback } from "react";

import { CameraIcon } from "../icons/CameraIcon";
import { NoCameraIcon } from "../icons/NoCameraIcon";
import { SquaresIcon } from "../icons/SquaresIcon";
import { EyeAddIcon } from "../icons/EyeAddIcon";
import { EyeRemoveIcon } from "../icons/EyeRemoveIcon";
import { EyeIcon } from "../icons/EyeIcon";

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
import FetchedDetails from "./PosterExtras/FetchedDetails";
import Dropdown from "./PosterExtras/Dropdown";
import AddButton from "./PosterExtras/AddButton";
import RemoveButton from "./PosterExtras/RemoveButton";
import ReleaseDate from "./PosterExtras/ReleaseDate";

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
  const [eyeHover, setEyeHover] = useState(false);

  const isMovieSaved = saved.some((movie) => movie.id === data.id);
  const isMovieReleased = saved.some(
    (movie) => movie.id === data.id && movie.scrapedDetails
  );
  const isSeries = data.media_type && data.media_type === "tv";
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

  const handleImdbClick = () => {
    setIsImdbOpen(true);
  };

  const dateToday = () => new Date().toISOString().split("T")[0];
  const today = dateToday();
  const mediaHasAired = (data.release_date || data.first_air_date) < today;

  const defaultImageSrc = data.poster_path
    ? `https://image.tmdb.org/t/p/w300${data.poster_path}`
    : "/FALLBACK.jpg";

  const hoverImageSrc =
    isMovieReleased && data.images?.backdrops?.[0]
      ? `https://image.tmdb.org/t/p/w780${data.images.backdrops[0]}`
      : defaultImageSrc;

  const handleLogDataClick = () => {
    console.log(data);
  };

  return (
    <motion.div
      title={data.title}
      className={`relative h-[250px] w-[165px] min-w-[165px] transition-all duration-200 ease-in-out group poster-shadow ${
        isMovieReleased
          ? "hover:w-[350px] transition-all duration-400 ease-in-out bg-black/40 backdrop-blur-lg hover:border border-t-0 border-white/5"
          : "hover:scale-105 bg-transparent"
      }`}
      onMouseEnter={() => setMainHover(true)}
      onMouseLeave={() => setMainHover(false)}
      onClick={() => handleLogDataClick()}
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
            <ImdbInfo movieData={data} dateToday={today} />
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
        <ReleaseDate
          data={data}
          mediaHasAired={mediaHasAired}
          isSeries={isSeries}
        />
      )}
      {isMovieReleased && mainHover && (
        <>
          <motion.div
            initial={{ zIndex: 0, opacity: 0 }}
            animate={{ zIndex: 50, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute left-12 bottom-1 flex flex-col gap-0.5"
          >
            <div className="text-sm flex items-center">
              {data.scrapedDetails &&
              data.scrapedDetails.sourceType === "HIGH" ? (
                <p className="font-semibold text-xs opacity-50 translate-y-[3.5%]">
                  4K&nbsp;
                </p>
              ) : (
                <p className="font-semibold text-xs opacity-50 translate-y-[3.5%]">
                  HD&nbsp;
                </p>
              )}
              <h2 className="">{data.title}</h2>
            </div>
            <FetchedDetails data={data} />
          </motion.div>

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
      <div className="relative w-full h-full" id="image-container">
        <motion.img
          className={`absolute max-w-[165px] h-full object-cover ${
            data.poster_path ? "brightness-100" : "brightness-30"
          }`}
          src={defaultImageSrc}
          alt={`${data.title} poster image`}
          animate={{
            opacity: mainHover && isMovieReleased ? 0 : 1,
          }}
          transition={{ opacity: { delay: 0 } }}
        />

        {isMovieReleased && data.images?.backdrops?.[0] && (
          <motion.img
            className="absolute w-full object-cover"
            src={hoverImageSrc}
            alt={`${data.title} backdrop image`}
            initial={{ opacity: 1, height: 250 }}
            animate={{
              opacity: mainHover ? 1 : 0,
              height: mainHover ? 200 : 200,
            }}
            transition={{
              height: {
                delay: 0.2,
                duration: 0.4,
              },
              opacity: {
                duration: 0.3,
              },
            }}
          />
        )}
      </div>
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
      {!isSeries ? (
        <div>
          {!isMovieSaved ? (
            <AddButton
              data={data}
              mediaHasAired={mediaHasAired}
              handleClickSave={handleClickSave}
              iconSize={iconSize}
              eyeHover={eyeHover}
              setEyeHover={setEyeHover}
            />
          ) : (
            <RemoveButton
              data={data}
              handleClickRemove={handleClickRemove}
              iconSize={iconSize}
              eyeHover={eyeHover}
              setEyeHover={setEyeHover}
              isMovieReleased={isMovieReleased}
            />
          )}
        </div>
      ) : (
        <Dropdown
          data={data}
          className={"absolute top-1 right-1 inline-block z-50"}
        />
      )}
    </motion.div>
  );
}
