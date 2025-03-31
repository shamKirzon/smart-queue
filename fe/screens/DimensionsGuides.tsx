import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";

interface WelcomeProps {
  navigation: any;
}



const { width, height } = Dimensions.get("window"); // Get screen width & height

const boxSize = width * 0.2; // (20% of screen width)
const buttonWidth = width * 0.4; // (40% of the screen's width)

/**
 * iwasan nating gumamit ng fix sizes like text-[30px] ... something like that. instead, use dynamic sizes na pinrovide in tailwind
 * example: text-3xl ... 
 * feel free to add another script na hindi na pasok sa tailwind like, text-40xl, wala namang ganyan diba? 
 * tailwind.config.js -> extend: {
 *      fontSize:{
 *          "9xl": "8rem"    
 * 
 *  }
 *  }
 */

const DimensionGuides: React.FC<WelcomeProps> = ({ navigation }) => {

    
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-center bg-gray-900 p-6">
        
        
        <Text className="text-3xl font-bold text-white mb-4 text-center">
         DIMENSION GUIDE
        </Text>
        <Text className="text-lg text-gray-300 mb-6 text-center">
          apply this codes in different screens for better ui/ux experience hahaha 
          located at ./screens/DimensionsGuides.tsx
        </Text>

        {/* fix box layout na may responsize sizes */}
        <View className="w-full flex-row justify-center gap-4">
          <View style={{ width: boxSize, height: boxSize }} className="bg-blue-500 rounded-lg items-center justify-center">
            <Text className="text-white text-lg font-bold">Box 1</Text>
          </View>
          <View style={{ width: boxSize, height: boxSize }} className="bg-red-500 rounded-lg items-center justify-center">
            <Text className="text-white text-lg font-bold">Box 2</Text>
          </View>
          <View style={{ width: boxSize, height: boxSize }} className="bg-green-500 rounded-lg items-center justify-center">
            <Text className="text-white text-lg font-bold">Box 3</Text>
          </View>
        </View>

        {/* action buttons natin  fix yung position , responsize size) */}
        <View className="mt-6 w-full flex-row justify-center gap-4">
          <TouchableOpacity style={{ width: buttonWidth }} className="bg-yellow-500 px-6 py-3 rounded-lg shadow-lg">
            <Text className="text-white text-lg font-semibold text-center">Option 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: buttonWidth }} className="bg-purple-600 px-6 py-3 rounded-lg shadow-lg">
            <Text className="text-white text-lg font-semibold text-center">Option 2</Text>
          </TouchableOpacity>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity style={{ width: buttonWidth }} className="bg-blue-600 px-6 py-3 rounded-lg shadow-lg mt-8">
          <Text className="text-white text-lg font-semibold text-center">Get Started</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

export default DimensionGuides;
