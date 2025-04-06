import { 
  View,
  Text,ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground } from 'react-native'
import React from 'react'
import { ReceiptProps } from '../types/ReceiptProps'
import {format} from "date-fns"
import Back from "../assets/icons/back.svg";
import Transactionbg from "../assets/backgrounds/transact.svg";
import Rectangle from "../assets/backgrounds/Rectangle.svg";
import Priority from "../assets/icons/priority.svg";
import Regular from "../assets/icons/regular.svg";
import Foreinexchange from "../assets/icons/foreignexchange.svg";
import Button from "../assets/backgrounds/button-background.svg";
import Withdraw from "../assets/icons/withdraw.svg";
import Deposit from "../assets/icons/deposit.svg";
import Logo from "../assets/icons/logo.svg";

const { width, height } = Dimensions.get("window");
const boxSize = width * 0.2;
const buttonWidth = width * 0.4;
const textM = width * 0.050;
const containerH = height * 0.2;
const containerW = width * 0.2;
const textL = width * 0.08;

interface TransactionProps{
  navigation: any, 
  updateCustomerInfo: (CustomerInfo: ReceiptProps) => void; 
}

//for Transaction Type props
const ActionButton: React.FC<{ text: string; onPress: () => void; image?: JSX.Element }> = ({onPress, image }) => (
  <View
    style={{
      width: width * 0.18,
      height: height * 0.08,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
    }}
  >
    <Button
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
      }}
    >
      {image && image}
    </TouchableOpacity>
  </View>
);

const TransactionScreen: React.FC<TransactionProps> = ({
  navigation,
  updateCustomerInfo,
}) => {
  const currentDate = format(new Date(), "MM/dd/yyyy").toString();
  const currentTime = format(new Date(), "hh:mm a").toString();

  return (
    <View style={{ flex: 1 }}>
      <Transactionbg 
        height={height * 1}
        width={width}
        preserveAspectRatio="none"
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

      <View style={{ alignItems: "center", gap: 1 }}>
        <View>
          <Logo 
            //LOGO
            width={width * 0.2}
            height={height * 0.1}
            style={{
              alignSelf: "center",
              marginTop: height * 0,
              height: containerH,
              width: containerW,
              borderRadius: 20,
              backgroundColor: "#FFFDFD",
            }}
          />
        </View> 
        
        <View style={{ alignItems: "center", marginTop: height * 0.0 }}>
          <Text
            style={{
              fontSize: textM,
              fontFamily: "Poppins-Bold",
              lineHeight: textM + 2,
              color: "#FFFFFF",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
              elevation: 5,
              textAlign: "center",
              width: width * 0.5,
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
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
              elevation: 5,
              textAlign: "center",
              width: width * 0.5
            }}
          >
            QUEUE
          </Text>
        </View>

        <View //startcustomerTypeBox
          style={{
            width: width * 0.9,
            height: height * 0.27,
            backgroundColor: 'white',
            borderColor: "black",
            
            borderWidth: 1,
            borderRadius: 15,
            padding: 10,
            gap: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,

          }}
        >
          <Text
            style={{
              fontSize: width * 0.050,
              color: "#BC1823",
            }}>
            Customer Type:
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: '100%' }}>
            <View
              style={{
                flex: 1,
                maxWidth: '45%',
                aspectRatio: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Button
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Priority />
                <Text style={{ fontSize: width * 0.05, color: "white", textAlign: "center" }}>Priority</Text>
              </TouchableOpacity>
            </View>
            
            <View
              style={{
                flex: 1,
                maxWidth: '45%',
                aspectRatio: 1,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Button
                width="100%"
                height="100%"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("HomeScreen")}
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: 5,
                }}
              >
                <Regular />
                <Text style={{ fontSize: width * 0.05, color: "white", textAlign: "center" }}>Regular</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* part na hindi pa responsive */}
        <Rectangle
          style={{
            position: 'absolute',
            top: height * 0.41,
            alignSelf: 'center',
            width: width * 0.9,
            height: height * 0.08,
            zIndex: 100,
          }}
        />


        <Text
          style={{
            paddingTop: height * 0.03,
            alignSelf: "flex-start",
            paddingLeft: width * 0.05,
            fontSize: width * 0.050,
            color: "#BC1823",
          }}>
          Transaction Type:
        </Text>
               
        {/* First row of transaction buttons */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-evenly',
          width: '100%',
          paddingHorizontal: width * 0.02,
          paddingTop: height * 0.01 
        }}>
          <View style={{ 
            flex: 1,
            maxWidth: width * 0.24,
            justifyContent: 'center', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <ActionButton 
              onPress={() => navigation.navigate("HomeScreen")} 
              image={<Withdraw />}
              text={''} 
            />
            <Text 
              
              adjustsFontSizeToFit={true}
              style={{ 
                marginTop: 5,
                fontSize: width * 0.04,
                textAlign: 'center',
                color: "#BC1823"
              }}
            >
              Withdraw
            </Text>
          </View>
          
          <View style={{ 
            flex: 1,
            maxWidth: width * 0.24,
            justifyContent: 'center', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <ActionButton 
              onPress={() => navigation.navigate("HomeScreen")} 
              image={<Deposit />} 
              text={''} 
            />
            <Text 
              
              adjustsFontSizeToFit={true}
              style={{ 
                marginTop: 5, 
                fontSize: width * 0.04, 
                textAlign: 'center',
                color: "#BC1823" 
              }}
            >
              Deposit
            </Text>
          </View>
          
          <View style={{ 
            flex: 1,
            maxWidth: width * 0.24,
            justifyContent: 'center', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <ActionButton 
              onPress={() => navigation.navigate("HomeScreen")} 
              image={<Foreinexchange />} 
              text={''} 
            />
            <Text 
              
              adjustsFontSizeToFit={true}
              style={{ 
                marginTop: 5, 
                fontSize: width * 0.04, 
                textAlign: 'center',
                color: "#BC1823" 
              }}
            >
              Exchange
            </Text>
          </View>
          
          <View style={{ 
            flex: 1,
            maxWidth: width * 0.24,
            justifyContent: 'center', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <ActionButton 
              onPress={() => navigation.navigate("HomeScreen")} 
              image={<Regular />} 
              text={''}
            />
            <Text 
              adjustsFontSizeToFit={true}
              style={{ 
                marginTop: 5, 
                fontSize: width * 0.04, 
                textAlign: 'center',
                color: "#BC1823" 
              }}
            >
              Loan
            </Text>
          </View>

        </View>

        {/* Second row of transaction buttons */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-evenly',
          width: '100%',
          paddingHorizontal: width * 0.02,
          paddingTop: height * 0.01 
        }}>
          <View style={{ 
            flex: 1,
            maxWidth: width * 0.24,
            justifyContent: 'center', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <ActionButton 
              onPress={() => navigation.navigate("HomeScreen")} 
              image={<Withdraw />}
              text={''} 
            />
            <Text 
              
              adjustsFontSizeToFit={true}
              style={{ 
                marginTop: 5,
                fontSize: width * 0.04,
                textAlign: 'center',
                color: "#BC1823"
              }}
            >
              Services
            </Text>
          </View>
          
          <View style={{ 
            flex: 1,
            maxWidth: width * 0.24,
            justifyContent: 'center', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <ActionButton 
              onPress={() => navigation.navigate("HomeScreen")} 
              image={<Deposit />} 
              text={''} 
            />
            <Text 
              adjustsFontSizeToFit={true}
              style={{ 
                marginTop: 5, 
                fontSize: width * 0.04, 
                textAlign: 'center',
                color: "#BC1823" 
              }}
            >
              Payment
            </Text>
          </View>
          
          <View style={{ 
            flex: 1,
            maxWidth: width * 0.24,
            justifyContent: 'center', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <ActionButton 
              onPress={() => navigation.navigate("HomeScreen")} 
              image={<Foreinexchange />} 
              text={''} 
            />
            <Text 
              adjustsFontSizeToFit={true}
              style={{ 
                marginTop: 5, 
                fontSize: width * 0.04, 
                textAlign: 'center',
                color: "#BC1823" 
              }}
            >
              Forex
            </Text>
          </View>
          
          <View style={{ 
            flex: 1,
            maxWidth: width * 0.24,
            justifyContent: 'center', 
            flexDirection: 'column', 
            alignItems: 'center' 
          }}>
            <ActionButton 
              onPress={() => navigation.navigate("HomeScreen")} 
              image={<Regular />} 
              text={''}
            />
            <Text 
              adjustsFontSizeToFit={true}
              style={{ 
                marginTop: 5, 
                fontSize: width * 0.04, 
                textAlign: 'center',
                color: "#BC1823" 
              }}
            >
              Open Account
            </Text>
          </View>
        </View>
      </View>
      

      <TouchableOpacity
        onPress={() => navigation.navigate("WelcomeScreen")}
        style={{
          width: width * 0.5,
          height: height * 0.07,
          justifyContent: "center",
          alignItems: "flex-end",
          position: 'absolute',
          bottom: height * 0.02,
          right: width * 0.07,
        }}
      >
        <Text style={{ fontSize: width * 0.07, color: "white", letterSpacing: 1, fontWeight: "bold" }}>
          Confirm {'>'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};


export default TransactionScreen;

