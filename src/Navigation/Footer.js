import React from "react";
import {View, Text} from "react-native";

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import MapScreen from "../Map/MapScreen.js";
import RunStack  from "./RunStack";
import "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

const Footer = () => {
  return (
    <Tab.Navigator lazy={false}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === "Current Run") {
            iconName = focused ? "run-fast" : "run"
          } else if (route.name === "Plan Your Route") {
            iconName = focused ? "map" : "map-outline"
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#468abd",
        inactiveTintColor: "#354d9c",
        activeBackgroundColor: "#C6DEA6",
        inactiveBackgroundColor: "#C6DEA6"
      }}
      >
      <Tab.Screen name="Current Run" component={RunStack} />
      <Tab.Screen name="Plan Your Route" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default Footer;
