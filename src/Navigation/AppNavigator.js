import React from "react";
import {View, Text} from "react-native";

import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer} from "@react-navigation/native";

import Footer from "./Footer";
import Display from "../Display/Display";

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initlaRouteName="Home">
        <Drawer.Screen name="Home" component={Footer} />
        <Drawer.Screen name="Saved Routes" component={Display}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
