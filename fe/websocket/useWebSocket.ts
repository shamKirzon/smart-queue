import { View, Text } from "react-native";
import { useRef, useEffect, useState } from "react";


type CounterStatus = {
  counter_name: string, 
  status: string
}

const useWebSocket = (url: string) => {
  const [status, setStatus ] = useState<{[key: string]: string}>({})
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (ws.current) return;

    ws.current = new WebSocket(url);

    // on open
    ws.current.onopen = () => {
      console.log("Connected to websocket");
      fetchCounterStatus()
    };

    // incoming messages from backend (ws.send)
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "set-counter-status") {
        setCounterStatus(data.data);
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

 


  // FUNCTIONS
  const fetchCounterStatus = () => {
    if (ws.current?.readyState == WebSocket.OPEN) {
      ws.current?.send(JSON.stringify({ type: "get-counter-status" }));
    }
  };

  const setToAvailable = (counter: string) => {
    if (ws.current?.readyState == WebSocket.OPEN) {
      ws.current?.send(JSON.stringify({ type: "set-counter-available", counter: counter}));
    }
  };
  
  const setToInuse = (counter: string ) => {
    if (ws.current?.readyState == WebSocket.OPEN) {
      ws.current?.send(JSON.stringify({ type: "set-counter-inuse" , counter: counter}));
    }
  };

  const setCounterStatus = (data: {counter_name: string, status: string}[]) => {
    const counterStatusMap: { [key: string]: string } = {};
  
    data.forEach(({ counter_name, status }) => {
      counterStatusMap[counter_name] = status;
    });

    setStatus(counterStatusMap)
    
  };

  const getCounterStatus = () => {
  
    return status; 
  }
  
  return { fetchCounterStatus, getCounterStatus, setToAvailable, setToInuse};
};

export default useWebSocket;
