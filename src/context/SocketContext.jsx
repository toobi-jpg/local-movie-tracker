import React, { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";

// Create the single socket instance
const socket = io("http://localhost:3001");
const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    // This listener is set up once and will always catch the events
    function onConnect() {
      console.log("✅ Socket connected!");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("❌ Socket disconnected!");
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Cleanup listeners when the app unmounts
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // Provide both the socket instance and its connection status
  const value = { socket, isConnected };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
