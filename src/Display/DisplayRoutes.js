import React, {useState, useEffect} from "react";
import {ScrollView, View, Text, StyleSheet, Button} from "react-native";
import LiteView from "../Map/LiteView";
import AsyncStorage from "@react-native-community/async-storage";
import Splash from "./Splash";
import Header from "./Header";

function DisplayRoutes(props) {
  const [savedRoutes, updateRoutes] = useState(null);
  const onRefresh = () => {
    updateRoutes(null);
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
              return (
                <LiteView
                  name={route.name.replace("saveRoute", "")}
                  distance={route.distance}
                  markers={route.markers}
                  directions={route.directions}
                  unit={route.unit}
                  description={route.description}
                />)})}
          </ScrollView>
        </View>
      )
    }
    else {
      return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
          <Text>You have no saved routes</Text>
          <Button title="Go to Map" onPress={() => props.navigation.navigate("Map")}/>
        </View>)
    }
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default DisplayRoutes;
