import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import TellerBackground from "../assets/backgrounds/teller-background.svg"; // issue here, merong white pixel na line (issue: background itself na)
import HomeBackground from "../assets/backgrounds/home-background.svg";
import TellerBottomBackground from "../assets/backgrounds/teller-bottom-background.svg";
import Back from "../assets/icons/back.svg";
import InUseStatus from "../assets/icons/in-use-status.svg";
import AvailableStatus from "../assets/icons/available-status.svg";
import TellerCounterSelect from "../assets/icons/teller-counter-select.svg";

interface TellerScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window");
const TellerScreen: React.FC<TellerScreenProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <HomeBackground
        height={height}
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
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Back />
      </TouchableOpacity>

      <View
        style={{
          width: width,
          marginTop: height * 0.03,
          paddingLeft: width * 0.08,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins-Bold",
            fontSize: width * 0.06,
            color: "#FFF9F9",
            lineHeight: width * 0.09 + 2,
          }}
        >
          Service Counter Selection
        </Text>

        <Text
          style={{
            fontFamily: "Poppins",
            fontSize: width * 0.037,
            color: "#FFF9F9",
            lineHeight: width * 0.037 + 1,
          }}
        >
          Please choose an available counter to begin serving customers.
        </Text>
      </View>

      {/* counters */}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            marginTop: height * 0.02,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.33)",
            width: width * 0.9,
            borderRadius: 10,
            padding: width*0.023
          }}
        >
          {[
            ["Counter 1", "Counter 2"],
            ["Counter 3", "Counter 4"],
          ].map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                flexDirection: "row",
                marginBottom: rowIndex !== row.length - 1 ? width * 0.028 : 0, // apply except sa last row, para pumantay
              }}
            >
              {row.map((counter, columnIndex) => (
                <View
                  key={columnIndex}
                  style={{
                    height: height * 0.14,
                    width: width * 0.41,
                    backgroundColor: "#FFFFFF",
                    paddingLeft: height * 0.02,
                    paddingRight: height * 0.016,
                    paddingTop: height * 0.01,
                    marginRight:
                      columnIndex !== row.length - 1 ? width * 0.028 : 0, // putting space except at the last part of view
                    borderRadius: 10,
                  }}
                >
                  {/* status*/}
                  <View style={{ alignItems: "flex-end" }}>
                    <View
                      style={{
                        borderColor: "#737373",
                        borderWidth: 1,
                        width: width * 0.18,
                        borderRadius: 10,
                        height: height * 0.02,
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <AvailableStatus
                        width={width * 0.02}
                        height={height * 0.009}
                      />
                      <Text
                        style={{
                          fontSize: width * 0.024,
                          color: "#737373",
                          fontFamily: "Poppins",
                          lineHeight: width * 0.037 + 1,
                          marginLeft: width * 0.01,
                        }}
                      >
                        Available
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: width * 0.037,
                      color: "#BC1823",
                      fontFamily: "Poppins-Bold",
                      lineHeight: width * 0.037 + 1,
                      marginTop: width * 0.04,
                    }}
                  >
                    {counter}{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: width * 0.029,
                      color: "#BC1823",
                      fontFamily: "Poppins",
                      paddingTop: height * 0.002,
                      lineHeight: width * 0.03 + 1,
                      paddingRight: width * 0.04,
                    }}
                  >
                    General Transaction
                  </Text>
                  <View style={{ alignItems: "flex-end" }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: width * 0.024,
                          color: "#737373",
                          fontFamily: "Poppins",
                          lineHeight: width * 0.037 + 1,
                          paddingRight: width * 0.01,
                        }}
                      >
                        Select
                      </Text>
                      <TellerCounterSelect
                        preserveAspectRatio="none"
                        width={width * 0.03}
                        height={height * 0.015}
                        

                        style={{alignSelf:"center"}}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View
        style={{
          width: width,
          marginTop: height * 0.03,
          paddingLeft: width * 0.08,
        }}
      >
        <Text
          style={{
            fontFamily: "Poppins-Bold",
            fontSize: width * 0.06,
            color: "#FFF9F9",
            lineHeight: width * 0.09 + 2,
          }}
        >
          Special Assistance Desk
        </Text>

        <Text
          style={{
            fontFamily: "Poppins",
            fontSize: width * 0.037,
            color: "#FFF9F9",
             lineHeight: width * 0.037 + 1,
          }}
        >
          Reserved for clients with special assistance requirements.
        </Text>
      </View>

      {/* counter - assitance desk */}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            marginTop: height * 0.02,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.33)",
            padding: width * 0.03, 
            width: width * 0.9,
            borderRadius: 10,
          }}
        >
          {[
            ["Counter A1", "Counter P1"],
          ].map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{
                flexDirection: "row",
              }}
            >
              {row.map((counter, columnIndex) => (
                <View
                  key={columnIndex}
                  style={{
                    height: height * 0.14,
                    width: width * 0.41,
                    backgroundColor: "#FFFFFF",
                    paddingLeft: height * 0.02,
                    paddingRight: height * 0.016,
                    paddingTop: height * 0.01,
                    marginRight:
                      columnIndex !== row.length - 1 ? width * 0.028 : 0, // putting space except at the last part of view
                    borderRadius: 10,
                  }}
                >
                  {/* status*/}
                  <View style={{ alignItems: "flex-end" }}>
                    <View
                      style={{
                        borderColor: "#737373",
                        borderWidth: 1,
                        width: width * 0.18,
                        borderRadius: 10,
                        height: height * 0.02,
                        backgroundColor: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <AvailableStatus
                        width={width * 0.02}
                        height={height * 0.009}
                      />
                      <Text
                        style={{
                          fontSize: width * 0.024,
                          color: "#737373",
                          fontFamily: "Poppins",
                          lineHeight: width * 0.037 + 1,
                          marginLeft: width * 0.01,
                        }}
                      >
                        Available
                      </Text>
                    </View>
                  </View>

                  <Text
                    style={{
                      fontSize: width * 0.037,
                      color: "#BC1823",
                      fontFamily: "Poppins-Bold",
                      lineHeight: width * 0.037 + 1,
                      marginTop: width * 0.04,
                    }}
                  >
                    {counter}{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: width * 0.029,
                      color: "#BC1823",
                      fontFamily: "Poppins",
                      paddingTop: height * 0.002,
                      lineHeight: width * 0.03 + 1,
                      paddingRight: width * 0.04,
                    }}
                  >
                    General Transaction
                  </Text>
                  <View style={{ alignItems: "flex-end" }}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontSize: width * 0.024,
                          color: "#737373",
                          fontFamily: "Poppins",
                          lineHeight: width * 0.037 + 1,
                          paddingRight: width * 0.01,
                        }}
                      >
                        Select
                      </Text>
                      <TellerCounterSelect
                        preserveAspectRatio="none"
                        width={width * 0.03}
                        height={height * 0.015}
                        

                        style={{alignSelf:"center"}}
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default TellerScreen;
