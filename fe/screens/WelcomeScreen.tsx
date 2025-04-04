import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React from "react";
import Logo from "../assets/logo.svg"

const { width, height } = Dimensions.get("window");
const logoHeight = height * 0.10
const logoWidth = width * 0.5


const WelcomeScreen = ({}) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-center ">

         {/* Logo, Title */}

         <Logo width={logoWidth} height={undefined} />

         
        
      </View>

      
    </ScrollView>
  );
};

export default WelcomeScreen;

