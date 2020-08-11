import React, {useState, useContext} from "react";
import {View, Image} from "react-native";

import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer} from "@react-navigation/native";
import AuthContext from "../Context/AuthContext";
import AuthNavigator from "./AuthNavigator";

import Footer from "./Footer";
import Display from "../Display/Display";
import Images from "../Images/index";

const Drawer = createDrawerNavigator();

const AppNavigator = (props) => {
  const [isLoading, updateLoading] = useState(true);
  const tokens = useContext(AuthContext);

  if (props.loading) {
    return (
      <Loading />
    )
  } else if (!tokens.refreshToken) {
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    )
  }
  return (
    <NavigationContainer>
      <Drawer.Navigator initlaRouteName="Home">
        <Drawer.Screen name="Home" component={Footer} />
        <Drawer.Screen name="Saved Routes" component={Display}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const Loading = () => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#d3dae3"}}>
      <Image source={Images.logo300} />
    </View>
  )
}

export default AppNavigator;
