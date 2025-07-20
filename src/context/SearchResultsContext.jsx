import { createContext, useState } from "react";

export const SearchResultsContext = createContext();

export function SearchResultsProvider({ children }) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);
  const [inputOpen, setInputOpen] = useState(false);

  const handleSearch = async (query) => {
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
      setSearchResults(data.results || [], null);
      setSearchQuery(query);
    } catch (err) {
      console.log("error fetching search", err);
    }
  };

  const values = {
    searchResults,
    handleSearch,
    searchQuery,
    setResultsOpen,
    resultsOpen,
    setInputOpen,
    inputOpen,
  };

  return (
    <SearchResultsContext.Provider value={values}>
      {children}
    </SearchResultsContext.Provider>
  );
}
