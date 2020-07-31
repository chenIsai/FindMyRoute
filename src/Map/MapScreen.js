import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import MapDisplayWrapper from "./MapDisplayWrapper";
import SaveScreen from "./SaveScreen";

const Stack = createStackNavigator();

function MapScreen(props) {
  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Map" component={MapDisplayWrapper} />
      <Stack.Screen name="SaveScreen" component={SaveScreen} />
    </Stack.Navigator>
  );
}

export default MapScreen;
