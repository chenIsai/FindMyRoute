import React, {useState, useRef, useContext} from "react";
import {View, Text, TouchableNativeFeedback, TextInput, Animated, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import AuthContext from "../Context/AuthContext";
import links from "./link";


const SignUp = (props) => {
  const [givenName, updateGivenName] = useState("");
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const [confirm, updateConfirm] = useState("");
  const [icon, updateIcon] = useState("eye-off");
  const [status, updateStatus] = useState("");
  const [errorText, updateError] = useState("abc");
  const [valid, updateValid] = useState(true);
  const usernameInput = useRef(null);
  const passwordInput = useRef(null);
  const confirmInput = useRef(null);


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

  const link = links.signUp;
  const sendRegister = () => {
    var error = false;
    if (username === "" || password === "" || givenName === "") {
      updateError("One or more fields are empty");
      error = true;
    } else if (password !== confirm) {
      updateError("Passwords do not match");
      error = true;
    }
    if (error) {
      updateValid(false);
      shake();
      fadeInAndOut();
      return;
    }
    fetch(link, {
      method: "POST",
      body: JSON.stringify({
        name: givenName,
        username,
        password
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
        if (data === 409) {
          updateError("Username taken!");
        } else {
          updateError("Unknown Error");
        }
        updateValid(false);
        shake();
        fadeInAndOut();
      } else {
        tokens.setTokens({access: data.accessToken, refresh: data.refreshToken})
      }
    }).catch((error) => {
      console.log(error)
    });
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.topText}>Sign Up</Text>
      </View>
      <Animated.View style={[{paddingLeft: 20, opacity: fadeAnimation}, {transform: [{translateX: shakeAnimation}]}]}>
        <Text style={{color: "#ED4337"}}>{errorText}</Text>
      </Animated.View>
      <View style={styles.inputViews}>
        <View style={{justifyContent: "center"}}>
          <Icon
            style={{alignSelf: "flex-end"}}
            name={"body-sharp"}
            size={20}
          />
        </View>
        <TextInput
          style={{flex: 1}}
          placeholder={"Your name"}
          onSubmitEditing={() => {usernameInput.current.focus()}}
          onChangeText={(text) => updateGivenName(text)}/>
      </View>
      <View style={styles.inputViews}>
        <View style={{justifyContent: "center"}}>
          <Icon
            style={{alignSelf: "flex-end"}}
            name={"person-sharp"}
            size={20}
          />
        </View>
        <TextInput
          ref={usernameInput}
          onSubmitEditing={() => {passwordInput.current.focus()}}
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
          ref={passwordInput}
          onSubmitEditing={() => {confirmInput.current.focus()}}
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
      <View style={styles.inputViews}>
        <View style={{justifyContent: "center"}}>
          <Icon
            style={{alignSelf: "flex-end"}}
            name={"lock-closed-sharp"}
            size={20}
          />
        </View>
        <TextInput
          style={{flex: 1}}
          ref={confirmInput}
          onSubmitEditing={() => {sendRegister()}}
          secureTextEntry={true}
          placeholder={"Confirm Password"}
          onChangeText={(text) => updateConfirm(text)}/>
      </View>
      <Animated.View
        style={[styles.buttonView,
          {transform: [{translateX: shakeAnimation}]},
          {backgroundColor: valid ? "#67cfb3" : "#ED4337"}]}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("grey", true)}
          onPress={() => sendRegister()}
        >
          <View style={styles.loginButton}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </View>
        </TouchableNativeFeedback>
      </Animated.View>
      <View style={{flexDirection: "row", justifyContent: "center"}}>
        <Text
          style={styles.signUpText}
          onPress={() => props.navigation.navigate("Login")}
          >Sign in instead!</Text>
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
    backgroundColor: "#67cfb3",
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
    padding: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
})

export default SignUp;
