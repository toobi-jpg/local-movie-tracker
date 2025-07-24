import { useState } from "react";
import { EyeIcon } from "../../icons/EyeIcon";
import { NoCameraIcon } from "../../icons/NoCameraIcon";
import { CameraIcon } from "../../icons/CameraIcon";
import { EyeRemoveIcon } from "../../icons/EyeRemoveIcon";
import { motion } from "motion/react";

import Tooltip from "../Tooltip";

export default function RemoveButton({
  data,
  handleClickRemove,
  iconSize,
  isMovieReleased,
  className,
}) {
  const [hover, setHover] = useState(false);
  const [eyeHover, setEyeHover] = useState(false);

  return (
    <div>
      {!isMovieReleased ? (
        <button
          type="button"
          className={`${iconSize} md:group-hover:opacity-100 md:opacity-0 
      hover:scale-110 cursor-pointer transition-all duration-100 ease-in-out z-20
      ${className}`}
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
                  className={"scale-x-[-1] translate-x-[15%]"}
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
      ) : (
        <button
          type="button"
          className={`absolute top-2 right-2 ${iconSize} md:group-hover:opacity-100 md:opacity-0 hover:scale-110 cursor-pointer transition-all duration-100 ease-in-out z-20`}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={handleClickRemove}
        >
          <motion.div
            id="eye-icon"
            className="h-full "
            onMouseEnter={() => setEyeHover(true)}
            onMouseLeave={() => setEyeHover(false)}
          >
            <Tooltip text={"Remove from watchlist"} position="left">
              {!eyeHover ? (
                <EyeIcon
                  size={"100%"}
                  color="white"
                  key={data.id + "eye"}
                  className={"icon-shadow"}
                />
              ) : (
                <EyeRemoveIcon
                  size={"100%"}
                  color="white"
                  key={data.id + "eye remove"}
                  className={"icon-shadow"}
                />
              )}
            </Tooltip>
          </motion.div>
        </button>
      )}
    </div>
  );
}
