import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import MainScreen from "../Display/Profile/MainScreen";
import EditUsername from "../Display/Profile/EditUsername";
import EditPassword from "../Display/Profile/EditPassword";

const Stack = createStackNavigator();

const ProfileStack = (props) => {
  return (
    <Stack.Navigator screenOptions={{headerStyle: {backgroundColor: "#C6FADF"}}}>
      <Stack.Screen name={"Profile"} component={MainScreen} options={{headerShown: false}}/>
      <Stack.Screen name={"EditNames"} component={EditUsername} />
      <Stack.Screen name={"EditPass"} component={EditPassword} />
    </Stack.Navigator>
  )
}

export default ProfileStack;
