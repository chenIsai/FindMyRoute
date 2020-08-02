import React from "react";
import {View, Text, Button} from "react-native";
import MapView, {Marker} from "react-native-maps";
import MarkersContext from "../Context/MarkersContext";
import AsyncStorage from "@react-native-community/async-storage";

function LiteView() {
  let map = null;
  markers = [{"longitude":-79.28840048611164,"latitude":43.81451041427495},{"longitude":-79.26965486258268,"latitude":43.81614656577617},{"longitude":-79.26990665495396,"latitude":43.82974402484469}]
  if (!markers) {
    console.log(markers);
    return <View><Text>Eat my ass</Text></View>
  }
  return(
    <View style={{flex: 1}}>
      <MapView
        liteMode
        style={{flex: 1}}
        ref={ref => {map = ref;}}
        showsUserLocation={false}
        initialRegion={{latitude: 0, longitude: 0, latitudeDelta: 0.0721, longitudeDelta: 0.0421}}
        onMapReady={() =>{
            map.fitToCoordinates(markers, {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true,
    });
          }}
        >
        {markers.map((coordinate) => {
          const key = coordinate.latitude.toString() + "," + coordinate.longitude.toString();
          return(<Marker coordinate={coordinate} key={key}/>)
        })}
      </MapView>
    </View>
  )
}

export default LiteView;
