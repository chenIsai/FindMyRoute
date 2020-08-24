import React from "react";
import {Text, AppState, Alert} from "react-native";

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import MapScreen from "../Map/MapScreen.js";
import RunningScreen from "../Display/RunningScreen.js";


import AsyncStorage from "@react-native-community/async-storage";

import "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

const Footer = () => {
  return (
    <Tab.Navigator lazy={false}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === "Display") {
            iconName = focused ? "run-fast" : "run"
          } else if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline"
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "skyblue",
        inactiveTintColor: "lightgreen",
      }}
      >
      <Tab.Screen name="Display" component={RunningScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default Footer;
