import React, {useState, useContext} from "react";
import {View, Text, StyleSheet, TextInput, TouchableNativeFeedback, Alert} from "react-native";

import UnitContext from "../../Context/UnitContext";
import RunContext from "../../Context/RunContext";
import AuthContext from "../../Context/AuthContext";

import {encode} from "@mapbox/polyline";
import LiteMap from "../Components/LiteMap";
import Icon from "react-native-vector-icons/Ionicons";
import links from "../../Authentication/link";

const SaveScreen = ({navigation}) => {
  const [name, updateName] = useState("");
  const [description, updateDescription] = useState("");
  const [pressed, setPressed] = useState(false);

  const run = useContext(RunContext);
  const unit = useContext(UnitContext);
  const tokens = useContext(AuthContext);

  const encodeRun = () => {
    const pointArray = run.directions.map((point) => {
      return [point.latitude, point.longitude];
    })
    return encode(pointArray);
  }

  const saveRoute = () => {
    if (!name) {
      Alert.alert("Route must have a name!");
      return;
    }
    const routeJSON = JSON.stringify({
      name,
      description,
      distance: run.distance,
      route: encodeRun(),
    });
    fetch(links.saveRan, {
      method: "POST",
      body: routeJSON,
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
        "Content-type": "application/json",
      }
    }).then((response) => {
      if (response.ok) {
        Alert.alert("Success");
        navigation.goBack();
      } else {
        if (response.status === 409) {
          Alert.alert("A route with the same name already exists!");
        } else if (response.status === 401) {
          tokens.refreshTokens();
          Alert.alert("Error occured while saving, please try again!");
        }
      }
      setPressed(false);
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapStyle}>
        <LiteMap route={run.directions}/>
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
            maxLength={24}
            onChangeText={ text => updateName(text)}
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
            multiline={true}
            numberOfLines={5}
            blurOnSubmit={true}
            maxLength={50}
            onChangeText={text => updateDescription(text)}
            placeholder={"Enter a description for the route (optional)"} />
        </View>
      </View>
      <TouchableNativeFeedback
        disabled = {pressed}
        onPress={() => saveRoute()}
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
    maxHeight: 125,
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
