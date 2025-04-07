import React, { useState, useEffect } from "react";
import { View, Text, Dimensions } from "react-native";
import WelcomeScreen from "./screens/WelcomeScreen";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ReceiptProps } from "./types/ReceiptProps";
import TransactionScreen from "./screens/TransactionScreen";
import ReceiptScreen from "./screens/ReceiptScreen";
import HomeScreen from "./screens/HomeScreen";
import DimensionGuides from "./screens/DimensionsGuides";
import  "./global.css"
import MonitorScreen from "./screens/MonitorScreen";
import TellerScreen from "./screens/TellerScreen";



// Get screen dimensions
const { width, height } = Dimensions.get("window");

const Stack = createNativeStackNavigator();

const App = () => {

  const [fontsLoaded] = useFonts({
    "RobotoMono": require("./assets/fonts/RobotoMono-Regular.ttf"),
    "RobotoMono-Bold": require("./assets/fonts/RobotoMono-Bold.ttf"),
    "RobotoMono-Bold-Italic": require("./assets/fonts/RobotoMono-BoldItalic.ttf"),
    "Poppins": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold-Italic": require("./assets/fonts/Poppins-BoldItalic.ttf"),
    "Poppins-Semi-Bold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Inter": require("./assets/fonts/Inter_18pt-Regular.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter_18pt-Bold.ttf"),
    "Inter-Bold-Italic": require("./assets/fonts/Inter_18pt-BoldItalic.ttf"),
  });

 
  const [customerInfo, setCustomerInfo] = useState<ReceiptProps>({
    transaction: null,
    customerType: null,
    queueNumber: null,
    date: null,
    time: null,
    counter: null,
  });

  
  return (
    <SafeAreaProvider className="flex-1 ">
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="TellerScreen"
          screenOptions={{
            headerShown: false,
            animation: "none",
            contentStyle: {
              paddingTop: height * 0.05, // 5% of screen height
            },
          }}
        >
          {/* DIMENSIONS GUIDES */}
          <Stack.Screen name="DimensionGuideScreen" component={DimensionGuides} />

          {/* WELCOME SCREEN */}
          
          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />

          {/* HOME SCREEN */}
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="TellerScreen" component={TellerScreen} />
          <Stack.Screen name="MonitorScreen" component={MonitorScreen} />

          {/* TRANSACTION SCREEN */}
          <Stack.Screen name="TransactionScreen">
            {(props: any) => (
              <TransactionScreen
                {...props}
                updateCustomerInfo={setCustomerInfo}
              />
            )}
          </Stack.Screen>

          {/* RECEIPT SCREEN */}
          <Stack.Screen name="ReceiptScreen">
            {(props: any) => <ReceiptScreen {...props} />}
          </Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
