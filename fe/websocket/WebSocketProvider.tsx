import React, { createContext, useContext } from "react";
import useWebSocket from "./useWebSocket";
import WS_URL from '../constant/constant'

const WebSocketContext = createContext<ReturnType<typeof useWebSocket> |null>(null)

export const WebSocketProvider: React.FC<{children: React.ReactNode}> = ({children})=>{
    const socket = useWebSocket(WS_URL); 
    return <WebSocketContext.Provider value={socket}>{children}</WebSocketContext.Provider>
}


export const useWebSocketsApp = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
      throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
  };