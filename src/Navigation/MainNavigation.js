import React from "react";
import {View, Text} from "react-native";

import {createDrawerNavigator} from "@react-navigation/drawer";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";

import Footer from "./Footer.js";

function Temp() {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Text>TEMP</Text>
    </View>
  )
}

const Drawer = createDrawerNavigator();

function MainNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initlaRouteName="Home">
        <Drawer.Screen name="Home" component={Footer}/>
        <Drawer.Screen name="Saved Routes" component={Temp}/>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator;
