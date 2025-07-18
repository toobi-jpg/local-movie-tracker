import { useState, useEffect, createContext } from "react";

export const SimilarMoviesContext = createContext();

export function SimilarMoviesProvider({ children }) {
  const [similarMoviesData, setSimilarMoviesData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");

  const loadSimilarMovies = async (id, title) => {
    setIsOpen(true);
    setTitle(title);
    try {
      const backendurl = `http://localhost:3001/tmdb/similar/${id}`;
      const response = await fetch(backendurl);
      if (!response.ok) {
        throw new Error("Failed to fetch similar movies");
      }
      const initialData = await response.json();
      const data = initialData.results;
      if (Array.isArray(data)) {
        setSimilarMoviesData(data);
      }
    } catch (error) {
      console.log("Error fetching similar movies", error);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const values = {
    similarMoviesData,
    loadSimilarMovies,
    handleOpen,
    handleClose,
    isOpen,
    title,
  };

  return (
    <SimilarMoviesContext.Provider value={values}>
      {children}
    </SimilarMoviesContext.Provider>
  );
}
