import React, {useState} from "react";
import {View, Text, TouchableNativeFeedback, TextInput, StyleSheet} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";


const ForgotPassword = () => {
  const [email, updateEmail] = useState("");
  return (
    <View style={styles.container}>
      <Text style={styles.topText}>Forgot Password?</Text>
      <View style={styles.inputView}>
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
      <View style={styles.buttonView}>
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.Ripple("grey", true)}
          onPress={() => //To add auth function
            console.log(email) }
        >
          <View style={styles.sendButton}>
            <Text style={styles.buttonText}>SEND EMAIL</Text>
          </View>
        </TouchableNativeFeedback>
      </View>
      <View>
        <Text
          style={styles.accountText}
          onPress={() => console.log("CREATE ACCOUNT")}
        >Don't have an account yet? Create one here!</Text>
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

  inputView: {
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
    margin: 25,
    marginLeft: 20,
    marginRight: 20,
  },

  sendButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },

  buttonText: {
    color: "white",
  },

  accountText: {
    color: "#67cfb3",
    alignSelf: "center",
    padding: 10,
    marginRight: 10,
    fontWeight: "bold",
  },
})

export default ForgotPassword;
