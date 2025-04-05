import { View, Text } from 'react-native'
import React from 'react'
import { ReceiptProps } from '../types/ReceiptProps'

interface ReceiptScreenProps{
  navigation: any, 
  getInfo: ReceiptProps
}

const ReceiptScreen: React.FC<ReceiptScreenProps> = ({navigation , getInfo}) => {
  return (
    <View>
      <Text>{getInfo.customerType}</Text>
      <Text>{getInfo.transaction}</Text>
      
      <Text>ReceiptScreen</Text>
    </View>
  )
}

export default ReceiptScreen