import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Selector from "../Display/Legal/Selector";
import TermsOfService from "../Display/Legal/TermsOfService";
import PrivacyPolicy from "../Display/Legal/PrivacyPolicy";
import Licenses from "../Display/Legal/Licenses";

const Stack = createStackNavigator();

const LegalStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={"Selector"} component={Selector}
        options={{headerShown: false}}/>
      <Stack.Screen name={"Licenses"} component={Licenses} />
      <Stack.Screen name={"Terms of Service"} component={TermsOfService} />
      <Stack.Screen name={"Privacy Policy"} component={PrivacyPolicy} />
    </Stack.Navigator>
  )
}

export default LegalStack;
