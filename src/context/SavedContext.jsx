import { useState, createContext, useEffect, useCallback } from "react";
import { useSocket } from "./SocketContext";

export const SavedContext = createContext();

export function SavedProvider({ children }) {
  const [saved, setSaved] = useState([]);
  const [released, setReleased] = useState([]);
  const { socket } = useSocket();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/storage/get-movies"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch initial movies.");
        }
        const storedData = await response.json();
        if (Array.isArray(storedData)) {
          setSaved(storedData);
          setReleased(storedData.filter((movie) => movie.scrapedDetails));
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    loadInitialData();

    const handleStorageUpdate = (updatedData) => {
      console.log("Received 'storage:updated' event from server.");
      if (Array.isArray(updatedData)) {
        setSaved(updatedData);

        setReleased(updatedData.filter((movie) => movie.scrapedDetails));
      }
    };

    socket.on("storage:updated", handleStorageUpdate);

    return () => {
      socket.off("storage:updated", handleStorageUpdate);
    };
  }, []);

  const handleSave = useCallback(async (data) => {
    try {
      await fetch("http://localhost:3001/storage/add-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          title: data.title,
          release_date: data.release_date,
          poster_path: data.poster_path,
        }),
      });
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  }, []);

  const handleRemove = useCallback(async (data) => {
    try {
      await fetch("http://localhost:3001/storage/remove-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.id }),
      });
    } catch (error) {
      console.error("Error removing movie:", error);
    }
  }, []);

  const values = {
    handleSave,
    handleRemove,
    saved,
    released,
  };

  return (
    <SavedContext.Provider value={values}>{children}</SavedContext.Provider>
  );
}
