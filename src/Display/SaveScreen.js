import React, {useState} from "react";
import {View, Text, StyleSheet, TextInput, TouchableNativeFeedback, Alert} from "react-native";
import DistanceContext from "../Context/DistanceContext";
import UnitContext from "../Context/UnitContext";
import MarkersContext from "../Context/MarkersContext";
import DirectionsContext from "../Context/DirectionsContext";
import RouteContext from "../Context/RouteContext";

import AsyncStorage from "@react-native-community/async-storage";

import LiteMap from "./LiteMap";
import Icon from "react-native-vector-icons/Ionicons"

function SaveScreen({navigation}) {
  const [name, _onChangeName] = useState("");
  const [description, _onChangeDesc] = useState("");
  const markers = React.useContext(MarkersContext);
  const unit = React.useContext(UnitContext);
  const distance = React.useContext(DistanceContext);
  const directions = React.useContext(DirectionsContext);
  const route = React.useContext(RouteContext);
  const showDistance = unit.value === "m" ? distance.total : (unit.value === "km" ? distance.conversion.km : distance.conversion.mi);

  return (
    <View style={styles.container}>
      <View style={styles.mapStyle}>
        <LiteMap markers={markers.value} directions={directions.value}/>
      </View>
      <View>
        <View style={styles.nameRow}>
          <Icon
            style={{paddingRight: 5}}
            name={"bookmark"}
            color={"#b0b2f5"}
            size={30}
            />
          <TextInput style={styles.nameInput}
            maxLength={36}
            onChangeText={ text => _onChangeName(text)}
            placeholder={"Name"}
          />
        </View>
        <View style={styles.descriptionRow}>
          <Icon
            style={{paddingRight: 5, alignSelf: "center"}}
            name={"document-text"}
            color={"#b0b2f5"}
            size={30}
            />
          <TextInput style={styles.descriptionInput}
            maxLength={160}
            multiline={true}
            numberOfLines={5}
            maxLength={100}
            onChangeText={text => _onChangeDesc(text)}
            placeholder={"Enter a description for the route (optional)"} />
        </View>
      </View>
      <TouchableNativeFeedback
        onPress={() =>{
          if (!name) {
            Alert.alert("Please enter a name for your route!");
            return;
          }
          const routeName = "saveRoute" + name;
          const savedRoute = JSON.stringify({
            name: routeName,
            distance: distance.total,
            conversion: distance.conversion,
            description,
            markers: markers.value,
            directions: directions.value,
            route: route.value,
          });
          AsyncStorage.setItem(routeName, savedRoute);
          navigation.navigate("Map");
        }}
        >
        <View style={styles.buttonView}>
          <Icon
            color={"#b0b2f5"}
            name={"save"}
            size={30}
          />
        <Text style={{alignSelf: "center", fontSize: 18, padding: 5, paddingBottom: 10, color: "white"}}>
            Save Route
          </Text>
        </View>
      </TouchableNativeFeedback>
    </View>
  )
}

export default SaveScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#b0f5f2"
  },

  mapStyle: {
    height: 250,
    backgroundColor: "deepskyblue",
    flexDirection: "row",
    margin: 10,
    marginTop: 30,
    padding: 20,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 10,
    paddingLeft: 50,
    paddingRight: 50,
    marginTop: 15
  },

  descriptionRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 50,
    paddingTop: 10,
    marginTop: 10,
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
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "deepskyblue",
    height: 60,
    padding: 10,
  },

  saveButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
});
