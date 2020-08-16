import React, {useState, useEffect, useContext} from "react";
import {ScrollView, View, Text, StyleSheet, Button} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import {decode} from "@mapbox/polyline"

import UnitContext from "../Context/UnitContext";
import LiteView from "./LiteView";
import Splash from "./Splash";
import Header from "./Header";

function DisplayRoutes(props) {
  const [savedRoutes, updateRoutes] = useState(null);
  const unit = useContext(UnitContext);
  const [isLoading, updateLoading] = useState(true);
  const onRefresh = () => {
    updateRoutes(null);
  }

  const decodePolyline = (polyline) => {
    const points = decode(polyline);
    const directions = points.map(point => {
      return {
        latitude: point[0],
        longitude: point[1]
      }
    });
    return directions;
  }

  const decodeRoute = (route) => {
    const directions = route.flatMap((item) => decodePolyline(item));
    return directions;
  }

  useEffect(() => {
    setTimeout(() => {
      AsyncStorage.getAllKeys().then((keys) => {
        const saveKeys = keys.filter((key) => key.includes("saveRoute"));
        AsyncStorage.multiGet(saveKeys, (err, items) => {
          updateRoutes(items.map((item) => JSON.parse(item[1])));
        });
      });
    }, 200)
  }, [])

  if (!savedRoutes) {
    return (
      <Splash />
    )
  } else if (savedRoutes) {
    if (savedRoutes.length > 0) {
      return (
        <View style={styles.container}>
          <Header navigation={props.navigation} header={"Saved Routes"}/>
          <ScrollView contentContainerStyle={{flexGrow: .1}}>
            {savedRoutes.map((route, index) => {
              const showDistance = unit.value === "m" ? route.total : (unit.value === "km" ? route.conversion.km : route.conversion.mi);
              return (
                <LiteView
                  name={route.name.replace("saveRoute", "")}
                  distance={showDistance}
                  markers={route.markers}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default DisplayRoutes;
