import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';
// Backgrounds
import Background from "../assets/backgrounds/monitor-background.svg";
// Selected Icons
import Logout from "../assets/icons/log-out.svg";

const { width, height } = Dimensions.get("window");

interface MonitorScreenProps {
  navigation: any
}

const MonitorScreen: React.FC<MonitorScreenProps> = ({ navigation }) => {
  
  //counter boxes
  const renderCounterBox = (title: string, number: string) => (
    <View style={{
      backgroundColor: "#FFFFFF",
      borderRadius: 15,
      width: "48%",
      padding: 10,
      alignItems: "center",
    }}>
      {/* Title bar */}
      <View style={{
        backgroundColor: "#E53935",
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 10,
        marginTop: 5,
        marginBottom: 10,
        alignItems: "center",
      }}>
        <Text style={{
          color: "#FFFFFF",
          fontWeight: "bold",
          fontSize: 25,
        }}>{title}</Text>
      </View>

      {/* Number display */}
      <View style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
      }}>
        {number.split('').map((digit, index) => (
          <Text
            key={index}
            style={{
              color: "#E53935",
              fontSize: 65,
              fontWeight: "bold",
              textShadowColor: "rgba(0, 0, 0, 0.25)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            }}
          >
            {digit}
          </Text>
        ))}
      </View>
    </View>
  );

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
        {/* NOW SERVING header */}
        <View style={{
          backgroundColor: "#FFFFFF",
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 10,
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#E53935"
          }}>NOW SERVING</Text>
        </View>

        <View
          style={{
            marginTop: height * 0.03,
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.33)",
            width: width * 0.84,
            borderRadius: 20,
            paddingVertical: 20,
          }}
        >
          {/* First row - Counter 1, 2, 3, and 4 */}
          <View style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "90%",
            gap: 10,
          }}>
            {renderCounterBox("Counter 1", "005")}
            {renderCounterBox("Counter 2", "005")}
            {renderCounterBox("Counter 3", "005")}
            {renderCounterBox("Counter 4", "005")}
          </View>
        </View>

        <View
          style={{
            marginTop: height * 0.03,
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.33)",
            width: width * 0.84,
            borderRadius: 20,
            paddingVertical: 20,
          }}
        >
          {/* Third row - Counter A1 & PRIORITY */}
          <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "90%",
          }}>
            {renderCounterBox("Counter A1", "005")}
            {renderCounterBox("PRIORITY", "005")}
          </View>
        </View>
      </View>
    </View>
  );
}

export default MonitorScreen;