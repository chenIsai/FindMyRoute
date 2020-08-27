import React from "react";
import {createStackNavigator} from "react-navigation/stack";
import TermsOfService from "../Display/Legal/Terms";
import PrivacyPolicy from "../Display/Legal/PrivacyPolicy";
import Licenses from "../Display/Legal/Licenses";

const Stack = createStackNavigator();

const LegalInfo = () => {
  <Stack.Navigator>
    <Stack.Screen name={"Terms of Service"} component={TermsOfService} />
    <Stack.Screen name={"Privacy Policy"} component={PrivacyPolicy} />
    <Stack.Screen name={"Licenses"} component={Licenses} />
  </Stack.Navigator>
}
