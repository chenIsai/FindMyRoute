import React from "react";
import {View, Text, Button, StyleSheet} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";
import {Badge} from "native-base";

function LiteView(props) {
  let map = null;
  return(
    <View style={styles.container}>
      <View style={styles.map}>
        <MapView
          liteMode
          style={{flex: 1}}
          ref={ref => {map = ref;}}
          showsUserLocation={false}
          initialRegion={{latitude: 0, longitude: 0, latitudeDelta: 0.0721, longitudeDelta: 0.0421}}
          onMapReady={() =>{
              map.fitToCoordinates(props.markers, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
            }}
          >
          {props.markers.map((coordinate) => {
            const key = coordinate.latitude.toString() + "," + coordinate.longitude.toString();
            return(<Marker coordinate={coordinate} key={key}/>)
          })}
          <Polyline
            coordinates={props.directions}
            strokeWidth={6}
          />
        </MapView>
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
