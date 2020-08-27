import React, {useState, useContext, useRef} from "react";
import {View, Text, TouchableNativeFeedback, TextInput, Animated, Alert, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import UserContext from "../../Context/UserContext";
import AuthContext from "../../Context/AuthContext";
import links from "../../Authentication/link";

const EditUsername = ({route, navigation}) => {
  console
  const [username, updateUsername] = useState(route.params.username);
  const [name, updateName] = useState(route.params.name);
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
      Animated.timing(fadeAnimation, {toValue: 0, duration: 2000, useNativeDriver: true}),
    ]).start();
  }

  const link = links.editUser;
  const updateBoth = () => {
    console.log("Called");
    if (username === "" || name === "") {
      updateValid(false);
      shake();
      fadeInAndOut();
      return;
    }
    if (!username || !name) {
      return;
    }
    if (username === route.params.username && name === route.params.name) {
      navigation.goBack();
      return;
    }
    fetch(links.editUser, {
      method: "POST",
      body: JSON.stringify({
        username,
        name,
      }),
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
        "Content-Type": "application/json"
      }
    }).then((response) => {
      if (response.ok) {
        Alert.alert("Success!");
        navigation.goBack();
      } else if (response.status === 403) {
        tokens.refreshTokens;
        Alert.alert("Error occured while saving new details! Please try again!");
      } else {
        Alert.alert("Unexpected Error " + response.status);
      }
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <View style={styles.container}>
      <View>
        <Text style={{fontSize: 24, paddingLeft: 20, color: "#8d67cf"}}>Change Your Username or Name!</Text>
      </View>
      <Animated.View style={[{paddingLeft: 20, opacity: fadeAnimation}, {transform: [{translateX: shakeAnimation}]}]}>
        <Text style={{color: "#ED4337"}}>Error: Username or Name invalid!</Text>
      </Animated.View>
      <View style={styles.inputViews}>
        <View style={{justifyContent: "center"}}>
        </View>
        <TextInput
          style={{flex: 1}}
          placeholder={"Name"}
          value={name}
          onChangeText={(text) => updateName(text)}/>
      </View>
      <View style={styles.inputViews}>
        <View style={{justifyContent: "center"}}>
        </View>
        <TextInput
          style={{flex: 1}}
          placeholder={"Username"}
          value={username}
          onChangeText={(text) => updateUsername(text)}/>
      </View>
      <Animated.View
        style={[styles.buttonView,
          {transform: [{translateX: shakeAnimation}]},
          {backgroundColor: valid ? "#ab7ced" : "#ED4337"}]}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("grey", true)}
          onPress={() => updateBoth()}
        >
          <View style={styles.loginButton}>
            <Text style={styles.buttonText}>CHANGE</Text>
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
    padding: 10,
    marginTop: 10,
    fontWeight: "bold",
  },
})

export default EditUsername;
