import React from "react";
import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import Logo from "../assets/icons/logo.svg";
import WelcomeBackground from "../assets/backgrounds/welcome-background.svg";
import { useFonts } from "expo-font";

const { width, height } = Dimensions.get("window");
const textM = width * 0.1;
const textL = width * 0.14;
const textS = width * 0.035;
const containerH = height * 0.2;
const containerW = width * 0.4;
const padT = height * 2;

interface WelcomeScreenProps {
  navigation: any;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <WelcomeBackground
        style={{
          position: "absolute",
          height: height * 0.8,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
      <View style={{ alignItems: "center", gap:2}}>
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

        <View style={{ alignItems: "center", marginTop: height * 0.03}}>
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
              // i dont know why shadows only works on iphone
              shadowOffset: { width: 0, height: 2 }, // Shadow position
              shadowOpacity: 0.8, // Shadow transparency
              shadowRadius: 4, // Blur radius of the shadow
              elevation: 5, // Elevation for Android 
            }}
            className="text-white text-[30px] font-bold shadow shadow-black"
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
            marginTop: height * 0.03
          }}
          className="text-[#FFFFFF]"
        >
          Skip the Wait, Stay in Control.
        </Text>
      </View>

      <TouchableOpacity
        //onPress={() => navigation.navigate("HomeScreen")}
        onPress={() => navigation.navigate("TransactionScreen")}
        style={{
          width: width * 0.5,
          height: height * 0.07,
          backgroundColor: "#A52A2A",

          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          marginTop: height * 0.3,
        }}
      >
        <Text style={{ fontSize: width * 0.07, color: "white" }}>PROCEED</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
