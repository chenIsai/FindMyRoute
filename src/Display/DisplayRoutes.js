import React, {useState, useEffect, useContext} from "react";
import {ScrollView, View, Text, TextInput,
        StyleSheet, Button, TouchableNativeFeedback,
        Alert, RefreshControl} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";

import AsyncStorage from "@react-native-community/async-storage";
import {decode} from "@mapbox/polyline"

import UnitContext from "../Context/UnitContext";
import AuthContext from "../Context/AuthContext";
import PlanContext from "../Context/PlanContext";

import LiteView from "./Components/LiteView";
import Splash from "./Components/Splash";
import Header from "./Components/Header";
import links from "../Authentication/link";

function DisplayRoutes(props) {
  const [savedRoutes, updateRoutes] = useState(null);
  const [isLoading, updateLoading] = useState(true);
  const [modalVisible, setVisible] = useState(false);
  const [currentRoute, updateCurrent] = useState("");
  const [editName, updateName] = useState("");
  const [editDescription, updateDescription] = useState("");
  const [deleteName, setDelete] = useState("");
  const [refreshing, updateRefresh] = useState(false);

  const unit = useContext(UnitContext);
  const plan = useContext(PlanContext);
  const tokens = useContext(AuthContext);

  const decodeRoute = (route) => {
    const points = decode(route);
    const directions = points.map(point => {
      return {
        latitude: point[0],
        longitude: point[1]
      }
    });
    return directions;
  }

  const decodeMarkers = (markers) => {
    const points = decode(markers);
    return points.map((point) => {
      return {
        latitude: point[0],
        longitude: point[1]
      }
    });
  }

  const getRoutes = () => {
    fetch(links.routes, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
      }
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      if (response.status === 401) {
        tokens.refreshTokens();
      }
    }).then((data) => {
      updateRoutes(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  const deleteRoute = (routeName) => {
    fetch(links.routes, {
      method: "DELETE",
      body: JSON.stringify({
        name: routeName,
      }),
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      if (response.status === 401) {
        tokens.refreshTokens();
        setDelete(routeName);
      } else {
        getRoutes();
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  const openModal = (name, description) => {
    updateName(name);
    updateCurrent(name);
    updateDescription(description);
    setVisible(true);
  }

  const editRoute = (routeName, newName, description) => {
    fetch(links.editRoute, {
      method: "POST",
      body: JSON.stringify({
        oldName: routeName,
        name: newName,
        description
      }),
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
        "Content-Type": "application/json",
      }
    }).then((response) => {
      if (response.ok) {
        Alert.alert("Success");
        getRoutes();
      } else {
        Alert.alert("Error " + response.status);
      }
    }).catch((error) => {
      console.log(error);
    });
    setVisible(false);
  }

  const openRoute = (routeDist, routeDir, routeMarkers) => {
    plan.updateDistance(routeDist);
    plan.updateMarkers(routeMarkers);
    plan.updateDirections(routeDir);
    props.navigation.navigate("Plan Your Route");
  }

  useEffect(() => {
    if (deleteName !== "") {
      deleteRoute(deleteName);
      getRoutes();
      setDelete("");
    } else if (tokens.accessToken !== ""){
      getRoutes();
    }
  }, [tokens.accessToken])

  if (!savedRoutes) {
    return (
      <Splash />
    )
  }
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={modalVisible}
        onRequestClose={() => {
          setVisible(false);
        }}
        onBackdropPress={() => {
          setVisible(false);
        }}
        backdropOpacity={0}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text
              style={{padding: 15, paddingLeft: 0, paddingBottom: 3, marginLeft: 15, marginRight: 15, borderBottomWidth: 1}}
              >
              Change the name of your route
            </Text>
            <TextInput
              style={{margin: 15, marginTop: 5, marginBottom: 0, textAlignVertical: "top", backgroundColor: "#97d197"}}
              maxLength={24}
              value={editName}
              onChangeText={(text) => updateName(text)}
              placeholder={"Name"}
              />
              <Text
                style={{paddingRight: 15, paddingTop: 5, paddingBottom: 3, marginLeft: 15, marginRight: 15, borderBottomWidth: 1}}
                >Update or add a description!</Text>
            <TextInput
              style={{margin: 15, marginTop: 5, textAlignVertical: "top", backgroundColor: "#97d197"}}
              blurOnSubmit={true}
              maxLength={50}
              multiline={true}
              numberOfLines={2}
              value={editDescription}
              onChangeText={(text) => updateDescription(text)}
              placeholder={"Enter a description for the route (optional)"} />
            <View style = {{flexDirection: "row",}}>
              <TouchableNativeFeedback
                onPress={() => setVisible(false)}>
                <View style={styles.cancelButton}>
                  <Text style={{fontWeight: "bold", color: "grey"}}>Cancel</Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback
                onPress={() => editRoute(currentRoute, editName, editDescription)}>
                <View style={styles.saveButton}>
                  <Text style={{color: "white"}}>Save</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
        </View>
      </Modal>
      <Header navigation={props.navigation} header={"Saved Routes"}/>
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: .1}}
        overScrollMode={"always"}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => getRoutes()} />
        }
        >
        {savedRoutes.length === 0 ? (
          <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Text>You have no saved routes</Text>
            <Button title="Go to Map" onPress={() => props.navigation.navigate("Map")}/>
          </View>
        ) : savedRoutes.map((route, index) => {
          const showDistance = unit.value === "km" ? route.distance/1000 : Math.round((route.distance/1609 + Number.EPSILON) * 100)/100;
          return (
            <LiteView
              key={route.name}
              name={route.name}
              distance={showDistance}
              markers={route.markers ? decodeMarkers(route.markers) : null}
              route={decodeRoute(route.route)}
              unit={unit.value}
              description={route.description}
              delete={(name) => deleteRoute(name)}
              edit={(name, description) => openModal(name, description)}
              open={(distance, directions, markers) => openRoute(distance, directions, markers)}
            />)})}
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C6FADF"
  },
  headerTextView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold"
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalView: {
    width: 300,
    backgroundColor: "#b1f5b0",
    borderWidth: 0.7,
    borderRadius: 20,
    overflow: "hidden"
  },

  cancelButton: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    marginTop: 0,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "grey"
  },

  saveButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    marginTop: 0,
    padding: 15,
    backgroundColor: "#28b4f0",
    borderRadius: 5,
  },
})

export default DisplayRoutes;
