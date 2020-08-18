import React from "react";
import {View, Text, Button, StyleSheet} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";
import LiteMap from "./LiteMap";
import Icon from "react-native-vector-icons/Ionicons";


function LiteView(props) {
  let map = null;
  return(
    <View style={styles.container}>
      <View style={styles.map}>
        <LiteMap directions={props.directions} markers={props.markers}/>
      </View>
      <View style={styles.details}>
        <View style={{flex: .2, justifyContent: "flex-start", borderBottomWidth: 1, flexDirection: "row"}}>
          <Text style={{fontSize: 20, fontWeight: "bold", paddingLeft: 7}}>{props.name}</Text>
          <View style={{flexDirection: "row", marginLeft: "auto", justifyContent: "center"}}>
            <Icon
              style={{padding: 5}}
              name={"create-outline"}
              size={20}
              onPress={() => console.log("Edit")}
              />
            <Icon
              style={{padding: 5}}
              name={"md-trash-outline"}
              size={20}
              onPress={() => console.log("Delete")}
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
    flex: 1,
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
