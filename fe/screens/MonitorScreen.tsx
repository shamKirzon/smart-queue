import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
// Backgrounds
import Background from "../assets/backgrounds/monitor-background1.svg";
// Selected Icons
import Logout from "../assets/icons/log-out.svg";

//tago ko muna
import Logo from "../assets/icons/logomonitor.svg";

import { useWebSocketsApp } from "../websocket/WebSocketProvider";
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get("window");

interface MonitorScreenProps {
  navigation: any
}

const MonitorScreen: React.FC<MonitorScreenProps> = ({ navigation }) => {
  const { 
    monitorCounters, 
    getMonitorQueueData, 
    fetchCounterStatus,
    getCounterStatus: getCounterStatusObj 
  } = useWebSocketsApp();
  const [currentTime, setCurrentTime] = useState(new Date());
  const soundRef = useRef<Audio.Sound | null>(null);
  const prevCountersRef = useRef<{ [key: string]: string }>({});

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options).toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const playSound = async () => {
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/dingdong.mp3')
        );
        soundRef.current = sound;
        await sound.playAsync();
      } catch (e) {
      }
    };

    let shouldPlay = false;
    for (const key of Object.keys(monitorCounters)) {

      const prev = prevCountersRef.current[key]|| "000";
      const curr = monitorCounters[key] || "000";

      console.log("PREV:", prev )
      console.log("CUR:", curr )
      console.log("shammy pogi ")


      const prevSlice = prev ? prev.slice(1) : "000"
      const currSlice = curr ? curr.slice(1)  : "000";

      console.log("BEFORE VALIDATION: ")
      if (parseInt(currSlice, 10) >= 1 && prevSlice !== currSlice) {
        console.log("inside of validation")
        // shouldPlay = true;
        playSound()
        break;
      }
      
    }

    if (shouldPlay) {
      playSound();
    }

    prevCountersRef.current = { ...monitorCounters };
  }, [monitorCounters]);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    fetchCounterStatus();
    getMonitorQueueData();
  }, []);


  const getCounterStatus = (counterName: string) => {
    const statusObj = typeof getCounterStatusObj === "function"
      ? getCounterStatusObj()
      : undefined;
    if (!statusObj) return "inuse";
    let key = "";
    if (counterName.startsWith("Counter ")) {
      if (counterName === "Counter A1") key = "counter_A1";
      else if (counterName === "Counter P1") key = "counter_P1";
      else key = "counter_" + counterName.split(" ")[1];
    }

    if (Array.isArray(statusObj)) {
      return statusObj.find((c: any) => c.counter_name === key)?.status || "inuse";
    } else {
      return statusObj[key] || "inuse";
    }
  };

  const getDisplayQueueNumber = (counterName: string) => {
    return getCounterStatus(counterName) === "inuse"
      ? (monitorCounters[counterName] || "000")
      : "000";
  };

  const getCounterOpacity = (counterName: string) =>
    getCounterStatus(counterName) === "available" ? 0.4 : 1;

  return (
    

    <View style={{ flex: 1, position: 'relative' }}>
      <Background
        height={height}
        width={width}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      {/* Header with Logo and Date/Time */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: width * 0.08,
        paddingTop: height * 0.03,
        paddingBottom: height * 0.02,
      }}>
        {/* Smart Queue Text */}
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={{
            color: '#FFFFFF',
            fontSize: 18,
            fontWeight: 'bold',
            fontFamily: 'Poppins',
            textShadowColor: "rgba(0, 0, 0, 0.3)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}>
            SMART
          </Text>
          <Text style={{
            color: '#FFFFFF',
            fontSize: 28,
            fontWeight: 'bold',
            fontFamily: 'Poppins',
            textShadowColor: "rgba(0, 0, 0, 0.3)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
            marginTop: -5,
          }}>
            QUEUE
          </Text>
        </View>
        
        {/* Date and Time */}
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{
            color: '#FFFFFF',
            fontSize: 24,
            fontWeight: 'bold',
            textShadowColor: "rgba(0, 0, 0, 0.3)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}>
            {formatDate(currentTime)}
          </Text>
          <Text style={{
            color: '#FFFFFF',
            fontSize: 32,
            fontWeight: 'bold',
            textShadowColor: "rgba(0, 0, 0, 0.3)",
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}>
            {formatTime(currentTime)}
          </Text>
        </View>
      </View>

{/**

      <View>
        <TouchableOpacity
          style={{
            marginTop: height * 0.08,
            paddingLeft: width * 0.08,
          }}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Logout />
        </TouchableOpacity>
      </View>
 */
}



{/* regular */}

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View style={{
          backgroundColor: "#FFFFFF",
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
          marginTop: 10,
        }}>
          <Text style={{
            fontSize: 40,
            fontWeight: "bold",
            color: "#E53935"
          }}>NOW SERVING</Text>
        </View>


        {/* All Counters in One Row */}
        <View style={{
          marginTop: height * 0.03,
          flexDirection: "row",
          justifyContent: "space-between",
          width: width * 0.90,
          gap: 8,
        }}>
          {/* Left Section - Counter 1 to 4 */}
          <View style={{
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.33)",
            flex: 2,
            borderRadius: 15,
            paddingVertical: 15,
          }}>

            <View style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              width: "95%",
              gap: 10,
            }}>
              {/* Counter 1 */}
              <View style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                width: "48%",
                padding: 6,
                alignItems: "center",
                paddingTop: 15,
                opacity: getCounterOpacity("Counter 1"),
              }}>
                <View style={{
                  backgroundColor: "#D64F5A",
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  marginBottom: 6,
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter 1"),
                }}>
                  <Text style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    fontSize: 40,
                    paddingRight: 60,
                    paddingLeft: 60,
                    fontFamily: 'Poppins'
                  }}>
                    Counter 1
                  </Text>
                </View>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter 1"),
                }}>
                  {getDisplayQueueNumber("Counter 1").split('').map((digit, index) => (
                    <Text key={index} style={{
                      color: "#D64F5A",
                      fontSize: 95,
                      fontWeight: "bold",
                      textShadowColor: "rgba(0, 0, 0, 0.25)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {digit}
                    </Text>
                  ))}
                </View>
              </View>

              {/* Counter 2 */}
              <View style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                width: "48%",
                padding: 6,
                alignItems: "center",
                paddingTop: 15,
                opacity: getCounterOpacity("Counter 2"),
              }}>
                <View style={{
                  backgroundColor: "#D64F5A",
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  marginBottom: 6,
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter 2"),
                }}>
                  <Text style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    fontSize: 40,
                    paddingRight: 60,
                    paddingLeft: 60,
                    fontFamily: 'Poppins'
                  }}>
                    Counter 2
                  </Text>
                </View>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter 2"),
                }}>
                  {getDisplayQueueNumber("Counter 2").split('').map((digit, index) => (
                    <Text key={index} style={{
                      color: "#D64F5A",
                      fontSize: 95,
                      fontWeight: "bold",
                      textShadowColor: "rgba(0, 0, 0, 0.25)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {digit}
                    </Text>
                  ))}
                </View>
              </View>

              {/* Counter 3 */}
              <View style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                width: "48%",
                padding: 6,
                alignItems: "center",
                paddingTop: 15,
                opacity: getCounterOpacity("Counter 3"),
              }}>
                <View style={{
                  backgroundColor: "#D64F5A",
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  marginBottom: 6,
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter 3"),
                }}>
                  <Text style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    fontSize: 40,
                    paddingRight: 60,
                    paddingLeft: 60,
                    fontFamily: 'Poppins'
                  }}>
                    Counter 3
                  </Text>
                </View>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter 3"),
                }}>
                  {getDisplayQueueNumber("Counter 3").split('').map((digit, index) => (
                    <Text key={index} style={{
                      color: "#D64F5A",
                      fontSize: 95,
                      fontWeight: "bold",
                      textShadowColor: "rgba(0, 0, 0, 0.25)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {digit}
                    </Text>
                  ))}
                </View>
              </View>

              {/* Counter 4 */}
              <View style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                width: "48%",
                padding: 6,
                alignItems: "center",
                paddingTop: 15,
                opacity: getCounterOpacity("Counter 4"),
              }}>
                <View style={{
                  backgroundColor: "#D64F5A",
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  marginBottom: 6,
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter 4"),
                }}>
                  <Text style={{
                    color: "#FFFFFF",
                    fontWeight: "bold",
                    fontSize: 40,
                    paddingRight: 60,
                    paddingLeft: 60,
                    fontFamily: 'Poppins'
                  }}>
                    Counter 4
                  </Text>
                </View>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter 4"),
                }}>
                  {getDisplayQueueNumber("Counter 4").split('').map((digit, index) => (
                    <Text key={index} style={{
                      color: "#D64F5A",
                      fontSize: 95,
                      fontWeight: "bold",
                      textShadowColor: "rgba(0, 0, 0, 0.25)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {digit}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Right Section - Counter A1 and PRIORITY */}
          <View style={{
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.33)",
            flex: 1,
            borderRadius: 15,
            paddingVertical: 15,
          }}>
            <View style={{
              flexDirection: "column",
              justifyContent: "space-between",
              width: "95%",
              gap: 8,
            }}>
              {/* Counter A1 */}
              <View style={{
                backgroundColor: "#D64F5A",
                borderRadius: 10,
                padding: 6,
                alignItems: "center",
                paddingTop: 15,
                opacity: getCounterOpacity("Counter A1"),
              }}>
                <View style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 6,
                  paddingVertical: 4,
                  //paddingHorizontal: 2,
                  marginBottom: 6,
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter A1"),
                }}>
                  <Text style={{
                    color: "#D64F5A",
                    fontWeight: "bold",
                    fontSize: 37,
                    paddingRight: 60,
                    paddingLeft: 60,
                    fontFamily: 'Poppins',
                    textAlign: 'center'
                  }}>OPEN ACCOUNT</Text>
                </View>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter A1"),
                }}>
                  {getDisplayQueueNumber("Counter A1").split('').map((digit, index) => (
                    <Text key={index} style={{
                      color: "#FFFFFF",
                      fontSize: 95,
                      fontWeight: "bold",
                      textShadowColor: "rgba(0, 0, 0, 0.25)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {digit}
                    </Text>
                  ))}
                </View>
              </View>

              {/* PRIORITY */}
              <View style={{
                backgroundColor: "#D64F5A",
                borderRadius: 10,
                padding: 6,
                alignItems: "center",
                paddingTop: 15,
                opacity: getCounterOpacity("Counter P1"),
              }}>
                <View style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  marginBottom: 6,
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter P1"),
                }}>
                  <Text style={{
                    color: "#D64F5A",
                    fontWeight: "bold",
                    fontSize: 40,
                    paddingRight: 60,
                    paddingLeft: 60,
                    fontFamily: 'Poppins'
                  }}>PRIORITY</Text>
                </View>
                <View style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: getCounterOpacity("Counter P1"),
                }}>
                  {getDisplayQueueNumber("Counter P1").split('').map((digit, index) => (
                    <Text key={index} style={{
                      color: "#FFFFFF",
                      fontSize: 95,
                      fontWeight: "bold",
                      textShadowColor: "rgba(0, 0, 0, 0.25)",
                      textShadowOffset: { width: 0, height: 1 },
                      textShadowRadius: 2,
                    }}>
                      {digit}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>

        </View>
      </View>
    </View>
  );
}

export default MonitorScreen;