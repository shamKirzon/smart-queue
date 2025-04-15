// params of each screen accepts

import { receiptProps } from "./receiptProps";

export type RootStackParamLists = {
  DimensionGuideScreen: undefined;
  WelcomeScreen: undefined;
  HomeScreen: undefined;
  TellerHomeScreen: undefined;
  MonitorScreen: undefined;
  TransactionScreen: undefined;
  ReceiptScreen: receiptProps;

  TellerScreen: {
    counterName: string;
  };

};
