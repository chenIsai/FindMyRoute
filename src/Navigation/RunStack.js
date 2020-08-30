import React, {useState, useContext} from "react";
import {createStackNavigator} from "@react-navigation/stack";

import SaveScreen from "../Display/CurrentRun/SaveScreen";
import RunView from "../Display/CurrentRun/RunView";

const Stack = createStackNavigator();

const RunStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Run" component={RunView} />
      <Stack.Screen name="SaveScreen" component={SaveScreen} />
    </Stack.Navigator>
  );
}

export default RunStack;
