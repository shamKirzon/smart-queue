import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
// Backgrounds
import Background from "../assets/backgrounds/monitor-background1.svg";
// Selected Icons
import Logout from "../assets/icons/log-out.svg";

//tago ko muna
import Logo from "../assets/icons/logomonitor.svg";

import { useWebSocketsApp } from "../websocket/WebSocketProvider";

const { width, height } = Dimensions.get("window");

interface MonitorScreenProps {
  navigation: any
}


const MonitorScreen: React.FC<MonitorScreenProps> = ({ navigation }) => {
  const { monitorCounters, getMonitorQueueData } = useWebSocketsApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    getMonitorQueueData();

    return () => {
      clearInterval(timer);
    };
  }, []);

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
              }}>
                <View style={{
                  backgroundColor: "#D64F5A",
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  marginBottom: 6,
                  alignItems: "center",
                }}>
                  <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 40, paddingRight: 60, paddingLeft: 60, fontFamily: 'Poppins' }}>Counter 1</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  {(monitorCounters["Counter 1"] || "000").split('').map((digit, index) => (
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
              }}>
                <View style={{
                  backgroundColor: "#D64F5A",
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  marginBottom: 6,
                  alignItems: "center",
                }}>
                  <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 40, paddingRight: 60, paddingLeft: 60, fontFamily: 'Poppins' }}>Counter 2</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  {(monitorCounters["Counter 2"] || "000").split('').map((digit, index) => (
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
              }}>
                <View style={{
                  backgroundColor: "#D64F5A",
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  marginBottom: 6,
                  alignItems: "center",
                }}>
                  <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 40, paddingRight: 60, paddingLeft: 60, fontFamily: 'Poppins' }}>Counter 3</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  {(monitorCounters["Counter 3"] || "000").split('').map((digit, index) => (
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
              }}>
                <View style={{
                  backgroundColor: "#D64F5A",
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  marginBottom: 6,
                  alignItems: "center",
                }}>
                  <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 40, paddingRight: 60, paddingLeft: 60, fontFamily: 'Poppins' }}>Counter 4</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  {(monitorCounters["Counter 4"] || "000").split('').map((digit, index) => (
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
              }}>
                <View style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 6,
                  paddingVertical: 4,
                  //paddingHorizontal: 2,
                  marginBottom: 6,
                  alignItems: "center",
                }}>
                  <Text style={{ color: "#D64F5A", fontWeight: "bold", fontSize: 37, paddingRight: 60, paddingLeft: 60, fontFamily: 'Poppins',textAlign: 'center' }}>OPEN ACCOUNT</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  {(monitorCounters["Counter A1"] || "000").split('').map((digit, index) => (
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
              }}>
                <View style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 6,
                  paddingVertical: 4,
                  paddingHorizontal: 6,
                  marginBottom: 6,
                  alignItems: "center",
                }}>
                  <Text style={{ color: "#D64F5A", fontWeight: "bold", fontSize: 40, paddingRight: 60, paddingLeft: 60, fontFamily: 'Poppins' }}>PRIORITY</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  {(monitorCounters["Counter P1"] || "000").split('').map((digit, index) => (
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