import React, {useState, useContext, useRef} from "react";
import {View, Image} from "react-native";

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

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions = {{headerShown: false}}>
        {props.isLoading ? (
          <Stack.Screen name="Loading" component={Loading} />
         ) : (!tokens.refreshToken ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="Main" component={MainApp} />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Loading = () => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#C6FADF"}}>
      <Image source={Images.logo} />
    </View>
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
