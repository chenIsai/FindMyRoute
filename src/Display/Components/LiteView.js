import React from "react";
import {View, Text, Button, StyleSheet} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";
import LiteMap from "./LiteMap";
import Icon from "react-native-vector-icons/Ionicons";

// Displays map and details about the saved route
function LiteView(props) {
  let map = null;
  return(
    <View style={styles.container}>
      <View style={styles.map}>
        <LiteMap route={props.route} markers={props.markers}/>
          <Icon
            style={{position: "absolute", bottom: 0, right: 0, padding: 5}}
            name={"open-outline"}
            size={20}
            onPress={() => props.open(props.distance, props.route, props.markers)}
            />
      </View>
      <View style={styles.details}>
        <View style={{flex: .2, justifyContent: "flex-start", borderBottomWidth: 1, flexDirection: "row"}}>
          <Text style={{fontSize: 20, fontWeight: "bold", paddingLeft: 7}}>{props.name}</Text>
          <View style={{flexDirection: "row", marginLeft: "auto", justifyContent: "center"}}>
            <Icon
              style={{padding: 5}}
              name={"create-outline"}
              size={20}
              onPress={() => props.edit(props.name, props.description)}
              />
            <Icon
              style={{padding: 5}}
              name={"md-trash-outline"}
              size={20}
              onPress={() => props.delete(props.name)}
              />
          </View>
        </View>
        <View style={{flex: 1, paddingLeft: 7}}>
          <Text style={{fontSize: 18,fontWeight: "bold", color: "#deac2c", top: 5}}>{props.distance}{props.unit}</Text>
          <Text style={{color: "#bd005f", top: 8, paddingBottom: 45}}>{props.description}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    margin: 5,
    flexDirection: "row",
    backgroundColor: "white",
  },
  map: {
    flex: .4,
  },
  details: {
    flex: .6,
    padding: 4,
    backgroundColor: "#b0f5f2"
  }
})

export default LiteView;
