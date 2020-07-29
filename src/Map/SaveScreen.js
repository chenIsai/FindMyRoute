import React, {useState} from "react";
import {View, Text, StyleSheet, TextInput, TouchableNativeFeedback} from "react-native";
import Dialog from "react-native-dialog";

function SaveScreen({navigation}) {
  const [name, _onChangeName] = useState("");
  const [desc, _onChangeDesc] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.emptySpace} />
      <View style={styles.detailsView}>
        <Text style={{fontWeight: "bold", fontSize: 14,}}>Route Details</Text>
      </View>
      <View style={styles.saveOptions}>
        <View style={styles.nameRow}>
          <Text>Icon</Text>
          <TextInput style={styles.textInputs}
            maxLength={40}
            onChangeText={text => _onChangeName(text)}
            placeholder={"Name"}
          />
        </View>
        <View style={styles.descriptionRow}>
          <Text>Icon</Text>
          <TextInput style={styles.textInputs}
            maxLength={160}
            onChangeText={text => _onChangeDesc(text)}
            placeholder={"Enter a description for the route (optional)"} />
        </View>
        <View style={styles.buttonView}>
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple("#AAF", true)}
            style={styles.submitButton}
            onPress={() =>{
              console.log(name);
              console.log(desc);
            }}>
            <View>
              <Text style={styles.saveText}>Save Route</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    </View>
  )
}

export default SaveScreen;

function saveButton({navigation}) {
  return (
    <View>
      <Button title="Save Route" onPress={() => {navigation.push("SavePage")}} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },

  emptySpace: {
    flex: .2,
    flexDirection: "row",
    backgroundColor: "deepskyblue",
  },

  detailsView: {
    flex: .2,
    flexDirection: "row",
    padding: 8,
  },

  saveOptions: {
    flex: .6,
  },

  nameRow: {
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingLeft: 50,
    paddingRight: 50,
  },

  descriptionRow: {
    flex: 0.4,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 50,
  },

  textInputs: {
    flex: 1,
    backgroundColor: "white",
  },

  buttonView: {
    flex: .2,
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "deepskyblue",
    borderRadius: 12,
  },

  submitButton: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    backgroundColor: "deepskyblue",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff"
  },

  saveText: {
    color: "white",
    fontSize: 18,
  }


});
