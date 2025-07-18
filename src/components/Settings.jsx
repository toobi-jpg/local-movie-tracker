import Tooltip from "./Tooltip";
import { SettingsIcon } from "../icons/SettingsIcon";
import { EarthIcon } from "../icons/EarthIcon";
import { ClockIcon } from "../icons/ClockIcon";
import { BellIcon } from "../icons/BellIcon";
import { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { SettingsContext } from "../context/SettingsContext";

import TimeSettings from "./TimeSettings";
import RegionSettings from "./RegionSettings";
import NotificationsSettings from "./NotificationsSettings";

export default function Settings(params) {
  const { currentRegion } = useContext(SettingsContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [earthHover, setEarthHover] = useState(false);
  const [clockHover, setClockHover] = useState(false);
  const [bellHover, setBellHover] = useState(false);
  const [iconHovered, setIconHovered] = useState(false);

  return (
    <motion.div
      id="settings-container"
      className={`p-2 group z-50 group gap-4 bg-black/50 hover:bg-black/90
      transition-[height,background-color] duration-300 ease-in-out
      border border-white/5 backdrop-blur-md hover:h-[170px] justify-start relative
      rounded-lg w-auto h-11 flex flex-col items-end overflow-y-hidden hover:overflow-visible
      ${iconHovered ? "border-l-0 rounded-tl-none rounded-bl-none" : ""}
      `}
      onMouseEnter={() => setIsMenuOpen(true)}
      onMouseLeave={() => setIsMenuOpen(false)}
    >
      <AnimatePresence>
        {iconHovered && (
          <motion.div
            exit={{
              width: 0,
              transition: { delay: 0.1 },
            }}
            initial={{ width: 0 }}
            animate={{ width: 300 }}
            className={`absolute top-[-0.5%] right-[35px] bg-black/90 
            rounded-lg rounded-tr-none rounded-br-none flex flex-col justify-center items-center
            border-r-0 border-white/5 border h-[170px] z-40 py-3 overflow-hidden`}
            onMouseEnter={() => (setIconHovered(true), setEarthHover(true))}
            onMouseLeave={() => (setIconHovered(false), setEarthHover(false))}
          >
            <AnimatePresence>
              {earthHover && <RegionSettings iconHovered={iconHovered} />}
              {clockHover && <TimeSettings iconHovered={iconHovered} />}
              {bellHover && <NotificationsSettings iconHovered={iconHovered} />}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        className={`w-6.5 h-6.5 flex justify-center
          items-center group-hover:scale-50 transition-all duration-200 ease-in-out`}
      >
        <SettingsIcon
          size={"100%"}
          color={"white"}
          className={"pointer-events-none z-50"}
        />
      </button>

      {/* {isMenuOpen && ( */}
      <motion.nav
        id="settings-nav"
        className={`absolute top-11 flex-col gap-4 flex
          ${earthHover ? "items-end" : ""}`}
      >
        <div
          id="country-settings-container"
          className="relative flex justify-end"
          onMouseEnter={() => (setEarthHover(true), setIconHovered(true))}
          onMouseLeave={() => (setEarthHover(false), setIconHovered(false))}
        >
          <button
            className={`w-6.5 h-6.5 flex
          justify-center items-center `}
          >
            <EarthIcon
              size={"100%"}
              color={"white"}
              className={"pointer-events-none z-50"}
            />
          </button>
        </div>

        <div
          id="country-settings-container"
          className="relative flex justify-end"
          onMouseEnter={() => (setBellHover(true), setIconHovered(true))}
          onMouseLeave={() => (setBellHover(false), setIconHovered(false))}
        >
          <button
            className={`w-6.5 h-6.5 flex
          justify-center items-center `}
          >
            <BellIcon
              size={"100%"}
              color={"white"}
              className={"pointer-events-none z-50"}
            />
          </button>
        </div>

        <div
          id="country-settings-container"
          className="relative flex justify-end"
          onMouseEnter={() => (setClockHover(true), setIconHovered(true))}
          onMouseLeave={() => (setClockHover(false), setIconHovered(false))}
        >
          <button
            className={`w-6.5 h-6.5 flex
          justify-center items-center `}
          >
            <ClockIcon
              size={"100%"}
              color={"white"}
              className={"pointer-events-none z-50"}
            />
          </button>
        </div>
      </motion.nav>
      {/* )} */}
    </motion.div>
  );
}
