import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import "react-native-gesture-handler";
import MainNavigator from "./src/Navigation/MainNavigation.js"

export default function App() {
  return (
    <MainNavigator />
  );
}
