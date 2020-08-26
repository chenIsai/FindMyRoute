import React from "react";
import {View, Text} from "react-native";

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import MapScreen from "../Map/MapScreen.js";
import RunningScreen from "../Display/RunningScreen";
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
          } else if (route.name === "Map") {
            iconName = focused ? "map" : "map-outline"
          } else if (route.name === "Plan Your Route") {
            iconName = focused ? "map-marker" : "map-marker-plus-outline"
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: "#3fc0b7",
        inactiveTintColor: "#468abd",
        activeBackgroundColor: "#C6DEA6",
        inactiveBackgroundColor: "#ffdfdf"
      }}
      >
      <Tab.Screen name="Current Run" component={RunningScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
    </Tab.Navigator>
  );
}

export default Footer;
