import CameraBigIcon from "../icons/CameraBigIcon";
import { useState, useEffect } from "react";
import LoadingIcon from "../icons/LoadingIcon";

import Tooltip from "./Tooltip";

import { useSocket } from "../context/SocketContext";

export default function FullSearchButton() {
  const [isSearching, setIsSearching] = useState(false);
  const [isSingleSearching, setIsSingleSearching] = useState(false);

  const { socket } = useSocket();

  useEffect(() => {
    socket.on("search:start", (data) => {
      console.log(data.message);
      setIsSearching(true);
    });
    socket.on("single-search:start", (data) => {
      console.log(data.message);
      setIsSingleSearching(true);
    });

    socket.on("search:end", (data) => {
      console.log(data.message);
      setIsSearching(false);
    });
    socket.on("single-search:end", (data) => {
      console.log(data.message);
      setIsSingleSearching(false);
    });

    return () => {
      socket.off("search:start");
      socket.off("search:end");
      socket.off("single-search:start");
      socket.off("single-search:end");
    };
  }, []);

  const handleFullSearch = async () => {
    try {
      const backendurl = "http://localhost:3001/scrape/all";
      const response = await fetch(backendurl, {
        method: "POST",
      });
      const data = await response.json();
      if (response.status === 202) {
        console.log(data.message);
      } else {
        throw new Error(data.message || "Failed to start full scrape.");
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <Tooltip text={"Perform full tracked list search"}>
      <button
        className={`flex justify-center items-center
          w-6 h-6 cursor-pointer group z-50 group translate-y-0.5
          rounded-lg transition-all duration-200 ease-in-out`}
        onClick={() => handleFullSearch()}
      >
        {isSearching || isSingleSearching ? (
          <LoadingIcon className={"w-5 h-5"} />
        ) : (
          <CameraBigIcon
            size={"100%"}
            color="white"
            className={
              "pointer-events-none z-0 scale-x-[-1] transition-all duration-200 ease-in-out  opacity-80 group-hover:opacity-100 group-hover:-rotate-45"
            }
          />
        )}
      </button>
    </Tooltip>
  );
}
