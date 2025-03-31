import { View, Text, TouchableOpacity, Dimensions, ScrollView } from "react-native";

interface WelcomeProps {
  navigation: any;
}

const { width, height } = Dimensions.get("window"); // Get screen width & height

const boxSize = width * 0.2; // Boxes adjust size dynamically (20% of screen width)
const buttonWidth = width * 0.4; // Buttons adjust to 40% of screen width

const DimensionGuides: React.FC<WelcomeProps> = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-center bg-gray-900 p-6">
        
        {/* Header Text */}
        <Text className="text-3xl font-bold text-white mb-4 text-center">
          YOUR DIMENSION GUIDE
        </Text>
        <Text className="text-lg text-gray-300 mb-6 text-center">
          apply this codes in different screens for better ui/ux experience hahaha 
          located at ./screens/DimensionsGuides.tsx
        </Text>

        {/* Static Box Layout with Responsive Sizes */}
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

        {/* Action Buttons (Fixed Position, Responsive Size) */}
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
