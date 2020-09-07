import React, {useState, useContext, useRef} from "react";
import {Animated, Image} from "react-native";

import {createDrawerNavigator} from "@react-navigation/drawer";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import AuthContext from "../Context/AuthContext";
import AuthStack from "./AuthStack";

import Footer from "./Footer";
import DisplayRoutes from "../Display/DisplayRoutes";
import ProfileStack from "./ProfileStack";
import LegalStack from "./LegalStack";
import Images from "../Images/index";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AppNavigator = (props) => {
  const [animationFinished, updateStatus] = useState(false);
  const tokens = useContext(AuthContext);

  if (props.isLoading || !animationFinished) {
    return (
      <Loading isLoading={props.isLoading} update={updateStatus}/>
    )
  }
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions = {{headerShown: false}}>
      {!tokens.refreshToken ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : (
        <Stack.Screen name="Main" component={MainApp} />
      )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Loading = (props) => {
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const fadeOut = () => {
    Animated.timing(fadeAnimation, {toValue: 0, duration: 1000, useNativeDriver: true}).start(() => props.update(true));
  }
  if (!props.isLoading) {
    fadeOut();
  }
  return (
    <Animated.View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#C6FADF", opacity: fadeAnimation}}>
      <Image source={Images.logo} />
    </Animated.View>
  )
}

const MainApp = () => {
  return (
    <Drawer.Navigator initlaRouteName="Home">
      <Drawer.Screen name="Home" component={Footer} options={{title: "Home"}}/>
      <Drawer.Screen name="Saved Routes" component={DisplayRoutes}/>
      <Drawer.Screen name="Profile" component={ProfileStack} />
      <Drawer.Screen name="Legal" component={LegalStack} />
    </Drawer.Navigator>
  );
}

export default AppNavigator;
