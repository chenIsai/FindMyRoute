import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import MainScreen from "../Display/Settings/MainScreen";
import EditUsername from "../Display/Settings/EditUsername";
import EditPassword from "../Display/Settings/EditPassword";

const Stack = createStackNavigator();

const SettingsStack = (props) => {
  return (
    <Stack.Navigator screenOptions = {{headerShown: false}}>
      <Stack.Screen name={"Profile"} component={MainScreen}/>
      <Stack.Screen name={"EditNames"} component={EditUsername} />
      <Stack.Screen name={"EditPass"} component={EditPassword} />
    </Stack.Navigator>
  )
}

export default SettingsStack;
