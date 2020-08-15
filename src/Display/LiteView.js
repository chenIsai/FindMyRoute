import React from "react";
import {View, Text, Button, StyleSheet} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";
import LiteMap from "./LiteMap";


function LiteView(props) {
  let map = null;
  return(
    <View style={styles.container}>
      <View style={styles.map}>
        <LiteMap directions={props.directions} markers={props.markers}/>
      </View>
      <View style={styles.details}>
        <View style={{flex: .2, justifyContent: "center", borderBottomWidth: 1}}>
          <Text style={{fontSize: 20, fontWeight: "bold", paddingLeft: 7}}>{props.name}</Text>
        </View>
        <View style={{flex: 1, paddingLeft: 7}}>
          <Text style={{fontSize: 18,fontWeight: "bold", color: "#deac2c", top: 5}}>{props.distance}{props.unit}</Text>
          <Text style={{color: "#bd005f", top: 8}}>{props.description}</Text>
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
