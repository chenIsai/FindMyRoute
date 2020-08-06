import React, {useState} from "react";
import {View, Text, StyleSheet, TextInput, TouchableNativeFeedback, Alert} from "react-native";
import DistanceContext from "../Context/DistanceContext";
import UnitContext from "../Context/UnitContext";
import MarkersContext from "../Context/MarkersContext";
import DirectionsContext from "../Context/DirectionsContext";
import RouteContext from "../Context/RouteContext";

import AsyncStorage from "@react-native-community/async-storage";

import LiteView from "./LiteView";

function SaveScreen({navigation}) {
  const [name, _onChangeName] = useState("");
  const [description, _onChangeDesc] = useState("");
  const markers = React.useContext(MarkersContext);
  const unit = React.useContext(UnitContext);
  const distance = React.useContext(DistanceContext);
  const directions = React.useContext(DirectionsContext);
  const route = React.useContext(RouteContext);

  return (
    <View style={styles.container}>
      <View style={styles.emptySpace} />
      <View style={styles.detailsView}>
        <LiteView markers={markers.value} directions={directions.value} distance={distance.value} unit={unit.value} name={name} description={description}/>
      </View>
      <View style={styles.saveOptions}>
        <View style={styles.nameRow}>
          <Text>Icon</Text>
          <TextInput style={styles.nameInput}
            maxLength={36}
            onChangeText={text => _onChangeName(text)}
            placeholder={"Name"}
          />
        </View>
        <View style={styles.descriptionRow}>
          <Text>Icon</Text>
          <TextInput style={styles.descriptionInput}
            maxLength={160}
            multiline={true}
            numberOfLines={5}
            maxLength={100}
            onChangeText={text => _onChangeDesc(text)}
            placeholder={"Enter a description for the route (optional)"} />
        </View>
        <View style={styles.buttonView}>
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple("#AAF", true)}
            style={styles.submitButton}
            onPress={() =>{
              if (!name) {
                Alert.alert("Please enter a name for your route!");
                return;
              }
              const routeName = "saveRoute" + name;
              const savedRoute = JSON.stringify({
                name: routeName,
                distance: distance.value,
                unit: unit.value,
                description,
                markers: markers.value,
                directions: directions.value,
                route: route.value,
              });
              AsyncStorage.setItem(routeName, savedRoute);
              navigation.navigate("Map");
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },

  emptySpace: {
    flex: .1,
    flexDirection: "row",
    backgroundColor: "deepskyblue",
  },

  detailsView: {
    flex: .25,
    flexDirection: "row",
  },

  saveOptions: {
    flex: .65,
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

  nameInput: {
    flex: 1,
    backgroundColor: "white",
  },

  descriptionInput: {
    flex: 1,
    backgroundColor: "white",
    textAlignVertical: "top",
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
