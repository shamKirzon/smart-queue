import { View, Text } from "react-native";
import { useRef, useEffect, useState } from "react";

const useWebSocket = (url: string) => {
  const ws = useRef<WebSocket | null>(null);
  const [statusResponse, setStatusResponse] = useState<Record<
    string,
    string
  > | null>(null);

  useEffect(() => {
    if (ws.current) return;

    ws.current = new WebSocket(url);

    // on open
    ws.current.onopen = () => {
      console.log("Connected to websocket");

      // to have a latest copy of the counters status
      requestStatus();
    };

    // incoming messages from backend (ws.send)
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "status-response") {
        setStatusResponse(data.status);
      }
     else  if (data.type === "set-status-data") {
       setStatusResponse(data.displayStatus)
      }
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

  useEffect(() => {

    console.log(statusResponse)
  }, [statusResponse])
  const sendMessage = (message: any) => {
    ws.current?.send(JSON.stringify(message));
  };

  // FUNCTIONS
  const requestStatus = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current?.send(JSON.stringify({ type: "get-status" }));
    }
  };

  const getCounterStatus = () => {
    return statusResponse;
  };

  const setCounterStatus = (counter: string) => {

    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current?.send(JSON.stringify({ type: "set-status", counter: counter, status: "active" }));
    }
  }

  return {setCounterStatus, sendMessage, };
};

export default useWebSocket;
