import React from "react";
import {
  StyleSheet,
  View,
  Button,
  Alert
} from "react-native";
import Picker from "@react-native-community/picker";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal"

import MapView, {Marker, Polyline} from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import {decode} from "@mapbox/polyline";

const apiKey = "";

export default class MapDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marginBottom : 1,
      calculated: this.props.route.value.length,
      totalMarkers: this.props.markers.value.length,
    }
  }

  componentDidMount() {
    this.findPosition(true);
  }

  componentDidUpdate(prevProps) {
    if (this.props.markers.value !== prevProps.markers.value) {
      this.getDirections();
    }
  }

  _onMapReady = () => this.setState({marginBottom: 0});


  onLongPress = (e) => {
    if (this.state.totalMarkers <= 9) {
      this.state.totalMarkers++;
      var coordinate = e.nativeEvent.coordinate
      this.props.markers.updateMarkers(coordinate);
      this.getDirections();
    } else {
      Alert.alert("Max number of markers reached!");
    }
  }

  findPosition = (animate) => {
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
          this.map.animateToRegion(newRegion);
        }
      },
      error => {
        Alert.alert(error.message);
        throw error;
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 200 }
    );
  };


  mergeCoords = (startLoc, endLoc) => {
    const start = `${startLoc.latitude},${startLoc.longitude}`;
    const end = `${endLoc.latitude},${endLoc.longitude}`;
    return {start, end};
  }


  async getDirections() {
    if (this.state.calculated >= this.props.markers.value.length-1) {
      return;
    }
    var merged = this.mergeCoords(this.props.markers.value[this.state.calculated], this.props.markers.value[this.state.calculated+1]);
    var start = merged.start;
    var end = merged.end;

    try {
      const raw = await fetch(`https://maps.googleapis.com/maps/api/directions/json?mode=walking&origin=${start}&destination=${end}&key=${apiKey}`);
      const response = await raw.json();
      this.props.route.updateRoute(response.routes[0].overview_polyline.points);
      this.props.distance.updateDistance(response.routes[0].legs[0].distance.value);
      const updated = this.decodeResponse(response);
      this.setState({directions: updated.directions, calculated: updated.calculated}, () => {
        this.props.directions.updateDirections(updated.directions);
        this.getDirections();
      });
    }
    catch(error) {
      console.log(error);
    }
  }

  decodeResponse = (response) => {
    const points = decode(response.routes[0].overview_polyline.points);
    const directions = points.map(point => {
      return {
        latitude: point[0],
        longitude: point[1]
      }
    });
    const newDirections = this.props.directions.value.concat(directions);
    const calculated = this.state.calculated+1;
    return {directions: newDirections, calculated};
  }


  clearMarkers = () => {
    this.props.markers.clearMarkers();
    this.setState({calculated: 0, directions: [], totalMarkers: 0});
    this.props.distance.clearDistance();
    this.props.route.clearRoute();
    this.props.directions.updateDirections([]);
    this.forceUpdate();
  }


  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={(map) => {this.map = map;}}
          showsUserLocation={true}
          style={{flex: 1, marginBottom: this.state.marginBottom}}
          onMapReady={this._onMapReady}
          onLongPress={this.onLongPress}
          >
          {this.props.markers.value.map((coordinate, index) => {
            return (<Marker coordinate={coordinate} key={index}/>)
          })}
          <Polyline
            coordinates={this.props.directions.value}
            strokeWidth={6}
          />
        </MapView>
        <View style={styles.menuView}>
          <Icon
            name={"md-menu"}
            size={30}
            onPress={() => this.props.navigation.openDrawer()}
          />
        </View>
        <View style={(styles.iconStyles)}>
          <Icon
            name={"add-outline"}
            size={30}
            onPress={() => console.log("Open tray")} />
        </View>
        <View style={[styles.iconStyles, {bottom: 75}]}>
          <Icon
            name={"save-outline"}
            size={30}
            onPress={() => {
              if (this.props.markers.value.length > 1 && this.props.directions.value.length) {
                this.props.navigation.push("SaveScreen")
              } else {
                Alert.alert("Invalid Route Selected!");
              }
            }} />
          </View>
        <View style={[styles.iconStyles, {bottom: 130}]}>
          <Icon
            name={"trash-outline"}
            size={30}
            onPress={() => this.clearMarkers()} />
        </View>
      </View>
    );
  }
}

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
