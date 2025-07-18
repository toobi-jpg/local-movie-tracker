import { useState, useRef, useEffect } from "react";
import Poster from "./Poster";
import ScrollContainer from "react-indiana-drag-scroll";
import { StopWatchIcon } from "../icons/StopWatchIcon";

export default function Popular() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const fetchUpcomingMovies = async (dateToday, dateFuture) => {
    try {
      const backendurl = `http://localhost:3001/tmdb/upcoming-movies?date=${dateToday}&endDate=${dateFuture}`;
      const response = await fetch(backendurl);
      if (!response.ok) {
        const ErrorData = await response.json();
        throw new Error(ErrorData.error || "http-error:", response.status);
      }
      const initialData = await response.json();
      const data = initialData.results;

      setResults(data || []);
    } catch (err) {
      console.log("error fetching trending movies", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    const today = new Date();
    const formattedDateToday = today.toISOString().slice(0, 10);
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 6);
    const formattedDateFuture = futureDate.toISOString().slice(0, 10);

    fetchUpcomingMovies(formattedDateToday, formattedDateFuture);
  }, []);

  return (
    <div
      className="relative w-full justify-center 
    items-center flex z-0"
    >
      <div className="relative w-full h-full items-center">
        <div className="absolute -top-5 left-0 flex justify-center items-center gap-1">
          <h1 className="text-2xl text-shadow-lg">Upcoming</h1>
          <StopWatchIcon size={"1.6rem"} className={"opacity-80 cinema"} />
        </div>

        <ScrollContainer
          className="relative w-full h-full flex gap-[20px] 
          items-center overflow-x-scroll py-4"
        >
          {results.map((item) => (
            <Poster data={item} key={item.id} />
          ))}
        </ScrollContainer>
      </div>
    </div>
  );
}
