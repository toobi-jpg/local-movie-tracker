import { useState, useEffect, useRef, forwardRef } from "react";

const Search = forwardRef(({ searchResults }, ref) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (value) => {
    setInput(value);
  };

  const handleSubmit = () => {
    if (!input) {
      return;
    }

    handleSearch(input);
    setInput("");
    if (ref.current) {
      ref.current.value = "";
    }
  };

  const handleSearch = async (query) => {
    setError(null);

    try {
      const backendurl = `http://localhost:3001/tmdb/search/${encodeURIComponent(
        query
      )}`;
      const response = await fetch(backendurl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `http error: ${response.status}`);
      }
      const data = await response.json();
      searchResults(data.results || [], null);
    } catch (err) {
      console.log("error fetching search", err);
      setError(err.message);
    }
  };

  return (
    <>
      <div
        className="min-w-[420px] w-2/7 absolute bottom-5 border border-white/10
      bg-white/5 backdrop-blur-lg rounded-2xl px-4 py-3 shadow-md"
      >
        <input
          ref={ref}
          id="movie-search-input"
          type="text"
          className="w-full top-0 outline-none"
          placeholder="Search movie/tv-show"
          onChange={(event) => handleChange(event.target.value)}
          onKeyDown={(event) => event.key === "Enter" && handleSubmit()}
        />
      </div>
    </>
  );
});

export default Search;
