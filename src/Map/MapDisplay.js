import React from "react";
import {
  StyleSheet,
  View,
  Button
} from "react-native";
import Picker from "@react-native-community/picker";

import MapView, {Marker, Polyline, Alert} from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import {decode} from "@mapbox/polyline";

const apiKey = "";

export default class MapDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marginBottom : 1,
      directions: [],
      calculated: 0,
      showDialog: false,
    }
  }


  componentDidMount() {
    this.findPosition(true);
  }


  _onMapReady = () => this.setState({marginBottom: 0});


  onLongPress = (e) => {
    var coordinate = e.nativeEvent.coordinate
    this.props.markers.updateMarkers(coordinate);
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
      return [];
    }
    var merged = this.mergeCoords(this.props.markers.value[this.state.calculated], this.props.markers.value[this.state.calculated+1]);
    var start = merged.start;
    var end = merged.end;

    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?mode=walking&origin=${start}&destination=${end}&key=${apiKey}`);
      const jsonResponse = await response.json();
      const points = decode(jsonResponse.routes[0].overview_polyline.points);
      const directions = points.map(point => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      });
      const newDirections = this.state.directions.concat(directions);
      const oldDistance = this.props.distance.value;
      const addDistance = jsonResponse.routes[0].legs[0].distance.value;
      const newDistance = Number.isInteger(oldDistance) ? oldDistance + addDistance : addDistance;
      console.log(newDistance);
      const calculated = this.state.calculated+1;
      this.props.distance.updateDistance(newDistance);
      this.setState({directions: newDirections, calculated}, () => {
        this.getDirections();
      });
    }
    catch(error) {
      console.log(error);
    }
  }


  clearMarkers = () => {
    this.props.markers.clearMarkers();
    this.setState({calculated: 0, directions: []});
    this.props.distance.updateDistance(0);
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
          {this.props.markers.value.map((coordinate) => {
            const key = coordinate.latitude.toString() + "," + coordinate.longitude.toString();
            return(<Marker coordinate={coordinate} key={key}/>)
          })}
          <Polyline
            coordinates={this.state.directions}
            strokeWidth={6}
          />
        </MapView>
        <View style={styles.buttonView}>
          <Button title="Save Route"onPress={() => this.props.navigation.push("SaveScreen")} />
          <Button title="Clear Markers"onPress={this.clearMarkers} />
          <Button title="Calculate Route"onPress={() => this.getDirections()} />
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
    alignSelf: "flex-end",
    flexDirection: "row",
  }
});
