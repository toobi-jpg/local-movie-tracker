import { useEffect, useState } from "react";
import { StarIcon } from "../icons/StarIcon";
import { motion } from "motion/react";

export default function ImdbInfo({ movieData }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImdbData = async () => {
      if (!movieData) return;
      try {
        let backendUrl;
        if (movieData.media_type === "movie") {
          backendUrl = `http://localhost:3001/tmdb/imdb-rating-movie/${movieData.id}`;
        } else {
          backendUrl = `http://localhost:3001/tmdb/imdb-rating-series/${movieData.id}`;
        }
        const response = await fetch(backendUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch IMDb info");
        }
        const imdbData = await response.json();
        if (imdbData) {
          setData(imdbData);
        }
      } catch (error) {
        console.log("Error fetching IMDb info", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImdbData();
  }, [movieData]);

  function formatString(stringNumber) {
    if (!stringNumber || typeof stringNumber !== "string") {
      return false;
    }

    const sanitizedString = stringNumber.replace(/[\$,]/g, "");
    const num = parseFloat(sanitizedString);

    if (isNaN(num)) {
      return false;
    }

    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 100000) {
      return (num / 1000).toFixed(0) + "K";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }

    return num.toString();
  }

  const formatedVotes = formatString(data?.imdbVotes);
  const formatedBoxOffice = formatString(data?.BoxOffice);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1, ease: "easeInOut" } }}
      exit={{ opacity: 0 }}
      className="text-[0.6rem] flex flex-col items-center w-full p-0.5"
    >
      <div className="flex justify-center items-center -translate-x-[8.5%]">
        <div className="w-5 h-5 relative">
          <StarIcon size={"100%"} className={"opacity-80"} color="#ffd000" />
        </div>
        <p className="font-semibold text-[0.8rem] translate-y-[8.5%]">
          {data.imdbRating}
        </p>
      </div>

      <div className="flex justify-center items-center text-center w-full">
        <p className="text-[0.65rem] font-semibold opacity-80 font-sans">
          {formatedVotes}
        </p>
      </div>

      {formatedBoxOffice && (
        <div className="flex justify-center items-center text-center w-full">
          <p className="text-[0.65rem] font-semibold font-sans opacity-80">
            ${formatedBoxOffice}
          </p>
        </div>
      )}
    </motion.div>
  );
}
