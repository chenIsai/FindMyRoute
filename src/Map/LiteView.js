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
        <Badge info>
          <Text>Name: {props.name}</Text>
        </Badge>
        <Badge info>
          <Text>Distance:  {props.distance}{props.unit}</Text>
        </Badge>
        <Text>Description: {props.description}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    flexDirection: "row",
    borderColor: "lightgrey",
  },
  map: {
    flex: .4,
  },
  details: {
    flex: .6,
    borderLeftWidth: 1,
    padding: 4,
    borderColor: "lightgrey",
  }
})

export default LiteView;
