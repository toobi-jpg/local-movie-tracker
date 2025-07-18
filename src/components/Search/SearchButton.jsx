import SearchIcon from "../../icons/SearchIcon";
import Tooltip from "../Tooltip";

export default function SearchButton({ handleSearch, open }) {
  return (
    <Tooltip text={"Search Movies/Series"} position="left">
      <button
        className={`p-2 hover:bg-black/40
      w-11 h-11 bg-black/50 cursor-pointer group z-50 group backdrop-blur-md
      rounded-lg transition-all duration-200 ease-in-out border border-white/5
      ${open ? "opacity-0" : "opacity-100"}`}
        onClick={handleSearch}
      >
        <SearchIcon
          size={"100%"}
          className={
            "pointer-events-none z-0 group-hover:scale-80 transition-all duration-200 ease-in-out"
          }
        />
      </button>
    </Tooltip>
  );
}
