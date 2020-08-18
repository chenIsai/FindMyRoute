import React, {useState, useEffect, useContext} from "react";
import {ScrollView, View, Text, StyleSheet, Button} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import AsyncStorage from "@react-native-community/async-storage";
import {decode} from "@mapbox/polyline"

import UnitContext from "../Context/UnitContext";
import AuthContext from "../Context/AuthContext";
import LiteView from "./LiteView";
import Splash from "./Splash";
import Header from "./Header";
import links from "../Authentication/link";

function DisplayRoutes(props) {
  const [savedRoutes, updateRoutes] = useState(null);
  const [isLoading, updateLoading] = useState(true);
  const unit = useContext(UnitContext);
  const tokens = useContext(AuthContext);
  const onRefresh = () => {
    updateRoutes(null);
  }

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
    console.log("Getting Routes");
    fetch(links.routes, {
      method: "GET",
      headers: {
        "Authorization": "Bearer " + tokens.accessToken,
      }
    }).then((response) => {
      return response.json();
    }).then((data) => {
      updateRoutes(data.rows);
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    setTimeout(() => getRoutes(), 200)
  }, [])

  if (!savedRoutes) {
    return (
      <Splash />
    )
  } else if (savedRoutes) {
    if (savedRoutes.length > 0) {
      return (
        <View style={styles.container}>
          <RefreshHeader navigation={props.navigation} header={"Saved Routes"} refresh={() => getRoutes()}/>
          <ScrollView contentContainerStyle={{flexGrow: .1}}>
            {savedRoutes.map((route, index) => {
              const showDistance = unit.value === "m" ? route.distance : (
                unit.value === "km" ? route.distance/1000 : Math.round((route.distance/1609 + Number.EPSILON) * 1000)/1000);
              return (
                <LiteView
                  name={route.name.replace("saveRoute", "")}
                  distance={showDistance}
                  markers={decodeMarkers(route.markers)}
                  directions={decodeRoute(route.route)}
                  unit={unit.value}
                  description={route.description}
                />)})}
          </ScrollView>
        </View>
      )
    }
    else {
      return (
        <View style={{flex: 1}}>
          <Header navigation={props.navigation} header={"Saved Routes"}/>
          <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Text>You have no saved routes</Text>
            <Button title="Go to Map" onPress={() => props.navigation.navigate("Map")}/>
          </View>
        </View>
      )
    }
  }
}

const RefreshHeader = (props) => {
  return (
    <View style={{padding: 15, flexDirection: "row", backgroundColor: "white"}}>
      <View style={{flexDirection: "row", flex: 1}}>
        <View style={{flexDirection: "row", alignSelf: "flex-start"}}>
          <Icon
            name={"md-menu"}
            size={30}
            onPress={() => props.navigation.openDrawer()}
          />
        </View>
        <View style={styles.headerTextView}>
          <Text style={styles.headerText}>{props.header}</Text>
        </View>
        <View style={{flexDirection: "row", alignSelf: "flex-end"}}>
          <Icon
            name={"refresh"}
            size={30}
            onPress={props.refresh}/>
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
})

export default DisplayRoutes;
