//di ko alam HAHAHAAHHAA
import React, { useState } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { receiptProps } from '../types/receiptProps';
import { format } from 'date-fns';
// Assets (Icons and Backgrounds)
import Back from "../assets/icons/back.svg";
import Logo from "../assets/icons/logo.svg";
import Priority from "../assets/icons/priority.svg";
import Regular from "../assets/icons/regular.svg";
import Withdraw from "../assets/icons/withdraw.svg";
import Deposit from "../assets/icons/deposit.svg";
import Transfer from "../assets/icons/transfer.svg";
import Loan from "../assets/icons/loan.svg";
import Services from "../assets/icons/services.svg";
import Payment from "../assets/icons/payment.svg";
import Forex from "../assets/icons/forex.svg";
import Openaccount from "../assets/icons/openaccount.svg";
import Confirm from "../assets/icons/confirm.svg";
import Exit from "../assets/icons/exit-modal.svg";
import Verified from "../assets/icons/verified.svg";
import Line from "../assets/icons/line.svg";
// Selected Icons
import SelectedPriority from "../assets/icons/selectedpriority.svg";
import SelectedRegular from "../assets/icons/selectedregular.svg";
import SelectedWithdraw from "../assets/icons/selectedwithdraw.svg";
import SelectedDeposit from "../assets/icons/selecteddeposit.svg";
import SelectedTransfer from "../assets/icons/selectedtransfer.svg";
import SelectedLoan from "../assets/icons/selectedloan.svg";
import SelectedServices from "../assets/icons/selectedservices.svg";
import SelectedPayment from "../assets/icons/selectedpayment.svg";
import SelectedForex from "../assets/icons/selectedforex.svg";
import SelectedOpenaccount from "../assets/icons/selectedopenaccount.svg";
// Backgrounds
import Transactionbg from "../assets/backgrounds/transactionscreen-background.svg";
import Footerbg from "../assets/backgrounds/rectangle-background.svg";
//import Modalbackground from "../assets/backgrounds/modal-background.svg"; not sure


const { width, height } = Dimensions.get("window");
const boxSize = width * 0.2;
const buttonWidth = width * 0.4;
const textM = width * 0.050;
const containerH = height * 0.2;
const containerW = width * 0.2;
const textL = width * 0.08;

interface TransactionProps {
  navigation: any,
  updateCustomerInfo: (CustomerInfo: receiptProps) => void;
}

const ActionButton: React.FC<{
  onPress: () => void;
  image?: JSX.Element;
  isSelected?: boolean;
  isDisabled?: boolean;
}> = ({ onPress, image, isSelected, isDisabled }) => (
  <View
    style={{
      width: width * 0.18,
      height: height * 0.08,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
      backgroundColor: isSelected ? "#BC1823" : "#FFFFFF",
      borderColor: "#BC1823",
      borderWidth: 1,
      opacity: isDisabled ? 0.5 : 1,
    }}
  >
    <TouchableOpacity
      onPress={!isDisabled ? onPress : undefined}
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
  const [selectedCustomerType, setSelectedCustomerType] = useState<string | null>(null);
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>([]);
  const [ModalVisible, setModalVisible] = useState(false);

  const isConfirmDisabled = selectedCustomerType === null || selectedTransactionTypes.length === 0;

  const handleConfirm = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectingtransactiontype = (type: string) => {
    const alreadySelected = selectedTransactionTypes.includes(type);

    if (type === "Open Account") {
      if (alreadySelected) {
        setSelectedTransactionTypes([]);
      } else {
        setSelectedTransactionTypes(["Open Account"]);
      }
    } else {
      if (selectedTransactionTypes.includes("Open Account")) {
        return;
      }

      if (alreadySelected) {
        const newList = selectedTransactionTypes.filter(item => item !== type);
        setSelectedTransactionTypes(newList);
      } else {
        if (selectedTransactionTypes.length < 3) {
          const newList = [...selectedTransactionTypes, type];
          setSelectedTransactionTypes(newList);
        }
      }
    }
  };

  // Array mapping for customer types
  const customerTypes = [
    {
      text: "Priority",
      icon: <Priority />,
      selectedIcon: <SelectedPriority />
    },
    {
      text: "Regular",
      icon: <Regular />,
      selectedIcon: <SelectedRegular />
    },
  ];

  // Array mapping for transaction types
  const transactionTypes1strow = [
    {
      text: "Withdraw",
      icon: <Withdraw />,
      selectedIcon: <SelectedWithdraw />,
      selectable: true,
    },
    {
      text: "Deposit",
      icon: <Deposit />,
      selectedIcon: <SelectedDeposit />,
      selectable: true,
    },
    {
      text: "Transfer",
      icon: <Transfer />,
      selectedIcon: <SelectedTransfer />,
      selectable: true,
    },
    {
      text: "Loan",
      icon: <Loan />,
      selectedIcon: <SelectedLoan />,
      selectable: true,
    },
  ];

  const transactionTypes2ndrow = [
    {
      text: "Services",
      icon: <Services />,
      selectedIcon: <SelectedServices />,
      selectable: true,
    },
    {
      text: "Payment",
      icon: <Payment />,
      selectedIcon: <SelectedPayment />,
      selectable: true,
    },
    {
      text: "Forex",
      icon: <Forex />,
      selectedIcon: <SelectedForex />,
      selectable: true,
    },
    {
      text: "Open Account",
      icon: <Openaccount />,
      selectedIcon: <SelectedOpenaccount />,
      selectable: true,
    },
  ];

  return (
    <View style={{ flex: 1, position: 'relative' }}>
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
        onPress={() => navigation.navigate("HomeScreen")}
      >
        <Back />
      </TouchableOpacity>

      <View style={{ alignItems: "center", gap: 1 }}>
        <View>
          <Logo
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
              paddingTop: 5,
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
              lineHeight: textL + 2,
              color: "#FFFFFF",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 4,
              elevation: 5,
              textAlign: "center",
              width: width * 0.5,
            }}
          >
            QUEUE
          </Text>
        </View>

        <View
          style={{
            width: width * 0.9,
            height: height * 0.27,
            paddingTop: 5,
            padding: 2,
            gap: 20,
          }}
        >
          <Text
            style={{
              fontSize: width * 0.050,
              color: "#BC1823",
            }}
          >
            Customer Type:
          </Text>

          <View //CustomerType Priority and Regular 
            style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%" }}>
            {customerTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedCustomerType((prev) => (prev === type.text ? null : type.text))}
                style={{
                  flex: 1,
                  maxWidth: "40%",
                  aspectRatio: 0.99,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 15,
                  overflow: "hidden",
                  backgroundColor: selectedCustomerType === type.text ? "#BC1823" : "#FFFFFF",
                  borderColor: "#BC1823",
                  borderWidth: 1,
                }}
              >
                {selectedCustomerType === type.text ? type.selectedIcon : type.icon}
                <Text style={{ fontSize: width * 0.05, color: selectedCustomerType === type.text ? "white" : "#BC1823", textAlign: "center" }}>{type.text}</Text>
              </TouchableOpacity>
            ))}
          </View>

        </View>

        <Text
          style={{
            paddingTop: height * 0.05,
            alignSelf: "flex-start",
            paddingLeft: width * 0.05,
            fontSize: width * 0.050,
            color: "#BC1823",
          }}
        > Transaction Type:
        </Text>

        {/* First row of transaction buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", paddingHorizontal: width * 0.02 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
            {transactionTypes1strow.map((type, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  maxWidth: width * 0.24,
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: selectedTransactionTypes.includes("Open Account")
                    ? (type.text === "Open Account" ? 1 : 0.5)
                    : (selectedTransactionTypes.length > 0 && type.text === "Open Account" ? 0.5 : 1),
                }}
              >
                <ActionButton
                  onPress={() => selectingtransactiontype(type.text)}
                  image={selectedTransactionTypes.includes(type.text) ? type.selectedIcon : type.icon}
                  isSelected={selectedTransactionTypes.includes(type.text)}
                  isDisabled={
                    selectedTransactionTypes.length > 0 &&
                    !selectedTransactionTypes.includes("Open Account") && type.text === "Open Account"
                  }
                />
                <Text
                  adjustsFontSizeToFit={true}
                  style={{
                    marginTop: 5,
                    fontSize: width * 0.04,
                    textAlign: "center",
                    color: "#BC1823",
                  }}
                >
                  {type.text}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Second row of transaction buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-evenly", width: "100%", paddingHorizontal: width * 0.02 }}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", width: "100%" }}>
            {transactionTypes2ndrow.map((type, index) => (
              <View
                key={index}
                style={{
                  flex: 1,
                  maxWidth: width * 0.24,
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: selectedTransactionTypes.includes("Open Account")
                    ? (type.text === "Open Account" ? 1 : 0.5)
                    : (selectedTransactionTypes.length > 0 && type.text === "Open Account" ? 0.5 : 1),
                }}
              >
                <ActionButton
                  onPress={() => selectingtransactiontype(type.text)}
                  image={selectedTransactionTypes.includes(type.text) ? type.selectedIcon : type.icon}
                  isSelected={selectedTransactionTypes.includes(type.text)}
                  isDisabled={
                    selectedTransactionTypes.length > 0 &&
                    !selectedTransactionTypes.includes("Open Account") &&
                    type.text === "Open Account"
                  }
                />
                <Text
                  adjustsFontSizeToFit={true}
                  style={{
                    marginTop: 5,
                    fontSize: width * 0.04,
                    textAlign: "center",
                    color: "#BC1823",
                  }}
                >
                  {type.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <Footerbg
        height={height * 0.08}
        width={width}
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          bottom: 0,
        }}
      />

      <TouchableOpacity
        onPress={handleConfirm}
        disabled={isConfirmDisabled}
        style={{
          width: width * 0.5,
          height: height * 0.07,
          justifyContent: "center",
          alignItems: "flex-end",
          position: "absolute",
          bottom: height * 0.01,
          right: width * 0.07,
          opacity: isConfirmDisabled ? 0.5 : 1,
        }}
      >
        <Text style={{ fontSize: width * 0.07, color: "white", fontWeight: "bold" }}>Confirm <Confirm /></Text>
      </TouchableOpacity>

      <Modal
        visible={ModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              height: height * 0.8,
              width: width * 0.84,
              borderRadius: 15,
              overflow: 'hidden',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <View
              style={{
                flex: 2,
                backgroundColor: '#D94A5A',
                padding: 20,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Verified />
              <Text style={{ 
                fontSize: width * 0.06, 
                marginTop: 5,
                color: "white",
                fontFamily: "Poppins-Semi-Bold",
              }}>
                Transaction Verified
              </Text>

              {selectedTransactionTypes.length > 0 && 
              selectedTransactionTypes.map((type, index) => (
              <Text
              key={index}
              style={{
                fontSize: width * 0.045,
                color: "white",
                textAlign: "center",
                fontFamily: "Poppins-Regular",
              }}
              >
                {type}
                </Text>
              ))
              }

              <Text style={{
                fontSize: width * 0.045,
                color: "white",
                fontFamily: "Poppins-Regular",
                height: "13%",
                width: "60%",
                borderRadius: 40,
                backgroundColor: 'rgba(255, 255, 255, 0.4)',
                textAlign: "center",
                lineHeight: height * 0.05,
              }}>
                {selectedCustomerType === "Priority"
                  ? "Priority Customer"
                  : selectedCustomerType === "Regular"
                  ? "Regular Customer"
                  : "None"}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: "white",
                padding: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{
                fontSize: width * 0.045,
                color: "#737373",
                marginBottom: 10,
              }}>
                {format(new Date(), "MMMM dd, yyyy • hh:mm a")}
              </Text>

              <Line style={{ marginVertical: 15, alignSelf: "center" }} />

              <View style={{
                flexDirection: "row",
                width: "100%",
                height: height * 0.06,
                justifyContent: "space-around",
              }}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)} 
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: 10,
                    borderRadius: 15,
                    width: "50%",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#737373",
                  }}
                >
                  <Text style={{ color: "#BB2B35", fontSize: 17, fontFamily: "Poppins-Semi-Bold" }}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                  }}
                  style={{
                    backgroundColor: "#D94A5A",
                    padding: 10,
                    borderRadius: 15,
                    width: "45%",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#FFFF", fontSize: 17, fontFamily: "Poppins-Semi-Bold"  }}>Proceed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default TransactionScreen;