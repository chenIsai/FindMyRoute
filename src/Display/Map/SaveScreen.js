import React, {useState, useContext, useEffect} from "react";
import {View, Text, StyleSheet, TextInput, TouchableNativeFeedback, Alert} from "react-native";

import PlanContext from "../../Context/PlanContext";
import UnitContext from "../../Context/UnitContext";
import AuthContext from "../../Context/AuthContext";

import AsyncStorage from "@react-native-community/async-storage";
import {encode} from "@mapbox/polyline"

import LiteMap from "../Components/LiteMap";
import Icon from "react-native-vector-icons/Ionicons";
import links from "../../Authentication/link";

function SaveScreen({navigation}) {
  const [name, _onChangeName] = useState("");
  const [description, _onChangeDesc] = useState("");
  const [pressed, setPressed] = useState(false);

  const unit = useContext(UnitContext);
  const plan = useContext(PlanContext);
  const tokens = useContext(AuthContext);

  useEffect(() => {
    if (pressed) {
      saveRoute();
      setPressed(false);
    }
  }, [tokens.accessToken]);

  const encodeMarkers = (markers) => {
    return encode(markers.map((item) => [item.latitude, item.longitude]));
  }

  const saveRoute = () => {
    if (!name) {
      Alert.alert("Please enter a name for your route!");
      return;
    }
    setPressed(true);
    const latlon = plan.directions.map((point) => {
      return [point.latitude, point.longitude]
    })
    const route = encode(latlon);
    const routeJSON = JSON.stringify({
      name: name,
      distance: plan.distance,
      description,
      markers: encodeMarkers(plan.markers),
      route: route,
    });
    fetch(links.savePlanned, {
      method: "POST",
      body: routeJSON,
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
        "Content-type": "application/json",
      }
    }).then((response) => {
      if (response.ok) {
        Alert.alert("Success");
        setPressed(false);
        navigation.goBack();
      } else {
        if (response.status === 409) {
          Alert.alert("You cannot have two routes with the same name!");
          setPressed(false);
        } else if (response.status === 401) {
          tokens.refreshTokens();
        }
      }
    }).catch((error) => {
      console.log(error)
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapStyle}>
        <LiteMap markers={plan.markers} route={plan.directions}/>
      </View>
      <View>
        <View style={styles.nameRow}>
          <Icon
            style={{paddingRight: 5}}
            name={"bookmark"}
            color={"#78AD92"}
            size={30}
            />
          <TextInput style={styles.nameInput}
            maxLength={24}
            onChangeText={ text => _onChangeName(text)}
            placeholder={"Name"}
          />
        </View>
        <View style={styles.descriptionRow}>
          <Icon
            style={{paddingRight: 5, alignSelf: "center"}}
            name={"document-text"}
            color={"#78AD92"}
            size={30}
            />
          <TextInput style={styles.descriptionInput}
            multiline={true}
            numberOfLines={5}
            blurOnSubmit={true}
            maxLength={50}
            onChangeText={text => _onChangeDesc(text)}
            placeholder={"Enter a description for the route (optional)"} />
        </View>
      </View>
      <TouchableNativeFeedback
        disabled = {pressed}
        onPress={() => saveRoute()}
        >
        <View style={styles.buttonView}>
          <Icon
            color={"#78AD92"}
            name={"save"}
            size={30}
          />
        <Text style={{alignSelf: "center", fontSize: 18, padding: 5, paddingBottom: 10, color: "#C6FADF"}}>
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
    backgroundColor: "#C6FADF"
  },

  mapStyle: {
    height: 250,
    backgroundColor: "#3C7A5A",
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
    backgroundColor: "#617A6D",
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
