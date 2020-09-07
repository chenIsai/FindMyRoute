import React, {useContext, useState, useRef, useEffect} from "react";
import {View, Text, TouchableWithoutFeedback, StyleSheet, Alert, Animated, PermissionsAndroid} from "react-native";
import MapView, {Polyline} from "react-native-maps";

import UnitContext from "../../Context/UnitContext";
import RunContext from "../../Context/RunContext";

import Geolocation from "react-native-geolocation-service";
import RunDetails from "./RunDetails";
import Swiper from "./Swiper";
import Header from "../Components/Header";

const RunView = (props) => {
  const [locationPermission, setPermission] = useState(false);
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

  useEffect(() => {
    if (!locationPermission) {
      requestLocationPermission();
    }
  }, []);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermission(true);
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (!locationPermission) {
    return (
      <View>
        <Text>Location Permission Required</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header navigation={props.navigation} header={"Track Your Run"}/>
      <MapView
        style={{flex: .8, marginBottom}}
        ref={mapRef}
        showsUserLocation={locationPermission}
        followsUserLocation={locationPermission}
        zoomControlEnabled={true}
        onMapReady={() => {
          if (locationPermission) {
            toUserPosition();
          }
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
      <Swiper navigation={props.navigation}/>
    </View>
  )
}

export default RunView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
