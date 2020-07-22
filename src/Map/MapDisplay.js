import React from "react";
import {
  StyleSheet,
  View,
  Button
} from "react-native";
import MapView, {Marker, Polyline} from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import {decode} from "@mapbox/polyline";

const apiKey = "";

export default class MapDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marginBottom : 1,
      directions: null,
    }
  }
  componentDidMount() {
    this.findPosition(true);
    // this.getDirections("43.828221927142025,-79.28708653897047","43.827874594148206,-79.28570318967104");
  }

  _onMapReady = () => this.setState({marginBottom: 0});

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
        this.props.onRegionChange(newRegion);
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

  onLongPress = (e) => {
    var coordinate = e.nativeEvent.coordinate
    this.props.updateMarkers(coordinate);
  }

  async getDirections(start, end) {
    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${end}&key=AIzaSyAQ47bNWVzgTz9hPb2qHSfcizUm2xS1c0c`);
      const jsonResponse = await response.json();
      const points = decode(jsonResponse.routes[0].overview_polyline.points);
      const coords = points.map(point => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      });
      this.setState({coords});
      console.log(coords);
    }
    catch(error) {
      console.log(error);
    }
  }

  clearMarkers = () => {
    this.props.clearMarkers();
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
          {this.props.markers.map((coordinate) => {
            return(<Marker coordinate={coordinate}/>)
          })}
          <Polyline
            coordinates={this.props.markers}
            strokeWidth={6}
          />
        </MapView>
        <View style={styles.buttonView}>
          <Button title="Save Route"onPress={this.props.saveRoute} />
          <Button title="Clear Markers"onPress={this.clearMarkers} />
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
