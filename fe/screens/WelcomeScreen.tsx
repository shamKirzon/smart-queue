import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";


const WelcomeScreen = () =>  {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-6">
      <Text className="text-2xl font-bold text-gray-800 mb-6">TESTING PART</Text>
      
      <TextInput
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-white"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-white"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        className="w-full bg-blue-500 p-3 rounded-lg items-center"
      >
        <Text className="text-white font-bold">Login</Text>
      </TouchableOpacity>
    </View>
  );
}

export default WelcomeScreen; 