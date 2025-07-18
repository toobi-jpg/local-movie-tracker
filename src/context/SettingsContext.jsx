import { useState, useEffect, createContext } from "react";

export const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [regionData, setRegionData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      try {
        const [settingsResponse, regionsResponse] = await Promise.all([
          fetch("http://localhost:3001/settings"),
          fetch("http://localhost:3001/tmdb/get-regions"),
        ]);

        if (!settingsResponse.ok) throw new Error("Failed to fetch settings.");
        if (!regionsResponse.ok) throw new Error("Failed to fetch regions.");

        const settingsData = await settingsResponse.json();
        const regionsJson = await regionsResponse.json();

        setCurrentRegion(settingsData.regionCode);
        if (Array.isArray(regionsJson.results)) {
          setRegionData(regionsJson.results);
        }
      } catch (err) {
        console.error("Error loading initial data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleSetRegion = async (regionCode) => {
    setCurrentRegion(regionCode);

    try {
      const response = await fetch("http://localhost:3001/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regionCode }),
      });

      if (!response.ok) {
        let errorMsg = `Server responded with status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (jsonError) {}

        throw new Error(errorMsg);
      }

      console.log("Region updated successfully on the server.");
    } catch (err) {
      console.error("Error setting region:", err);
    }
  };

  const values = {
    regionData,
    currentRegion,
    handleSetRegion,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  );
}
