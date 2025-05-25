import { createRef } from "react";
import { NavigationContainerRef } from "@react-navigation/native";
import { RootStackParamLists } from "./types/types";

export const navigationRef = createRef<NavigationContainerRef<RootStackParamLists>>();
