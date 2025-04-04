import { View, Text } from 'react-native'
import React from 'react'
import { ReceiptProps } from '../types/ReceiptProps'
import {format} from "date-fns"

interface TransactionProps{
  navigation: any, 
  updateCustomerInfo: (CustomerInfo: ReceiptProps) => void; 

}

const TransactionScreen: React.FC<TransactionProps> = ({navigation, updateCustomerInfo}) => {

  const currentDate = format(new Date(), "MM/dd/yyyy").toString()
  const currentTime = format(new Date(), "hh:mm a").toString()

  // use array mapping when deveoping the buttons or elements specially when the buttons has the same format. 


  // your logic nalang on pano ilalapat yung number of customer per counter dapat, 
                // counter 1 -> counter 2 -> counter 3. depending on their transaction and their customer type. 


  // insert this when the user confirm their transaction 
  // also your part is the confirmation. make a modal that will popup and display text. 
      // contains back or 'x' button and 'confirm' button. 

  // const customerInfo: ReceiptProps = {
  //   transaction: null,     -> take it what the user clicked. Use useState for this. 
  //   customerType: null,    -> same as the previous. 
  //   queueNumber: null,     -> format for this would be: [first letter of transaction][001] ex: D0001 -> deposit. (its up to you how many digit we use)
  //   date: null,    
  //   time: null,
  //   counter: null,
  // }


  // updateCustomerInfo(customerInfo) --> props that will be passed to our parent. 

  return (
    <View>
      <Text>TransactionScreen</Text>
      <Text>RinzThePogi</Text>
    </View>
  )
}

export default TransactionScreen