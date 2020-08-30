import React, {useContext, useState, useRef} from "react";
import {View, Text, TouchableWithoutFeedback, StyleSheet, Alert, Animated} from "react-native";
import MapView, {Polyline} from "react-native-maps";

import UnitContext from "../../Context/UnitContext";
import RunContext from "../../Context/RunContext";

import Geolocation from "react-native-geolocation-service";
import RunDetails from "./RunDetails";
import Header from "../Components/Header";

const RunningScreen = (props) => {
  const run = useContext(RunContext);
  const [marginBottom, updateMargin] = useState(1);
  const [initialRegion, updateRegion] = useState(null);
  let mapRef = useRef(null);
  const toUserPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        const region = {
          latitude: position.coords["latitude"],
          longitude: position.coords["longitude"],
          latitudeDelta: 0.001,
          longitudeDelta: 0.005,
        };
        mapRef.current.animateToRegion(region);
      },
      error => {
        Alert.alert(error.message);
        throw error;
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 200 }
    );
  };

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} header={"Track Your Run"}/>
      <MapView
        style={{flex: .8, marginBottom}}
        ref={mapRef}
        showsUserLocation={true}
        followsUserLocation={true}
        zoomControlEnabled={true}
        onMapReady={() => {
          toUserPosition();
          updateMargin(0);
        }}
        >
        {run.directions.length ? (
          <Polyline
            coordinates={run.directions}
            strokeWidth={4}
          />
      ) : null}
      </MapView>
      <RunDetails />
    </View>
  )
}

export default RunningScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#84ebab"
  },
})
