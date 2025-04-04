import { View, Text, Dimensions } from "react-native";
import React, { useState } from "react";
import WelcomeScreen from "./screens/WelcomeScreen";
import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ReceiptProps } from "./types/ReceiptProps";
import TransactionScreen from "./screens/TransactionScreen";
import ReceiptScreen from "./screens/ReceiptScreen";
import HomeScreen from "./screens/HomeScreen";
import DimensionGuides from "./screens/DimensionsGuides";




// Get screen dimensions
const { width, height } = Dimensions.get("window");

const Stack = createNativeStackNavigator();

const App = () => {
  const [customerInfo, setCustomerInfo] = useState<ReceiptProps>({
    transaction: null,
    customerType: null,
    queueNumber: null,
    date: null,
    time: null,
    counter: null,
  });

  return (
    <SafeAreaProvider className="flex-1">
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="WelcomeScreen"
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
