import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import "react-native-gesture-handler";
import ContextProvider from "./src/Context/ContextProvider";

export default function App() {
  return (
    <ContextProvider />
  );
}
