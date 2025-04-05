import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Modal,
  StyleSheet,
  Pressable,
  Dimensions,
  TextInput,
} from "react-native";
import React, { useState, useRef, useEffect} from "react";
import HomeBackground from "../assets/backgrounds/home-background.svg";
import Back from "../assets/icons/back.svg";
import ExitModal from "../assets/icons/exit-modal.svg";
import Lock from "../assets/icons/lock.svg";

interface HomeScreenProps {
  navigation: any;
}
const { width, height } = Dimensions.get("window");

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  // Pins:
  const RECEIPT_GENERATOR_PIN = "1111";
  const TELLER_PIN = "2222";
  const MONITOR_PIN = "3333";

  const [buttonClicked, setButtonClicked] = useState("");
  const [enterPin, setEnterPin] = useState<string[]>([
    "",
    "",
    "",
    "",
  ]);
  const inputRef = useRef<(TextInput | null)[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  function handleEnterPin(pin: string, index: number) {
    const newPin = [...enterPin];
    newPin[index] = pin;
    setEnterPin(newPin);

    if (index < enterPin.length -1 && pin) {
      inputRef.current[index + 1]?.focus();
    }

    return console.log(enterPin)
  }
  useEffect(() => {
    if (enterPin.join("").length === 4) {
      handleConfirmPins();
    }
  }, [enterPin]);

  function handleDelete(pin: string, index: number) {
    const newPin = [...enterPin];
    newPin[index] = "";
    setEnterPin(newPin);
    inputRef.current[index - 1]?.focus();
  }

  function handleResetPin() {
    setEnterPin(["", "", "", ""]);
    inputRef.current[0]?.focus()

  }

  function handleConfirmPins() {
    const pin = enterPin.join("");
    if (
      buttonClicked === "Receipt Generator" &&
      pin === RECEIPT_GENERATOR_PIN
    ) {
      setModalVisible(false)
      handleResetPin(); 
      navigation.navigate("TransactionScreen");
     
    } else if (buttonClicked === "Teller" && pin === TELLER_PIN) {
      setModalVisible(false)
      handleResetPin()
      navigation.navigate("TellerScreen");

    } else if (buttonClicked === "Monitor" && pin === MONITOR_PIN) {
      setModalVisible(false)
      handleResetPin()
      navigation.navigate("MonitorScreen");
    } else {
      handleResetPin()
    }
    return console.log(buttonClicked, enterPin)
  }

  return (
    <View style={{ flex: 1 }}>
      <HomeBackground
        height={height * 0.8}
        width={width}
        preserveAspectRatio="none" // para di magadjust both height and width
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <TouchableOpacity
        style={{
          marginTop: height * 0.08,
          paddingLeft: width * 0.08,
        }}
        onPress={() => navigation.navigate("WelcomeScreen")}
      >
        <Back />
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* modal itself*/}
          <View
            style={{
              paddingTop: height * 0.03,
              height: height * 0.5,
              width: width * 0.84,
              backgroundColor: "white",
              borderRadius: 20,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            {/* Modal's content*/}

            <View style={{ width: width * 0.84 - 36, alignItems: "flex-end" }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <ExitModal />
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
              Admin
            </Text>

            <Text
              style={{
                fontFamily: "Inter",
                fontSize: width * 0.036,
                color: "black",
                lineHeight: width * 0.036 + 2,
              }}
            >
              Please enter your administrator Pin
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "center",
                marginTop: height * 0.04,
              }}
            >
              {enterPin.map((pin, index) => (
                <TextInput
                  key={index}
                  value={pin}
                  maxLength={1}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  autoCorrect={false}
                  autoComplete="off"
                  ref={(ref) => (inputRef.current[index] = ref)}
                  onChangeText={(pin) => {
                    handleEnterPin(pin, index);
                  }}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace") {
                      handleDelete(pin, index);
                    }
                  }}
                  style={{
                    backgroundColor: "#D9D9D9",
                    width: width * 0.16,
                    height: height * 0.09,
                    textAlign: "center",
                    borderRadius: 9,
                    fontSize: width * 0.06,
                    fontFamily: "Roboto",
                  }}
                ></TextInput>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Welcome, Text */}
      <View
        style={{
          justifyContent: "center",
          width: width,
          paddingLeft: width * 0.17,
          marginTop: height * 0.06,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins-Bold-Italic",
            fontSize: width * 0.09,
            color: "#FFF9F9",
            lineHeight: width * 0.09 + 2,
          }}
        >
          Welcome!
        </Text>

        <Text
          style={{
            fontFamily: "Poppins",
            fontSize: width * 0.05,
            color: "#FFF9F9",
            lineHeight: width * 0.05 + 2,
          }}
        >
          Select your role to proceed.
        </Text>
      </View>

      {/* choices part */}
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: height * 0.04,
        }}
      >
        {["Receipt Generator", "Teller", "Monitor"].map((choices, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setModalVisible(true);
              setButtonClicked(choices);
            }}
            style={{
              backgroundColor: "#FFFFFF",
              height: height * 0.1,
              width: width * 0.68,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 10,
              marginTop: height * 0.04,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 2,
              shadowRadius: 4,
              elevation: 9,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Semi-Bold",
                fontSize: width * 0.057,
                color: "#737373",
                lineHeight: width * 0.057 + 2,
              }}
            >
              {choices}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;
