import React, { useEffect, useRef, useState } from "react";
import { View, Text, Dimensions, TouchableOpacity, TextInput, Modal } from "react-native";
import Logo from "../assets/icons/logo.svg";
import StartBackground from "../assets/backgrounds/start-background.svg";
import Lock from "../assets/icons/lock.svg";
import { useFonts } from "expo-font";
import { useWebSocketsApp } from "../websocket/WebSocketProvider";

const { width, height } = Dimensions.get("window");
const textM = width * 0.1;
const textL = width * 0.14;
const textS = width * 0.035;
const containerH = height * 0.2;
const containerW = width * 0.4;
const padT = height * 2;

const RESET_PIN = "5555";

interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const { resetTransaction } = useWebSocketsApp();

  // PIN modal state
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetPin, setResetPin] = useState(["", "", "", ""]);
  const resetInputRef = useRef<(TextInput | null)[]>([]);

  function handleResetPinInput(pin: string, idx: number) {
    const newPin = [...resetPin];
    newPin[idx] = pin;
    setResetPin(newPin);
    if (idx < resetPin.length - 1 && pin) {
      resetInputRef.current[idx + 1]?.focus();
    }
  }
  function handleResetPinDelete(pin: string, idx: number) {
    const newPin = [...resetPin];
    newPin[idx] = "";
    setResetPin(newPin);
    resetInputRef.current[idx - 1]?.focus();
  }
  function handleResetPinClear() {
    setResetPin(["", "", "", ""]);
    resetInputRef.current[0]?.focus();
  }
  useEffect(() => {
    if (resetPin.join("").length === 4) {
      if (resetPin.join("") === RESET_PIN) {
        setResetModalVisible(false);
        handleResetPinClear();
        resetDayTransaction();
      } else {
        handleResetPinClear();
      }
    }
  }, [resetPin]);


  const resetDayTransaction = () => {

    resetTransaction();
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <StartBackground
        height={height * 0.8}
        width={width}
        preserveAspectRatio="none" // para di magadjust both height and width
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <View style={{ alignItems: "center", gap: 2 }}>
        {/* Logo */}
        <View
          style={{
            height: containerH,
            width: containerW,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFFDFD",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Logo width={containerW * 2} height={containerH * 1} />
          </View>
        </View>

        <View style={{ alignItems: "center", marginTop: height * 0.03 }}>
          <Text
            style={{
              fontSize: textM,
              fontFamily: "Poppins-Bold",
              lineHeight: textM + 2,
              color: "#FFFFFF",
            }}
          >
            SMART
          </Text>
          <Text
            style={{
              fontSize: textL,
              fontFamily: "Poppins-Bold",
              lineHeight: textL + 3,
              color: "#FFFFFF",
              shadowColor: "#000",
            }}
          >
            QUEUE
          </Text>
        </View>

        <Text
          style={{
            fontSize: textS,
            fontFamily: "Poppins",
            lineHeight: textS + 2,
            color: "#FFFFFF",
            marginTop: height * 0.03,
          }}
          className="text-[#FFFFFF]"
        >
          Skip the Wait, Stay in Control.
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => {navigation.navigate("HomeScreen")}}
        style={{
          width: width * 0.5,
          height: height * 0.07,
          backgroundColor: "#A52A2A",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 28,
          marginTop: height * 0.3,
           // i dont know why shadows only works on iphone
           shadowOffset: { width: 0, height: 2 }, // Shadow position
           shadowOpacity: 0.8, // Shadow transparency
           shadowRadius: 4, // Blur radius of the shadow
           elevation: 5, // Elevation for Android
        }}
      >
        <Text
          style={{
            fontSize: width * 0.07,
            color: "white",
            fontFamily: "Poppins-Bold",
            lineHeight: width * 0.07 + 9
          }}
        >
          PROCEED
        </Text>
      </TouchableOpacity>
      {/* Reset Button */}
      <TouchableOpacity
        onPress={() => setResetModalVisible(true)}
        style={{
          width: width * 0.5,
          height: height * 0.07,
          backgroundColor: "#808080",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 28,
          marginTop: height * 0.02,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: width * 0.07,
            color: "white",
            fontFamily: "Poppins-Bold",
            lineHeight: width * 0.07 + 9
          }}
        >
          RESET
        </Text>
      </TouchableOpacity>

      {/* Reset PIN Modal */}
      <Modal animationType="slide" transparent={true} visible={resetModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              paddingTop: height * 0.03,
              height: height * 0.5,
              width: width * 0.84,
              backgroundColor: "white",
              borderRadius: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View style={{ width: width * 0.84 - 36, alignItems: "flex-end" }}>
              <TouchableOpacity onPress={() => setResetModalVisible(false)}>
                <Text style={{ fontSize: 28, color: "#888" }}>×</Text>
              </TouchableOpacity>
            </View>
            <Lock height={width * 0.3} width={width * 0.37} />
            <Text
              style={{
                fontFamily: "Inter-Bold",
                fontSize: width * 0.06,
                color: "black",
                lineHeight: width * 0.06 + 2,
              }}
            >
              Authentication
            </Text>
            <Text
              style={{
                fontFamily: "Inter",
                fontSize: width * 0.036,
                color: "black",
                padding: height * 0.01,
                lineHeight: width * 0.036 + 2,
                textAlign: "center",
              }}
            >
              {/* Changed note for admin/manager */}
              Only authorized personnel may reset the system.
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center",
                marginTop: height * 0.04,
              }}
            >
              {resetPin.map((pin, idx) => (
                <TextInput
                  key={idx}
                  value={pin}
                  maxLength={1}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  autoCorrect={false}
                  autoComplete="off"
                  ref={ref => { resetInputRef.current[idx] = ref }}
                  onChangeText={pin => handleResetPinInput(pin, idx)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace") {
                      handleResetPinDelete(pin, idx);
                    }
                  }}
                  secureTextEntry={true}
                  style={{
                    backgroundColor: "#D9D9D9",
                    width: width * 0.16,
                    height: height * 0.09,
                    textAlign: "center",
                    borderRadius: 9,
                    fontSize: width * 0.06,
                    fontFamily: "Roboto",
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default WelcomeScreen;