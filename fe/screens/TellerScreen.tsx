import { View, Text } from 'react-native'
import React from 'react'


interface TellerScreenProps{
    navigation: any
}

const TellerScreen: React.FC<TellerScreenProps> = ({navigation}) => {
   return (
      <View className="flex-1 justify-center items-center bg-gray-200">
        <View className="bg-white p-6 rounded-lg shadow-lg">
          <Text className="text-4xl font-bold text-center text-gray-800">
            TELLER SCREEN ITO 
          </Text>
        </View>
      </View>
    );
}

export default TellerScreen