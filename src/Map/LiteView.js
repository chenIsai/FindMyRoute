import React from "react";
import {View, Text, Button} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";

function LiteView(props) {
  let map = null;
  return(
    <View style={{flex: 1}}>
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
  )
}

export default LiteView;
