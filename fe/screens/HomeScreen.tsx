import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native'
import HomeBackground from '../assets/backgrounds/home-background.svg'

interface HomeScreenProps{
  navigation: any
}
const {width, height} = Dimensions.get("window")

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  return (
    <View className='flex-1 justify-center items-center'>
      <TouchableOpacity className='items-start'>
        <Text>BACK</Text>
      </TouchableOpacity>

      <View className='items-start'>
        <Text>Welcome!</Text>
        <Text>Select role to proceed</Text>
      </View>
    </View>
  )
}

export default HomeScreen