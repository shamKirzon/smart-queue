// params of each screen accepts

export type RootStackParamLists = {
  DimensionGuideScreen: undefined;
  WelcomeScreen: undefined;
  HomeScreen: undefined;
  TellerHomeScreen: undefined;
  MonitorScreen: undefined;
  TransactionScreen: undefined;

  ReceiptScreen:  {
    transaction: string | null;
    customerType: string | null;
    queueNumber: string | null;
    date: string | null;
    time: string | null;
  };

  TellerScreen:{
    counterName: string
  }

};
