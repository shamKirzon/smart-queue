import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import HomeBackground from "../assets/backgrounds/home-background.svg";
import TellerBottomBackground from "../assets/backgrounds/teller-bottom-background.svg";
import Back from "../assets/icons/back.svg";
import { RootStackParamLists } from "../types/types";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

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
  const { counterName } = route.params;

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
      <TouchableOpacity
        style={{
          marginTop: height * 0.08,
          paddingLeft: width * 0.08,
        }}
        onPress={() => navigation.navigate("TellerHomeScreen")}
      >
        <Back />
      </TouchableOpacity>

      <View style={{ justifyContent: "center", alignItems: "center" }}>
        {/* white container */}
        <View
          style={{
            marginTop: height * 0.05,
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
              width: width * 0.6,
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
          <View><Text>On Going </Text></View>
        </View>
      </View>
    </View>
  );
};

export default TellerScreen;
