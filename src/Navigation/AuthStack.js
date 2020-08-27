import React, {useState, useContext} from "react";
import {createStackNavigator} from "@react-navigation/stack";

import Login from "../Authentication/Login";
import SignUp from "../Authentication/SignUp";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

export default AuthStack;
