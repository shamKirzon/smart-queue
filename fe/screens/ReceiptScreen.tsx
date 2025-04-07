import { View, Text } from "react-native";
import React from "react";
import ReceiptBackground from "../assets/backgrounds/receipt-background.svg";
import { Dimensions } from "react-native"; // mahalaga to

// props -> properties na nilalaman ng components mo (ReceiptScreen.tsx)
// hakdog mani papcorn

interface ReceiptScreenProps {
  // contains key-value pairs ["name": "shammy"], object type
  navigation: any;
}

// destructuring -> kunukuha mo data dipende sa pwesto

const { width, height } = Dimensions.get("window");
// [width, height]

const ReceiptScreen: React.FC<ReceiptScreenProps> = ({ navigation }) => {

  //NOTESS: shift + alt + F = maaayos yung format ng code niyo haahha (if not works, download Prettier extension)


  // matik na yan lahat ng nandito  nagrrrender
  // pwede kayong maglagay ng logic part : )

  // JSX niyo na to   -> Javascript XML
  return (
    // design part niyo na to
    // para sumakop buong screen (flex: 1)
    <View style={{ flex: 1 }}>
      {/* // inline css                      // 40% ng height ng screen mo*/}
      <View style={{ backgroundColor: "green", height: height * 0.4 }}>
        <ReceiptBackground
          height={height * 0.8}
          width={width}
          preserveAspectRatio="none" // para di magadjust both height and width
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </View>
    </View>
  );
};

export default ReceiptScreen;
