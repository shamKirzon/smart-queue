import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
// Backgrounds
import Background from "../assets/backgrounds/monitor-background.svg";
// Selected Icons
import Logout from "../assets/icons/log-out.svg";

import { useWebSocketsApp } from "../websocket/WebSocketProvider";

const { width, height } = Dimensions.get("window");

interface MonitorScreenProps {
  navigation: any
}


//rendercounterBox soon.. for cleaning

const MonitorScreen: React.FC<MonitorScreenProps> = ({ navigation }) => {
  // Access websocket context
  const ws = useWebSocketsApp();


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

        {/* First row - Counter 1 to 4 */}
        <View style={{
          marginTop: height * 0.03,
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.33)",
          width: width * 0.84,
          borderRadius: 20,
          paddingVertical: 20,
        }}>
          <View style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "90%",
            gap: 10,
          }}>
            {/* Counter 1 */}
            <View style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              width: "48%",
              padding: 10,
              alignItems: "center",
            }}>
              <View style={{
                backgroundColor: "#D64F5A",
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginTop: 5,
                marginBottom: 10,
                alignItems: "center",
              }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 25 }}>Counter 1</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                {"000".split('').map((digit, index) => (
                  <Text key={index} style={{
                    color: "#D64F5A",
                    fontSize: 65,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 0.25)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}>
                    {digit}
                  </Text>
                ))}
              </View>
            </View>

            {/* Counter 2 */}
            <View style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              width: "48%",
              padding: 10,
              alignItems: "center",
            }}>
              <View style={{
                backgroundColor: "#D64F5A",
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginTop: 5,
                marginBottom: 10,
                alignItems: "center",
              }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 25 }}>Counter 2</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                {"000".split('').map((digit, index) => (
                  <Text key={index} style={{
                    color: "#D64F5A",
                    fontSize: 65,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 0.25)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}>
                    {digit}
                  </Text>
                ))}
              </View>
            </View>

            {/* Counter 3 */}
            <View style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              width: "48%",
              padding: 10,
              alignItems: "center",
            }}>
              <View style={{
                backgroundColor: "#D64F5A",
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginTop: 5,
                marginBottom: 10,
                alignItems: "center",
              }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 25 }}>Counter 3</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                {"000".split('').map((digit, index) => (
                  <Text key={index} style={{
                    color: "#D64F5A",
                    fontSize: 65,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 0.25)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}>
                    {digit}
                  </Text>
                ))}
              </View>
            </View>

            {/* Counter 4 */}
            <View style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              width: "48%",
              padding: 10,
              alignItems: "center",
            }}>
              <View style={{
                backgroundColor: "#D64F5A",
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginTop: 5,
                marginBottom: 10,
                alignItems: "center",
              }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 25 }}>Counter 4</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                {"000".split('').map((digit, index) => (
                  <Text key={index} style={{
                    color: "#D64F5A",
                    fontSize: 65,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 0.25)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}>
                    {digit}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Counter A1 and PRIORITY section */}
        <View style={{
          marginTop: height * 0.03,
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.33)",
          width: width * 0.84,
          borderRadius: 20,
          paddingVertical: 20,
        }}>
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
          }}>
            {/* Counter A1 */}
            <View style={{
              backgroundColor: "#D64F5A",
              borderRadius: 15,
              width: "48%",
              padding: 10,
              alignItems: "center",
            }}>
              <View style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginTop: 5,
                marginBottom: 10,
                alignItems: "center",
              }}>
                <Text style={{ color: "#D64F5A", fontWeight: "bold", fontSize: 25 }}>Counter A1</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                {"000".split('').map((digit, index) => (
                  <Text key={index} style={{
                    color: "#FFFFFF",
                    fontSize: 65,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 0.25)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
                  }}>
                    {digit}
                  </Text>
                ))}
              </View>
            </View>

            {/* PRIORITY */}
            <View style={{
              backgroundColor: "#D64F5A",
              borderRadius: 15,
              width: "48%",
              padding: 10,
              alignItems: "center",
            }}>
              <View style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                paddingVertical: 8,
                paddingHorizontal: 10,
                marginTop: 5,
                marginBottom: 10,
                alignItems: "center",
              }}>
                <Text style={{ color: "#D64F5A", fontWeight: "bold", fontSize: 25 }}>PRIORITY</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                {"000".split('').map((digit, index) => (
                  <Text key={index} style={{
                    color: "#FFFFFF",
                    fontSize: 65,
                    fontWeight: "bold",
                    textShadowColor: "rgba(0, 0, 0, 0.25)",
                    textShadowOffset: { width: 0, height: 2 },
                    textShadowRadius: 4,
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
  );
}

export default MonitorScreen;
