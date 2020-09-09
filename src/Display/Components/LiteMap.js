import React from "react";
import {View, StyleSheet} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";

// Renders non-interactable map centered around a set of coordinates
const LiteMap = (props) => {
  let map = null;
  const willRenderMarkers = props.markers && props.markers.length;
  const willRenderRoute = props.route && props.route.length;
  return (
    <MapView
      liteMode
      style={{flex: 1}}
      ref={ref => {map = ref;}}
      showsUserLocation={false}
      initialRegion={{latitude: 0, longitude: 0, latitudeDelta: 0.0721, longitudeDelta: 0.0421}}
      onMapReady={() => {
        // Center map around either markers or route if provided
        if (willRenderMarkers) {
          map.fitToCoordinates(props.markers, {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
            animated: false,
          });
        } else if (willRenderRoute) {
          map.fitToCoordinates(props.route, {
            edgePadding: { top: 100, right: 100, bottom: 100, left: 100}, animated: false,
          });
        }
        }}
      >
      {willRenderMarkers ? (
        props.markers.map((coordinate) => {
          const key = coordinate.latitude.toString() + "," + coordinate.longitude.toString();
          return(<Marker coordinate={coordinate} key={key}/>)
        })) : null
      }
      {willRenderRoute ? (
        <Polyline
          coordinates={props.route}
          strokeWidth={4}
        />
      ) : null}
    </MapView>
  )
}
export default LiteMap;
