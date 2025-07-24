// import { useState } from "react";
import { useState } from "react";
import Tooltip from "../Tooltip";
import { CameraIcon } from "../../icons/CameraIcon";
import { EyeIcon } from "../../icons/EyeIcon";
import { EyeAddIcon } from "../../icons/EyeAddIcon";
import { motion } from "motion/react";

export default function AddButton({
  data,
  mediaHasAired,
  handleClickSave,
  iconSize,
  className,
}) {
  const [eyeHover, setEyeHover] = useState(false);

  return (
    <button
      type="button"
      className={`${iconSize} md:group-hover:opacity-100 md:opacity-0 
      hover:scale-110  ${
        !mediaHasAired ? "hover:-rotate-12" : ""
      } cursor-pointer transition-all duration-100 ease-in-out z-20
      ${className}`}
      onClick={handleClickSave}
    >
      {!mediaHasAired ? (
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
      ) : (
        <motion.div
          id="eye-icon"
          className="h-full "
          onMouseEnter={() => setEyeHover(true)}
          onMouseLeave={() => setEyeHover(false)}
        >
          <Tooltip text={"Add to watchlist"} position="left">
            {!eyeHover ? (
              <EyeIcon
                size={"100%"}
                color="white"
                key={data.id + "eye check"}
                className={"icon-shadow"}
              />
            ) : (
              <EyeAddIcon
                size={"100%"}
                color="white"
                key={data.id + "eye check"}
                className={"icon-shadow"}
              />
            )}
          </Tooltip>
        </motion.div>
      )}
    </button>
  );
}
