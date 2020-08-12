import React, {useState, useContext, useRef} from "react";
import {View, Text, TouchableNativeFeedback, TextInput, Animated, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import AuthContext from "../Context/AuthContext";
import links from "./link";

const Login = (props) => {
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const [icon, updateIcon] = useState("eye");
  const [status, updateStatus] = useState("");
  const [valid, updateValid] = useState(true);
  const tokens = useContext(AuthContext);

  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {toValue: 5, duration: 100, useNativeDriver: true}),
      Animated.timing(shakeAnimation, {toValue: -5, duration: 100, useNativeDriver: true}),
      Animated.timing(shakeAnimation, {toValue: 5, duration: 100, useNativeDriver: true}),
      Animated.timing(shakeAnimation, {toValue: 0, duration: 1000, useNativeDriver: true})
    ]).start(() => updateValid(true));
  }

  const fadeInAndOut = () => {
    Animated.sequence([
      Animated.timing(fadeAnimation, {toValue: 1, duration: 0, useNativeDriver: true}),
      Animated.timing(fadeAnimation, {toValue: 0, duration: 3000, useNativeDriver: true}),
    ]).start();
  }

  const link = links.login;
  const sendLogin = () => {
    if (username === "" || password === "") {
      updateValid(false);
      shake();
      fadeInAndOut();
      return;
    }
    fetch(link, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      return response.status;
    }).then((data) => {
      if (Number.isInteger(data)) {
        updateStatus(data);
      } else {
        tokens.updateAccess(data.accessToken);
        tokens.updateRefresh(data.refreshToken);
      }
    }).catch((error) => {
      console.log(error)
    });
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.topText}>Login</Text>
      </View>
      <Animated.View style={[{paddingLeft: 20, opacity: fadeAnimation}, {transform: [{translateX: shakeAnimation}]}]}>
        <Text style={{color: "#ED4337"}}>Error: Username or Password incorrect!</Text>
      </Animated.View>
      <View style={styles.inputViews}>
        <View style={{justifyContent: "center"}}>
          <Icon
            style={{alignSelf: "flex-end"}}
            name={"person-sharp"}
            size={20}
          />
        </View>
        <TextInput
          style={{flex: 1}}
          placeholder={"Username"}
          onChangeText={(text) => updateUsername(text)}/>
      </View>
      <View style={styles.inputViews}>
        <View style={{justifyContent: "center"}}>
          <Icon
            style={{alignSelf: "flex-end"}}
            name={"lock-closed"}
            size={20}
            />
        </View>
        <TextInput
          style={{flex: 1}}
          secureTextEntry={icon !== "eye"}
          placeholder={"Password"}
          onChangeText={(text) => updatePassword(text)}/>
        <View style={{justifyContent: "center"}}>
          <Icon
            style={{alignSelf: "flex-end"}}
            name={icon}
            size={20}
            onPress={() => {if (icon === "eye") {
              updateIcon("eye-off")
              return;
            }
            updateIcon("eye");
            return;
          }}/>
        </View>
      </View>
      <Animated.View
        style={[styles.buttonView,
          {transform: [{translateX: shakeAnimation}]},
          {backgroundColor: valid ? "#67cfb3" : "#ED4337"}]}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("grey", true)}
          onPress={() => sendLogin()}
        >
          <View style={styles.loginButton}>
            <Text style={styles.buttonText}>SIGN IN</Text>
          </View>
        </TouchableNativeFeedback>
      </Animated.View>
      <View style={{flexDirection: "row"}}>
        <Text
          style={styles.signUpText}
          onPress={() => props.navigation.navigate("SignUp")}
          >Sign up instead!</Text>
        <Text
          style={styles.forgotText}
          onPress={() => props.navigation.navigate("ForgotPassword")}
          >Forgot Password?</Text>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "stretch",
    justifyContent: "center",
  },

  topText: {
    color: "#67cfb3",
    fontSize: 32,
    fontWeight: "bold",
    margin: 30,
    marginLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#67cfb3",
  },

  inputViews: {
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#67cfb3",
    margin: 5,
    marginLeft: 20,
    marginRight: 20,
  },

  buttonView: {
    height: 45,
    marginLeft: 20,
    marginRight: 20,
  },

  loginButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },

  buttonText: {
    color: "white",
  },

  signUpText: {
    color: "#67cfb3",
    flex: 1,
    padding: 10,
    marginLeft: 10,
    fontWeight: "bold",
  },

  forgotText: {
    color: "#67cfb3",
    alignSelf: "flex-end",
    padding: 10,
    marginRight: 10,
    fontWeight: "bold",
  },
})

export default Login;
