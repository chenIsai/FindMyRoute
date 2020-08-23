import React from "react";
import {Text, AppState, Alert} from "react-native";

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";

import MapScreen from "../Map/MapScreen.js";
import Summary from "../Display/Summary.js";


import AsyncStorage from "@react-native-community/async-storage";

import "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

const Footer = () => {
  return (
    <Tab.Navigator lazy={false}>
      <Tab.Screen name="Display" component={Summary} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default Footer;
