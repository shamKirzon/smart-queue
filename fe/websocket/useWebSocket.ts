import { View, Text, requireNativeComponent } from "react-native";
import { useRef, useEffect, useState } from "react";
import { transformWithEsbuild } from "vite";

const useWebSocket = (url: string) => {
  // const [WaitingRegular, setWaitingRegular] = useState<boolean>(false);

  const [status, setStatus] = useState<{ [key: string]: string }>({});
  const [counterTableRerender, setCounterTableRerender] = useState<boolean>(false)
  const [currentRQNum, setCurrentRegularQueueNum] = useState<
    string | null | undefined
  >();
  const [currentOAQNum, setCurrentOpenAccountQueueNum] = useState<
    string | null
  >();
  const [currentPQNum, setCurrentPriorityQueueNum] = useState<string | null>();
  const [nextQueueNumber, setNextQueueNumber] = useState<string | null>(null);
  const [currentQueueNumberWithCounter, setCurrentQueueNumberWithCounter] =
    useState<Record<string, string | null>>({});

  const [monitorCounters, setMonitorCounters] = useState<{
    [counter: string]: string;
  }>({});

  const ws = useRef<WebSocket | null>(null);
  let client = 0;

  // const sendMessage = (message: object) => {
  //   if (ws.current?.readyState === WebSocket.OPEN) {
  //     ws.current.send(JSON.stringify(message));
  //   }
  // };

  //eto di ko na ginamit, for specific na message lang pala itu
  const onMessage = (callback: (data: any) => void) => {
    if (ws.current) {
      ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        callback(data);
      };
    }
  };


  useEffect(() => {
    if (ws.current) return;
    ws.current = new WebSocket(url);
    client++;

    ws.current.onopen = () => {
      console.log("Connected to WebSocket");
      fetchCounterStatus();
      // Always request monitor queue data when socket opens
      ws.current?.send(JSON.stringify({ type: "get-monitor-queue-data" }));
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "set-counter-status") {
        console.log("counter status: ", data.data);
        setCounterStatus(data.data);
      } else if (data.type === "first-priority-insert-be") {
        // data.response ? setFirstRowPriorityTrigger((prev) => !prev) : false;
        if (data.response) {
          assignPriorityReceipt(data.counter);
        }
      } else if (data.type === "teller-next-regular-be") {
        setCurrentRegularQueueNum(data.currentQueueNumber);
      } else if (data.type === "teller-next-open-account-be") {
        setCurrentOpenAccountQueueNum(data.currentQueueNumber);
      } else if (data.type === "teller-next-priority-be") {
        setCurrentPriorityQueueNum(data.currentQueueNumber);
      }
      // fetching current queue number (without next logic) && first
      else if (data.type === "assign-regular-receipt-be") {
        const currentCounter = data.currentWaitingRegularCounter;
        const currentRegular = data.currentRegularQueueNum;

        const formattedCounterName = (name: string) => {
          const formattedString = name.replace(/_/g, " ");
          return (
            formattedString.charAt(0).toUpperCase() + formattedString.slice(1)
          );
        };

        // i have corresponding websocket logic about here.
        if (currentRegular && !currentCounter) {
          setCurrentRegularQueueNum(currentRegular);
        }
        // queue num. <= waiting regular counter
        else if (currentCounter) {
          setCurrentRegularQueueNum(currentRegular);
        }
      // } else if (data.type === "trigger-no-waiting-regular-counter") {
      //   setWaitingRegular(false);
      } else if (data.type === "assign-open-account-receipt-be") {
        const currentId = data.currentOpenAccountQueueNum;
        setCurrentOpenAccountQueueNum(currentId);
      } else if (data.type === "assign-priority-receipt-be") {
        const currentId = data.currentPriorityQueueNum;
        setCurrentPriorityQueueNum(currentId);
        //adding this for the next queue number
      } else if (data.type === "next-queue-number") {
        setNextQueueNumber(data.queueNumber);
      } else if (data.type === "get-current-queueNum-with-counter-be") {
        console.log("MY COUNTERS AND QUEUE NUMBER ", data.countersAndQueueNum);
        setCurrentQueueNumberWithCounter(data.countersAndQueueNum);
      } else if (data.type === "monitor-queue-data") {
        setMonitorCounters(data.data || {});
      }
      // rerender priority 
      else if(data.type === "counter-table-re-render"){
        setCounterTableRerender(prev => !prev)
      }
      else if (data.type === "reset-transaction-success") {
        console.log("Transaction reset successfully");
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

  const getNextQueueNumber = (
    customerType: "Regular" | "Priority" | "OpenAccount"
  ) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          type: "get-next-queue-number",
          customerType,
        })
      );
    }
  };

  const getMonitorQueueData = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: "get-monitor-queue-data" }));
    }
  };

  const getCurrentQueueNumberWithCounter = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({ type: "get-current-queueNum-with-counter" })
      );
    }
  };

  const triggerCounterTable = () => {
    setCounterTableRerender(prev => !prev)
  }


  const deleteTransaction = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      console.log("Sending reset transaction request to WebSocket");
      ws.current.send(JSON.stringify({ type: "reset-transaction" }));
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
    logout,
    nextQueueNumber,
    getNextQueueNumber,
    getMonitorQueueData,
    monitorCounters,
    getCurrentQueueNumberWithCounter,
    currentQueueNumberWithCounter,
    counterTableRerender, 
    triggerCounterTable,


    deleteTransaction,
  };
};

export default useWebSocket;
