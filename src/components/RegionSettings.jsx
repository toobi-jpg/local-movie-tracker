import { SettingsContext } from "../context/SettingsContext";
import { useState, useContext, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { JustWatchIcon } from "../icons/JustWatchIcon";

export default function RegionSettings({ iconHovered }) {
  const { currentRegion, handleSetRegion, regionData } =
    useContext(SettingsContext);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedRegionObject = regionData.find(
    (r) => r.iso_3166_1 === currentRegion
  );
  const displayLabel = selectedRegionObject
    ? selectedRegionObject.english_name
    : "Select Region";

  const handleRegionSelect = (event, regionCode) => {
    event.preventDefault();

    handleSetRegion(regionCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <motion.div
      className={`min-w-[200px] h-full relative flex flex-col justify-start items-center`}
    >
      <div className="w-full max-w-xs mx-auto">
        <label id="region-label" className="block text-sm font-medium mb-2">
          Set region for release provider
        </label>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-full cursor-pointer rounded-md border border-white/5 bg-white/10 py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none sm:text-sm"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby="region-label"
          >
            <span className="block truncate">{displayLabel}</span>
          </button>

          {isOpen && (
            <div className="absolute z-10 mt-1 w-full rounded-md border border-white/5 bg-white/10 shadow-lg focus:outline-none">
              <ul
                className="max-h-20 overflow-auto rounded-md py-0 text-base ring-1 ring-black ring-opacity-5 hide-scrollbar"
                role="listbox"
                aria-labelledby="region-label"
              >
                {regionData.map((region) => (
                  <li
                    key={region.iso_3166_1}
                    onClick={(event) =>
                      handleRegionSelect(event, region.iso_3166_1)
                    }
                    className="relative cursor-pointer select-none 
                    py-1 pl-3 pr-9 hover:bg-white/10 text-xs"
                    role="option"
                    aria-selected={region.iso_3166_1 === currentRegion}
                  >
                    <span
                      className={`block truncate ${
                        region.iso_3166_1 === currentRegion
                          ? "font-semibold"
                          : "font-normal"
                      }`}
                    >
                      {region.english_name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {!isOpen && (
        <div className="absolute bottom-0 flex justify-center items-center gap-2 scale-80">
          <p>Powered by</p>
          <div className="flex justify-center items-center">
            <div className="h-5 w-5">
              <JustWatchIcon size={"100%"} color="#ffc400" />
            </div>
            <p className="text-[#ffc400]">JustWatch</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
