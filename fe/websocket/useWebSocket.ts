import { View, Text, requireNativeComponent } from "react-native";
import { useRef, useEffect, useState } from "react";

const useWebSocket = (url: string) => {
  const [status, setStatus] = useState<{ [key: string]: string }>({});
  const [currentRQNum, setCurrentRegularQueueNum] = useState<string | null>();
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("latest queue number:", currentRQNum);
  }, [currentRQNum]);

  useEffect(() => {
    if (ws.current) return;

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("Connected to WebSocket");
      fetchCounterStatus();
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "set-counter-status") {
        setCounterStatus(data.data);
      } else if (data.type === "assign-regular-receipt-be") {
        const currentregular = data.currentRegularQueueNum;
        setCurrentRegularQueueNum(currentregular);
      }
    };

    ws.current.onerror = (error) => console.error("WebSocket error: ", error);

    ws.current.onclose = () => {
      console.log("Disconnected from WebSocket");
      ws.current = null;
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  // FUNCTIONS
  const fetchCounterStatus = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "get-counter-status" }));
    }
  };

  const setToAvailable = (counter: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "set-counter-available", counter })
      );
    }
  };

  const setToInuse = (counter: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "set-counter-inuse", counter }));
    }
  };

  const setCounterStatus = (
    data: { counter_name: string; status: string }[]
  ) => {
    const counterStatusMap: { [key: string]: string } = {};

    data.forEach(({ counter_name, status }) => {
      counterStatusMap[counter_name] = status;
    });

    setStatus(counterStatusMap);
  };

  const getCounterStatus = () => {
    return status;
  };

  const assignRegularReceipt = (counter: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "assign-regular-receipt-fe", counter: counter })
      );
    }
  };

  const tellerNext = (counter: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "teller-next-fe", counter }));
    }
  };
  
  const logout = (counter: string)=> {
    if(ws.current?.readyState ===WebSocket.OPEN){
      ws.current.send(JSON.stringify({type: "logout", counter: counter}))
    }
  }

  //regular
  const insertvaluesregular = (transaction: string[], customerType: string, queueNumber: string, date: string, time: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
     
      console.log("Sending data to WebSocket:", { transaction, customerType, queueNumber, date, time });
      ws.current.send(
        JSON.stringify({ 
          type: "insert-data-regular", 
          dataReceipt: {
            transaction,
            customerType,
            queueNumber,
            date,
            time
          } 
        })
      );
    }
  };

  //priority
  const insertvaluespriority= (transaction: string[], customerType: string, queueNumber: string, date: string, time: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("Sending data to WebSocket:", { transaction, customerType, queueNumber, date, time });
      ws.current.send(
        JSON.stringify({ 
          type: "insert-data-priority", 
          dataReceipt: {
            transaction,
            customerType,
            queueNumber,
            date,
            time
          } 
        })
      );
    }
  };

  //open account
  const insertvaluesopenaccount= (transaction: string[], customerType: string, queueNumber: string, date: string, time: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("Sending data to WebSocket:", { transaction, customerType, queueNumber, date, time });
      ws.current.send(
        JSON.stringify({ 
          type: "insert-data-openaccount", 
          dataReceipt: {
            transaction,
            customerType,
            queueNumber,
            date,
            time
          } 
        })
      );
    }
  };
  



  return {
    fetchCounterStatus,
    getCounterStatus,
    setToAvailable,
    setToInuse,
    tellerNext,
    assignRegularReceipt,
    currentRQNum,
    insertvaluesregular,
    insertvaluespriority,
    insertvaluesopenaccount,
    logout, 
  };
};

export default useWebSocket;
