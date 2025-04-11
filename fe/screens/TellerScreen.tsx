import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import HomeBackground from "../assets/backgrounds/home-background.svg";
import TellerBottomBackground from "../assets/backgrounds/teller-bottom-background.svg";
import Back from "../assets/icons/back.svg";
import { RootStackParamLists } from "../types/types";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import LogoutTellerScreen from "../assets/icons/logout-teller-screen.svg";
import { useState } from "react";
import { Modal } from "react-native";
import Lock from "../assets/icons/lock.svg";

// sample from modals
import ExitModal from "../assets/icons/exit-modal.svg";

type TellerScreenRouteProp = RouteProp<RootStackParamLists, "TellerScreen">;
type TellerScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "TellerScreen"
>;

interface TellerScreenProps {
  route: TellerScreenRouteProp;
  navigation: TellerScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

const TellerScreen: React.FC<TellerScreenProps> = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { counterName } = route.params;

  const modalContent = (): JSX.Element => {
    return (
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Lock height={width * 0.33} width={width * 0.41} />
        <Text
          style={{
            marginTop: height * 0.01,
            fontFamily: "Inter-Bold",
            fontSize: width * 0.074,
            color: "black",
            lineHeight: width * 0.074 + 1,
          }}
        >
          Warning!
        </Text>

        <Text
          style={{
            marginTop: height * 0.01,
            fontFamily: "Inter",
            fontSize: width * 0.036,
            color: "black",
            lineHeight: width * 0.036 + 2,
            textAlign: "center",
            paddingLeft: height * 0.02,
            paddingRight: height * 0.02,
          }}
        >
          Closing this counter will prevent it from serving customers. Do you
          wish to proceed?
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: width * 0.84,
          }}
        >
          {["Cancel", "Yes, Proceed"].map((row, index) => (
            <TouchableOpacity
              key={index}
              style={{
                marginTop: height * 0.05,
                width: width * 0.33,
                backgroundColor:
                  row === "Cancel" ? "white" : "rgba(213, 0, 0, 0.74)",
                alignItems: "center",
                justifyContent: "center",
                height: height * 0.06,
                borderRadius: 10,
                marginRight: index !== row.length - 1 ? width * 0.04 : 0,
                // i dont know why shadows only works on iphone
                shadowOffset: { width: 0, height: 2 }, // Shadow position
                shadowOpacity: 0.8, // Shadow transparency
                shadowRadius: 4, // Blur radius of the shadow
                elevation: 5, // Elevation for Android
              }}
              onPress={() => {
                {
                  if (row === "Cancel") {
                    setModalVisible(false);
                  } else if (row === "Yes, Proceed") {
                    navigation.navigate("TellerHomeScreen");
                    setModalVisible(false);
                  }
                }
              }}
            >
              <Text
                style={{
                  fontSize: width * 0.04,
                  lineHeight: width * 0.07 + 8,
                  fontFamily: "Poppins-Semi-Bold",
                  color: row === "Cancel" ? "rgba(213, 0, 0, 0.74)" : "white",
                }}
              >
                {row}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <HomeBackground
        height={height * 0.87}
        width={width}
        preserveAspectRatio="none" // to have a control on your svg(height, width)
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />

      <TellerBottomBackground
        height={height * 0.08}
        width={width}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: 0,
        }}
      />

      {/* modal*/}
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

            {modalContent()}
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={{
          marginTop: height * 0.08,
          paddingLeft: width * 0.08,
        }}
        onPress={() => setModalVisible(true)}
      >
        <LogoutTellerScreen />
      </TouchableOpacity>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {/* white container */}
        <View
          style={{
            marginTop: height * 0.03,
            height: height * 0.68,
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            width: width * 0.84,
            borderRadius: 40,
          }}
        >
          {/* counter header container  */}
          <View
            style={{
              marginTop: height * 0.05,
              width: width * 0.65,
              backgroundColor: "rgba(213, 0, 0, 0.74)",
              borderRadius: 20,
              alignItems: "center",
              justifyContent: "center",
              height: height * 0.08,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: width * 0.08,
                color: "#FFF9F9",
                lineHeight: width * 0.08 + 10,
              }}
            >
              {counterName.toUpperCase()}
            </Text>
          </View>
          {/* current customer number  */}
          <Text
            style={{
              fontSize: width * 0.25,
              fontFamily: "RobotoMono-Bold",
              marginTop: height * 0.03,
              color: "rgba(213, 0, 0, 0.74)",
            }}
          >
            003
          </Text>
          {/* TEXT - "on going "  */}
          <Text
            style={{
              fontSize: width * 0.06,
              fontFamily: "Poppins-Semi-Bold",
              color: "rgba(213, 0, 0, 0.74)",
            }}
          >
            On Going{" "}
          </Text>
          {/* served  */}
          <View
            style={{
              marginTop: height * 0.05,
              width: width * 0.6,
              backgroundColor: "rgba(213, 0, 0, 0.74)",
              alignItems: "center",
              justifyContent: "center",
              height: height * 0.1,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: width * 0.08,
                color: "#FFF9F9",
                lineHeight: width * 0.08 + 3,
              }}
            >
              10
            </Text>

            <Text
              style={{
                fontFamily: "Poppins",
                fontSize: width * 0.055,
                color: "#FFF9F9",
                lineHeight: width * 0.0551 + 1,
              }}
            >
              Served
            </Text>
          </View>
          {/* Next*/}
          <View style={{ alignItems: "flex-end", width: width * 0.7 }}>
            <TouchableOpacity
              style={{
                marginTop: height * 0.05,
                width: width * 0.4,
                backgroundColor: "rgba(213, 0, 0, 0.74)",
                alignItems: "center",
                justifyContent: "center",
                height: height * 0.08,
                borderRadius: 15,
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
                  lineHeight: width * 0.07 + 8,
                  fontFamily: "Poppins-Semi-Bold",
                  color: "#FFFFFF",
                }}
              >
                Next{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TellerScreen;
