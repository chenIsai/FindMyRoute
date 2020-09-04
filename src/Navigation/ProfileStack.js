import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import MainScreen from "../Display/Profile/MainScreen";
import EditUsername from "../Display/Profile/EditUsername";
import EditPassword from "../Display/Profile/EditPassword";

const Stack = createStackNavigator();

const ProfileStack = (props) => {
  return (
    <Stack.Navigator screenOptions = {{headerShown: false}}>
      <Stack.Screen name={"Profile"} component={MainScreen}/>
      <Stack.Screen name={"EditNames"} component={EditUsername} />
      <Stack.Screen name={"EditPass"} component={EditPassword} />
    </Stack.Navigator>
  )
}

export default ProfileStack;
