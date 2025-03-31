import { View, Text } from "react-native";
import { useRef, useEffect } from "react";

const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (ws.current) return;

    ws.current = new WebSocket(url);
    ws.current.onopen = () => console.log("Connected to websocket!");
    ws.current.onmessage = (event) => {
      console.log(`Received:  ${event.data}`);
    };
    ws.current.onerror = (error) => console.error("Websocket error: ", error);
    ws.current.onclose = () => {
      console.log("disconnected to websocket");
      ws.current = null;
    };

    return () => {
      ws.current?.close();
    };
  }, []); // ensuring our websocket initiliazes once

  const sendMessage = (message: string) => {
    ws.current?.send(message);
  };

  function tryLangs(){
    console.log("hello world hshshsh")
  } 
  

    return{sendMessage}
};

export default useWebSocket;
