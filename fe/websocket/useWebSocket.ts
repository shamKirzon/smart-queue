import { View, Text, requireNativeComponent } from "react-native";
import { useRef, useEffect, useState } from "react";

const useWebSocket = (url: string) => {
  const [status, setStatus] = useState<{ [key: string]: string }>({});
  const [currentRQNum, setCurrentRegularQueueNum] = useState<string | null>();
  const [currentOAQNum, setCurrentOpenAccountQueueNum] = useState<string | null>();
  const [currentPQNum, setCurrentPriorityQueueNum] = useState<string | null>();
  const ws = useRef<WebSocket | null>(null);

  
  const sendMessage = (message: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  const onMessage = (callback: (data: any) => void) => {
    if (ws.current) {
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        callback(data);
      };
    }
  };

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
      }
      else if (data.type === "teller-next-regular-be") {
        setCurrentRegularQueueNum(data.currentQueueNumber); 
      }
      else if (data.type === "teller-next-open-account-be") {
        setCurrentOpenAccountQueueNum(data.currentQueueNumber); 
      }
      else if (data.type === "teller-next-priority-be") {
        setCurrentPriorityQueueNum(data.currentQueueNumber); 
      }
      // fetching current queue number (without next logic)
      else if (data.type === "assign-regular-receipt-be") {
        const currentregular = data.currentRegularQueueNum;
        setCurrentRegularQueueNum(currentregular);
        
      }
      else if (data.type === "assign-open-account-receipt-be") {
        const currentId = data.currentOpenAccountQueueNum;
        setCurrentOpenAccountQueueNum(currentId);
      }
      else if (data.type === "assign-priority-account-receipt-be") {
        const currentId = data.setCurrentPriorityQueueNum;
        setCurrentPriorityQueueNum(currentId);
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


  // TESTING VARIABLES PART : 

useEffect(() => {
  console.log('this is my open account current queue number: ', currentOAQNum)
},[currentOAQNum])

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
    const assignOpenAccountReceipt= (counter: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "assign-open-account-receipt-fe", counter: counter })
      );
    }
  };

    const assignPriorityReceipt = (counter: string) => {
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
    assignOpenAccountReceipt, 
    assignPriorityReceipt,
    currentRQNum,
    currentOAQNum, 
    currentPQNum,
    insertvaluesregular,
    insertvaluespriority,
    insertvaluesopenaccount,
    sendMessage,
    onMessage,
    logout, 
  };
};

export default useWebSocket;
