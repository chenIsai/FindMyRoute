import React, {useState} from "react";
import {ScrollView, View, Text, StyleSheet} from "react-native";
import LiteView from "../Map/LiteView";
import AsyncStorage from "@react-native-community/async-storage";

function DisplayView() {
  const [savedRoutes, updateRoutes] = useState(null);

  const onRefresh = () => {
    updateRoutes(null);
  }

  if (!savedRoutes) {
    AsyncStorage.getAllKeys().then((keys) => {
      const saveKeys = keys.filter((key) => key.includes("saveRoute"));
      AsyncStorage.multiGet(saveKeys, (err, items) => {
        updateRoutes(items.map((item) => JSON.parse(item[1])));
      });
    });
    return (
      <View><Text>Loading</Text></View>
    )
  } else if (savedRoutes) {
    console.log(savedRoutes);
    return (
      <View style={styles.container}>
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
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default DisplayView;
