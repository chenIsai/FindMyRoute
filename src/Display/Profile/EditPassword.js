import React, {useState, useContext, useRef, useEffect} from "react";
import {View, Text, TouchableNativeFeedback, TextInput, Animated, Alert, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import AuthContext from "../../Context/AuthContext";
import links from "../../Authentication/link";

const EditPassword = (props) => {
  const [password, updatePassword] = useState("");
  const [confirm, updateConfirm] = useState("");
  const [errorText, updateErrorText] = useState("");
  const [icon, updateIcon] = useState("eye-off");
  const [valid, updateValid] = useState(true);
  const [pressed, setPressed] = useState(false);
  const tokens = useContext(AuthContext);

  useEffect(() => {
    if (pressed) {
      setPressed(false);
      updatePass();
    }
  }, [tokens.accessToken])

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

  const updatePass = () => {
    setPressed(true);
    if (password === "") {
      updateErrorText("Cannot use an empty password!");
      updateValid(false);
      shake();
      fadeInAndOut();
      setPressed(false);
      return;
    }
    if (password !== confirm) {
      updateErrorText("Passwords do not match!");
      updateValid(false);
      shake();
      fadeInAndOut();
      setPressed(false);
      return;
    }
    fetch(links.editPass, {
      method: "POST",
      body: JSON.stringify({
        password
      }),
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
        "Content-Type": "application/json"
      }
    }).then((response) => {
      if (response.ok) {
        Alert.alert("Success!");
        setPressed(false);
        props.navigation.goBack();
      } else if (response.status === 401) {
        tokens.refreshTokens();
      } else {
        Alert.alert("Unexpected Error " + response.status);
        setPressed(false);
      }
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={{fontSize: 24, paddingLeft: 20, color: "#8d67cf"}}>Update Your Password!</Text>
      </View>
      <Animated.View style={[{paddingLeft: 20, opacity: fadeAnimation}, {transform: [{translateX: shakeAnimation}]}]}>
        <Text style={{color: "#ED4337"}}>{errorText}</Text>
      </Animated.View>
      <View style={styles.inputViews}>
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
      <View style={styles.inputViews}>
        <TextInput
          style={{flex: 1}}
          secureTextEntry={true}
          placeholder={"Confirm Password"}
          onChangeText={(text) => updateConfirm(text)}/>
      </View>
      <Animated.View
        style={[styles.buttonView,
          {transform: [{translateX: shakeAnimation}]},
          {backgroundColor: valid ? "#8d67cf" : "#ED4337"}]}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("grey", true)}
          onPress={() => updatePass()}
          disabled={pressed}
        >
          <View style={styles.loginButton}>
            <Text style={styles.buttonText}>UPDATE PASSWORD</Text>
          </View>
        </TouchableNativeFeedback>
      </Animated.View>
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

  inputViews: {
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderColor: "#8d67cf",
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
})

export default EditPassword;
