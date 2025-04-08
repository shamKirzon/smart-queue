//di ko alam HAHAHAAHHAA
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react';
import { ReceiptProps } from '../types/ReceiptProps'
import { format } from "date-fns"
import Back from "../assets/icons/back.svg";
import Transactionbg from "../assets/backgrounds/transactionscreen-background.svg";
import Logo from "../assets/icons/logo.svg";
import Footerbg from "../assets/backgrounds/rectangle-background.svg";
//icons
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
//selectedIcon
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

const { width, height } = Dimensions.get("window");
const boxSize = width * 0.2;
const buttonWidth = width * 0.4;
const textM = width * 0.050;
const containerH = height * 0.2;
const containerW = width * 0.2;
const textL = width * 0.08;

interface TransactionProps {
  navigation: any,
  updateCustomerInfo: (CustomerInfo: ReceiptProps) => void;
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
        onPress={() => navigation.navigate("WelcomeScreen")}
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
            paddingTop: 16,
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
              paddingTop: height * 0.03,
              height: height * 0.5,
              width: width * 0.84,
              padding: 20,
              backgroundColor: "#BB2B35",
              borderRadius: 25,
              alignItems: "center",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Exit />
            <Text style={{ fontSize: width * 0.05, marginBottom: 20 }}>
              Transaction Verified
            </Text>
            
            <View>
            <TouchableOpacity
              onPress={closeModal}
              style={{
                backgroundColor: "#BC1823",
                padding: 10,
                borderRadius: 5,
                width: "50%",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: width * 0.04 }}>Exit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={closeModal}
              style={{
                backgroundColor: "#BC1823",
                padding: 10,
                borderRadius: 5,
                width: "50%",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: width * 0.04 }}>Proceed</Text>
            </TouchableOpacity>
            </View>
            
          </View>
        </View>
      </Modal>

    </View>
  );
};

export default TransactionScreen;