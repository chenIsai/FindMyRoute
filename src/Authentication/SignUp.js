import React, {useState} from "react";
import {View, Text, TouchableNativeFeedback, TextInput, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";


const SignUp = () => {
  const [givenName, updateGivenName] = useState("");
  const [email, updateEmail] = useState("");
  const [username, updateUsername] = useState("");
  const [password, updatePassword] = useState("");
  const [confirm, updateConfirm] = useState("");
  const [icon, updateIcon] = useState("eye");
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.topText}>Sign Up</Text>
      </View>
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
          onChangeText={(text) => updateGivenName(text)}/>
      </View>
      <View style={styles.inputViews}>
        <View style={{justifyContent: "center"}}>
          <Icon
            style={{alignSelf: "flex-end"}}
            name={"mail"}
            size={20}
          />
        </View>
        <TextInput
          style={{flex: 1}}
          placeholder={"Enter email"}
          onChangeText={(text) => updateEmail(text)}/>
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
          secureTextEntry={true}
          placeholder={"Confirm Password"}
          onChangeText={(text) => updateConfirm(text)}/>
      </View>
      <View style={styles.buttonView}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("grey", true)}
          onPress={() => //To add auth function
            console.log(givenName + "|" + email + "|" + username + "|" + password + "|" + confirm)}
        >
          <View style={styles.loginButton}>
            <Text style={styles.buttonText}>SIGN IN</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
      <View style={{flexDirection: "row"}}>
        <Text
          style={styles.signUpText}
          onPress={() => console.log("SIGN UP")}
          >Sign in instead!</Text>
        <Text
          style={styles.forgotText}
          onPress={() => console.log("FORGOT PASSWORD")}
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

export default SignUp;
