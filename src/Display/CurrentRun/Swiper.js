import React, {useState, createContext} from "react";
import {View, Text} from "react-native";

import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import RunDetails from "./RunDetails";
import Splits from "./Splits";

const Tab = createMaterialTopTabNavigator();

const Swiper = ({navigation}) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Run Details" component={RunDetails}/>
      <Tab.Screen name="Splits" component={Splits}/>
    </Tab.Navigator>
  )
}


export default Swiper;
