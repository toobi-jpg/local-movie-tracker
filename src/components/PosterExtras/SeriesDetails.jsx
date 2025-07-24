import { useContext, useRef, useState } from "react";
import { EpisodesIcon } from "../../icons/EpisodesIcon";
import Tooltip from "../Tooltip";
import { motion, AnimatePresence } from "motion/react";
import CloseIcon from "../../icons/CloseIcon";
import AddButton from "./AddButton";
import RemoveButton from "./RemoveButton";

import { SavedContext } from "../../context/SavedContext";

export default function SeriesDetails({
  // data,
  className,
  mainHover,
  fetchSeriesDetails,
  seriesData,
}) {
  const { handleSave, handleRemove } = useContext(SavedContext);
  const [isOpen, setIsOpen] = useState(false);
  const { saved } = useContext(SavedContext);

  const seasons = seriesData.season_details || [];
  const isMovieReleased = (episodeId) => {
    return saved.some(
      (savedItem) => savedItem.id === episodeId && savedItem.scrapedDetails
    );
  };

  const handleOpenDetailsClick = () => {
    if (seasons.length === 0) {
      fetchSeriesDetails();
    }

    setIsOpen(!isOpen);
  };

  const handleClickSave = (event, data) => {
    event.preventDefault();
    event.stopPropagation();

    const seasonNumber = data.season_number || 1;
    const season = seasonNumber.toString().padStart(2, "0");
    const episode = data.episode_number.toString().padStart(2, "0");

    const title = `${seriesData.name} S${season}E${episode}`;

    const saveData = {
      id: data.id,
      title: title,
      release_date: data.air_date,
      poster_path: seriesData.poster_path,
      media_type: "tv",
      tv_id: seriesData.id,
    };

    console.log("Episode data:", data); // Debug log
    console.log("Save data:", saveData); // Debug log

    handleSave(saveData);
  };

  const handleClickRemove = (event, data) => {
    event.preventDefault();
    event.stopPropagation();
    handleRemove(data);
  };

  const hasEpisodeAired = (data) => {
    const dateToday = () => new Date().toISOString().split("T")[0];
    const today = dateToday();
    const mediaHasAired = data.air_date < today;

    return mediaHasAired;
  };

  const iconSize = "100%";

  return (
    <>
      <button
        id="toggle-series-open"
        className={`${className} md:absolute md:top-1 md:right-1 inline-block z-50 w-7 h-7
      cursor-pointer md:group-hover:opacity-100 opacity-100 md:opacity-0 ${
        isOpen ? "hidden md:absolute" : "absolute top-1 right-1"
      }`}
        onClick={() => handleOpenDetailsClick()}
      >
        <Tooltip text={"Series details"} position="left">
          <EpisodesIcon
            size={"100%"}
            className={
              "icon-shadow hover:scale-110 transition-all duration-100 ease-in-out"
            }
          />
        </Tooltip>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 0.3 }}
            className={`md:left-0 md:top-0 py-2 origin-top md:absolute md:w-full md:h-full
        md:bg-black/60 md:backdrop-blur-sm z-40 flex flex-col justify-start items-start
        md:translate-y-0 md:translate-x-0
        w-screen h-screen fixed left-1/2 top-[0%] -translate-y-[62.5%] -translate-x-1/2
        bg-black/95 px-3 md:px-0`}
          >
            <div className="w-4/5 flex justify-start pl-1">
              <p className="md:text-sm text-xl font-semibold mt-3 md:mt-0">
                {seriesData.name}
              </p>
            </div>
            <ul className="h-full w-full overflow-y-scroll hide-scrollbar mt-5 md:mt-0">
              {seasons?.map((s) => (
                <li key={s.name}>
                  <h2 className="md:text-sm text-xl font-semibold pl-1 mt-4 -mb-2 md:mb-0 md:mt-1">
                    {s.name}
                  </h2>
                  <ul>
                    {s.episodes?.map((e) => (
                      <li
                        key={e.id}
                        className="text-sm md:h-8 md:pl-2 md:bg-black/40 md:mt-0.5
                    flex justify-between items-center relative whitespace-nowrap
                    md:p-0 p-3 rounded-xl md:rounded-none md:border-0 border-white/5 border bg-white/5 mt-4"
                      >
                        <p className="w-4/5 overflow-hidden md:text-xs text-xl">
                          <span className="md:text-xs text-lg font-semibold opacity-60">
                            {e.episode_number}
                          </span>{" "}
                          {e.name}
                        </p>
                        <div className="md:h-8 md:w-8 h-12 w-12 absolute right-2 md:p-1 md:right-0">
                          <div>
                            {isMovieReleased(e.id) ? (
                              <RemoveButton
                                data={e}
                                handleClickRemove={(event) =>
                                  handleClickRemove(event, e)
                                }
                                iconSize={iconSize}
                                isMovieReleased={isMovieReleased}
                                className={``}
                              />
                            ) : (
                              <AddButton
                                data={e}
                                mediaHasAired={hasEpisodeAired(e)}
                                handleClickSave={(event) =>
                                  handleClickSave(event, e)
                                }
                                iconSize={iconSize}
                                className={``}
                              />
                            )}
                            {/* <button
                            onClick={() => console.log(seriesData)}
                            className="w-5 h-5 bg-white absolute z-50 right-10"
                          ></button> */}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <button
              className="absolute z-50 top-1 right-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              <CloseIcon size={54} className={"block md:hidden"} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
