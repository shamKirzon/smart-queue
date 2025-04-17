import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Easing } from "react-native-reanimated";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import HomeBackground from "../assets/backgrounds/home-background.svg";
import { RootStackParamLists } from "../types/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";



type ReceiptRouteProp = RouteProp<RootStackParamLists, "ReceiptScreen">;
type ReceiptScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamLists,
  "ReceiptScreen"
>;
interface ReceiptScreenProps{
  route: ReceiptRouteProp, 
  navigation: ReceiptScreenNavigationProp
}
const { width } = Dimensions.get("window");

const ReceiptScreen: React.FC<ReceiptScreenProps> = ({route, navigation}) => {
  const [receiptPrinted, setReceiptPrinted] = useState(false);
  
  const { transaction, customerType, queueNumber, date, time } = route.params;

  console.log("Route params:", route.params);
  console.log("Transaction:", transaction);
  console.log("Customer Type:", customerType);
  console.log("Queue Number:", queueNumber);

  const receiptAnimation = useRef(new Animated.Value(-500)).current;
  const receiptOpacity = useRef(new Animated.Value(0)).current;
  const receiptScale = useRef(new Animated.Value(0.95)).current;
  const printerLightOpacity = useRef(new Animated.Value(0.4)).current;
  const printerSlotWidth = useRef(new Animated.Value(0)).current;

  const isPrinting = !receiptPrinted;
  const formattedDateTime =` ${date} • ${time}`;
  const AnimatedView = Animated.createAnimatedComponent(View);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([  
        Animated.timing(printerLightOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(printerLightOpacity, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(printerSlotWidth, {
      toValue: 280,
      duration: 800,
      useNativeDriver: false,
      easing: Easing.inOut(Easing.ease),
    }).start();

    const printingTimeout = setTimeout(() => {
      Animated.sequence([
        Animated.timing(receiptOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(receiptAnimation, {
            toValue: 0,
            duration: 2200,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(receiptScale, {
            toValue: 1,
            duration: 2200,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease),
          }),
        ]),
      ]).start(() => {
        setReceiptPrinted(true);
      });
    }, 1200);

    return () => clearTimeout(printingTimeout);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <HomeBackground
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      />

      <View style={{ flex: 1, alignItems: "center", width: "100%" }}>
        <View style={{ marginTop: 60, marginBottom: 40 }}>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: 24,
              textAlign: "center",
              opacity: isPrinting ? 1 : 0.7,
            }}
          >
            {isPrinting ? "Printing your queue receipt..." : "Receipt Printed"}
          </Text>
          {!isPrinting && (
            <Text
              style={{
                color: "white",
                fontSize: 16,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Please take your receipt
            </Text>
          )}
        </View>

        <View
          style={{
            width: 320,
            height: 64,
            backgroundColor: "#4B5563",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            position: "relative",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
            elevation: 5,
          }}
        >
          <View
            style={{
              position: "absolute",
              left: 20,
              top: 16,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#6B7280",
                marginRight: 8,
              }}
            />
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#6B7280",
              }}
            />
          </View>

          <Animated.View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#10B981",
              position: "absolute",
              top: 16,
              right: 20,
              opacity: printerLightOpacity,
            }}
          />

          <Animated.View
            style={{
              width: printerSlotWidth,
              height: 4,
              backgroundColor: "#1F2937",
              position: "absolute",
              bottom: 4,
              alignSelf: "center",
            }}
          />
        </View>

        <View style={{ width: 320, height: 450, overflow: "hidden" }}>
          <AnimatedView
            style={{
              width: "100%",
              backgroundColor: "white",
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              opacity: receiptOpacity,
              transform: [
                { translateY: receiptAnimation },
                { scale: receiptScale },
              ],
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontWeight: "bold", fontSize: 16, color: "#4B5563" }}>
                QUEUE NUMBER
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 64,
                  color: "black",
                  marginVertical: 8,
                }}
              >
                {queueNumber}
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>
                {formattedDateTime}
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: "#E5E7EB", marginVertical: 16 }} />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: "#6B7280" }}>Transaction</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#4B5563",
                  fontWeight: "bold",
                  maxWidth: "60%",
                  textAlign: "right",
                }}
              >
                {transaction}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 8,
              }}
            >
              <Text style={{ fontSize: 14, color: "#6B7280" }}>Customer Type</Text>
              <Text style={{ fontSize: 14, color: "#4B5563", fontWeight: "bold" }}>
                {customerType}
              </Text>
            </View>

            <View style={{ height: 1, backgroundColor: "#E5E7EB", marginVertical: 16 }} />

            <View style={{ alignItems: "center", marginVertical: 20 }}>
              <Text style={{ fontSize: 14, color: "#4B5563", textAlign: "center" }}>
                You will be served based on your queue number.
              </Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "#4B5563" }}>
                Have a nice day!
              </Text>
            </View>
          </AnimatedView>
        </View>

        <View style={{ position: "absolute", bottom: 0, width: "100%", height: 192 }}>
          <View
            style={{
              width: "100%",
              height: 192,
              opacity: 0.2,
              backgroundColor: "white",
              borderTopLeftRadius: 100,
              borderTopRightRadius: 100,
              transform: [{ scaleX: 1.5 }, { translateY: 96 }],
            }}
          />
        </View>
        
        {receiptPrinted && (
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 30,
              right: 30,
              backgroundColor: "transparent",
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "transparent",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => {
             navigation.navigate("TransactionScreen")
            }}
          >
            <Text style={{ color: "#BB2B35", fontWeight: "600", fontSize: 20, marginRight: 20 }}>
              Proceed 
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ReceiptScreen;