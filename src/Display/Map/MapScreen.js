import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import MapDisplay from "./MapDisplay";
import SaveScreen from "./SaveScreen";

const Stack = createStackNavigator();

function MapScreen(props) {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Map"
        component={MapDisplay}
        options = {{headerShown: false}}/>
      <Stack.Screen name="SaveScreen"
        component={SaveScreen}
        options={{title: "Save Route",
        headerStyle: {
          backgroundColor: "#A8E3B4"
        }}}/>
    </Stack.Navigator>
  );
}

export default MapScreen;
