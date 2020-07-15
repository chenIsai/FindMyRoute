import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import "react-native-gesture-handler";
import FooterNavigator from "./src/FooterTabNavigation.js"

export default function App() {
  return (
    <FooterNavigator />
  );
}
