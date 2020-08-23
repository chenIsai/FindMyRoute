import React from "react";
import {View, StyleSheet} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";

const LiteMap = (props) => {
  let map = null;
  return (
    <MapView
      liteMode
      style={{flex: 1}}
      ref={ref => {map = ref;}}
      showsUserLocation={false}
      initialRegion={{latitude: 0, longitude: 0, latitudeDelta: 0.0721, longitudeDelta: 0.0421}}
      onMapReady={() => {
        console.log(props.markers);
        if (props.markers.length) {
          map.fitToCoordinates(props.markers, {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: false,
          });
        } else {
          map.fitToCoordinates(props.directions, {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100}, animated: false,
          });
        }
        }}
      >
      {props.markers.map((coordinate) => {
        const key = coordinate.latitude.toString() + "," + coordinate.longitude.toString();
        return(<Marker coordinate={coordinate} key={key}/>)
      })}
      <Polyline
        coordinates={props.directions}
        strokeWidth={4}
      />
    </MapView>
  )
}
export default LiteMap;
