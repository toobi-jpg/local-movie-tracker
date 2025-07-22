import { useRef, useState } from "react";
import { EpisodesIcon } from "../../icons/EpisodesIcon";
import Tooltip from "../Tooltip";
import { CameraIcon } from "../../icons/CameraIcon";
import { motion, AnimatePresence } from "motion/react";

export default function SeriesDetails({
  data,
  className,
  mainHover,
  fetchSeriesDetails,
  seriesData,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const seasons = seriesData.season_details;

  const handleOpenDetailsClick = () => {
    if (!seasons) {
      fetchSeriesDetails();
    }

    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        id="toggle-series-open"
        className={`${className} absolute top-1 right-1 inline-block z-50 w-7 h-7
      cursor-pointer`}
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
            className={`absolute left-0 top-0 w-full h-full py-2 origin-top
        bg-black/60 backdrop-blur-sm z-40 flex flex-col justify-start items-start`}
          >
            <div className="w-4/5 flex justify-start pl-1">
              <p className="text-sm font-semibold">{seriesData.name}</p>
            </div>
            <ul className="h-full w-full overflow-y-scroll hide-scrollbar">
              {seasons?.map((s) => (
                <li key={s.name}>
                  <h2 className="text-sm font-semibold pl-1 mt-1">{s.name}</h2>
                  <ul>
                    {s.episodes?.map((e) => (
                      <li
                        key={e.id}
                        className="text-sm h-8 pl-2 bg-black/40 mt-0.5
                    flex justify-between items-center relative whitespace-nowrap"
                      >
                        <p className="w-4/5 overflow-hidden">
                          <span className="text-xs font-semibold opacity-60">
                            {e.episode_number}
                          </span>{" "}
                          {e.name}
                        </p>
                        <CameraIcon
                          size={18}
                          color="white"
                          className={"absolute right-1"}
                        />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
