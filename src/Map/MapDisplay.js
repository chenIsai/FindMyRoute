import React, {useState, useRef, useEffect, useContext} from "react";
import {
  StyleSheet,
  View,
  Button,
  Alert,
  Animated,
  TouchableWithoutFeedback,
  Text
} from "react-native";
import Picker from "@react-native-community/picker";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal"
import links from "../Authentication/link";

import DistanceContext from "../Context/DistanceContext";
import UnitContext from "../Context/UnitContext";
import MarkersContext from "../Context/MarkersContext";
import RouteContext from "../Context/RouteContext";
import DirectionsContext from "../Context/DirectionsContext";

import MapView, {Marker, Polyline} from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import {decode} from "@mapbox/polyline";

const apiKey = links.key;

const MapDisplay = (props) => {
  const distance = useContext(DistanceContext);
  const markers = useContext(MarkersContext);
  const route = useContext(RouteContext);
  const unit = useContext(UnitContext);
  const directions = useContext(DirectionsContext);
  const showDistance = unit.value === "km" ? Math.round((distance.total/1000 + Number.EPSILON) * 100)/100 : Math.round((distance.total/1609 + Number.EPSILON) * 100)/100;

  const mapRef = useRef(null);
  const [marginBottom, updateMargin] = useState(1);
  const [calculated, updateCalculated] = useState(route.value.length);
  const [totalMarkers, updateTotalMarkers] = useState(markers.value.length);
  const [trayVisible, setVisible] = useState(true);

  const slideSave = useRef(new Animated.Value(0)).current;
  const fadeSave = useRef(new Animated.Value(1)).current;
  const slideDelete = useRef(new Animated.Value(0)).current;
  const fadeDelete = useRef(new Animated.Value(1)).current;
  const TouchableAnimated = Animated.createAnimatedComponent(TouchableWithoutFeedback);

  const slideButton = (button, value, duration) => {
    Animated.timing(button, {toValue: value, duration, useNativeDriver: true}).start();
  }

  const fadeButton = (button, value, duration) => {
    Animated.timing(button, {toValue: value, duration, useNativeDriver: true}).start();
  }

  const hideButtons = () => {
    slideButton(slideSave, 55, 100);
    slideButton(slideDelete, 110, 200);
    fadeButton(fadeSave, 0, 100);
    fadeButton(fadeDelete, 0, 200);
    setVisible(false);
  }

  const showButtons = () => {
    slideButton(slideSave, 0, 100);
    slideButton(slideDelete, 0, 200);
    fadeButton(fadeSave, 1, 100);
    fadeButton(fadeDelete, 1, 200);
    setVisible(true);
  }

  const findPosition = (animate) => {
    Geolocation.getCurrentPosition(
      position => {
        var lat = position.coords["latitude"];
        var lon = position.coords["longitude"];

        var newRegion = {
          latitude: lat,
          longitude: lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        if (animate) {
          mapRef.current.animateToRegion(newRegion);
        }
      },
      error => {
        Alert.alert(error.message);
        throw error;
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 200 }
    );
  };

  const _onMapReady = () => {
    updateMargin(0);
  }

  const onLongPress = (e) => {
    if (totalMarkers <= 9) {
      updateTotalMarkers(totalMarkers+1);
      const coordinate = e.nativeEvent.coordinate;
      markers.updateMarkers(coordinate);
    } else {
      Alert.alert("Max number of markers reached!");
    }
  }

  const mergeCoords = (startLoc, endLoc) => {
    const start = `${startLoc.latitude},${startLoc.longitude}`;
    const end = `${endLoc.latitude},${endLoc.longitude}`;
    return {start, end};
  }

  const getDirections = async () => {
    if (calculated >= markers.value.length-1) {
      return;
    }
    var merged = mergeCoords(markers.value[calculated], markers.value[calculated+1]);
    var start = merged.start;
    var end = merged.end;

    try {
      const raw = await fetch(`https://maps.googleapis.com/maps/api/directions/json?mode=walking&origin=${start}&destination=${end}&key=${apiKey}`);
      const response = await raw.json();
      route.updateRoute(response.routes[0].overview_polyline.points);
      distance.updateDistance(response.routes[0].legs[0].distance.value);
      const updated = decodeResponse(response);
      updateCalculated(updated.calculated);
      directions.updateDirections(updated.directions);
    }
    catch(error) {
      console.log(error);
    }
  }

  const decodeResponse = (response) => {
    const points = decode(response.routes[0].overview_polyline.points);
    const decoded = points.map(point => {
      return {
        latitude: point[0],
        longitude: point[1]
      }
    });
    const newDirections = directions.value.concat(decoded);
    const totalCalculated = calculated+1
    return {directions: newDirections, calculated: totalCalculated};
  }

  const clearMarkers = () => {
    markers.clearMarkers();
    updateCalculated(0);
    updateTotalMarkers(0);
    distance.clearDistance();
    route.clearRoute();
    directions.updateDirections([]);
  }

  useEffect(() => {
    findPosition(true);
    hideButtons();
  }, [])

  useEffect(() => {
    getDirections();
  }, [markers.value])

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        showsUserLocation={true}
        style={{flex: 1, marginBottom: marginBottom}}
        onMapReady={_onMapReady}
        onLongPress={onLongPress}
        >
        {markers.value.map((coordinate, index) => {
          return (<Marker coordinate={coordinate} key={index}/>)
        })}
        <Polyline
          coordinates={directions.value}
          strokeWidth={6}
        />
      </MapView>
      <View style={styles.distanceView}>
        <Text style={{fontSize: 20, fontWeight: "bold", color: "grey"}}>{showDistance} {unit.value}</Text>
      </View>
      <View style={styles.menuView}>
        <Icon
          name={"md-menu"}
          size={30}
          onPress={() => props.navigation.openDrawer()}
        />
      </View>
      <View style={(styles.iconStyles)}>
        <Icon
          name={trayVisible ? "close-outline" : "add-outline"}
          size={30}
          onPress={() => {
            if (trayVisible) {
              hideButtons();
            } else {
              showButtons();
            }
          }} />
      </View>
      <TouchableAnimated style={[{opacity: fadeSave}, {transform: [{translateY: slideSave}]}]}
        onPress={() => {
          if (!trayVisible) {
            showButtons();
          } else {
            if (directions.value.length) {
              props.navigation.push("SaveScreen")
            } else {
              Alert.alert("Invalid Route Selected!");
            }
          }
        }}
        >
        <View style={[styles.iconStyles, {bottom: 130}]}>
          <Icon
            name={"save-outline"}
            size={30}
          />
        </View>
      </TouchableAnimated>
      <TouchableAnimated style={[{opacity: fadeDelete}, {transform: [{translateY: slideDelete}]}]}
        onPress={() => {
          if (!trayVisible) {
            showButtons();
            return;
          }
          clearMarkers()
        }}
        >
        <View style={[styles.iconStyles, {bottom: 75}]}>
          <Icon
            name={"trash-outline"}
            size={30}
          />
        </View>
      </TouchableAnimated>
    </View>
  );
}

export default MapDisplay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },

  map: {
    flex: 1,
    zIndex: -1
  },

  buttonView: {
    position: "absolute",
    bottom: 0,
    alignSelf: "flex-start",
    flexDirection: "row",
  },
// 9AD1E2
  distanceView: {
    position: "absolute",
    backgroundColor: "#cbf2ef",
    padding: 5,
    alignSelf: "baseline",
    bottom: 40,
    left: 10,
  },

  menuView: {
    position: "absolute",
    backgroundColor: "white",
    padding: 5,
    top: 10,
    left: 10,
    borderRadius: 30,
    borderWidth: 0.2,
    elevation: 4,
    alignSelf: "flex-start",
  },

  iconStyles: {
    position: "absolute",
    backgroundColor: "white",
    padding: 8,
    bottom: 20,
    right: 15,
    borderRadius: 30,
    borderWidth: 0.2,
    elevation: 4,
  },
});
