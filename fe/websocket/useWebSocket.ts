import { View, Text, requireNativeComponent } from "react-native";
import { useRef, useEffect, useState } from "react";

const useWebSocket = (url: string) => {
  const [firstRowRegularTrigger, setFirstRowRegularTrigger] =
    useState<boolean | undefined>(undefined);
  const [firstRowPriorityTrigger, setFirstRowPriorityTrigger] =
   useState<boolean | undefined>(undefined);
  const [firstRowOpenAccountTrigger, setFirstRowOpenAccountTrigger] =
   useState<boolean | undefined>(undefined);
  const [status, setStatus] = useState<{ [key: string]: string }>({});
  const [currentRQNum, setCurrentRegularQueueNum] = useState<string | null>();
  const [currentOAQNum, setCurrentOpenAccountQueueNum] = useState<
    string | null
  >();
  const [currentPQNum, setCurrentPriorityQueueNum] = useState<string | null>();

  const ws = useRef<WebSocket | null>(null);
  let client = 0;

  const sendMessage = (message: object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  //eto di ko na ginamit, for specific na message lang pala itu
  const onMessage = (callback: (data: any) => void) => {
    if (ws.current) {
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        callback(data);
      };
    }
  };

  // useEffect(() => {
  //   console.log("latest queue number:", currentRQNum);
  // }, [currentRQNum]);

  useEffect(() => {
    if (ws.current) return;
    ws.current = new WebSocket(url);
    client++;

    ws.current.onopen = () => {
      console.log("Connected to WebSocket");
      fetchCounterStatus();
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "set-counter-status") {
        setCounterStatus(data.data);
      } 
      
      else if (data.type === "first-regular-insert-be") {
        data.response ? setFirstRowRegularTrigger((prev) => !prev) : false;
      } else if (data.type === "first-priority-insert-be") {
        data.response ? setFirstRowPriorityTrigger((prev) => !prev) : false;
      } else if (data.type === "first-openaccount-insert-be") {
        data.response ? setFirstRowOpenAccountTrigger((prev) => !prev) : false;
      } 
      
      
      else if (data.type === "teller-next-regular-be") {
        setCurrentRegularQueueNum(data.currentQueueNumber);
      } else if (data.type === "teller-next-open-account-be") {
        setCurrentOpenAccountQueueNum(data.currentQueueNumber);
      } else if (data.type === "teller-next-priority-be") {
        setCurrentPriorityQueueNum(data.currentQueueNumber);
      }
      // fetching current queue number (without next logic)
      else if (data.type === "assign-regular-receipt-be") {
        const currentregular = data.currentRegularQueueNum;
        setCurrentRegularQueueNum(currentregular);
      } else if (data.type === "assign-open-account-receipt-be") {
        const currentId = data.currentOpenAccountQueueNum;
        setCurrentOpenAccountQueueNum(currentId);
      } else if (data.type === "assign-priority-receipt-be") {
        const currentId = data.currentPriorityQueueNum;
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

  // first rows triggers
  useEffect(() => {
    console.log("REGULAR FIRST ROW TRIGGERS, ", firstRowRegularTrigger);
  }, [firstRowRegularTrigger]);

  useEffect(() => {
    console.log("OPEN ACCOUNT ROW TRIGGERS, ", firstRowOpenAccountTrigger);
  }, [firstRowOpenAccountTrigger]);

  useEffect(() => {
    console.log("PRIORITY FIRST ROW TRIGGERS, ", firstRowPriorityTrigger);
  }, [firstRowPriorityTrigger]);

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
  const assignOpenAccountReceipt = (counter: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "assign-open-account-receipt-fe",
          counter: counter,
        })
      );
    }
  };

  const assignPriorityReceipt = (counter: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "assign-priority-receipt-fe", counter: counter })
      );
    }
  };

  const tellerNext = (counter: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "teller-next-fe", counter }));
    }
  };

  const logout = (counter: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "logout", counter: counter }));
    }
  };

  //regular
  const insertvaluesregular = (
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("Sending data to WebSocket:", {
        transaction,
        customerType,
        queueNumber,
        date,
        time,
      });
      ws.current.send(
        JSON.stringify({
          type: "insert-data-regular",
          dataReceipt: {
            transaction,
            customerType,
            queueNumber,
            date,
            time,
          },
        })
      );
    }
  };

  //priority
  const insertvaluespriority = (
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("Sending data to WebSocket:", {
        transaction,
        customerType,
        queueNumber,
        date,
        time,
      });
      ws.current.send(
        JSON.stringify({
          type: "insert-data-priority",
          dataReceipt: {
            transaction,
            customerType,
            queueNumber,
            date,
            time,
          },
        })
      );
    }
  };

  //open account
  const insertvaluesopenaccount = (
    transaction: string[],
    customerType: string,
    queueNumber: string,
    date: string,
    time: string
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("Sending data to WebSocket:", {
        transaction,
        customerType,
        queueNumber,
        date,
        time,
      });
      ws.current.send(
        JSON.stringify({
          type: "insert-data-openaccount",
          dataReceipt: {
            transaction,
            customerType,
            queueNumber,
            date,
            time,
          },
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
    logout,
    firstRowRegularTrigger,
    firstRowPriorityTrigger,
    firstRowOpenAccountTrigger,
  };
};

export default useWebSocket;
