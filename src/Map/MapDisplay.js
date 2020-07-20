import React from "react";
import {
  StyleSheet,
  View,
  Button
} from "react-native";
import MapView, {Marker} from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";

export default class MapDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      marginBottom : 1
    }
  }
  componentDidMount() {
    this.findPosition(true);
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
    console.log(coordinate);
    this.props.updateMarkers(coordinate);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          ref={(map) => {this.map = map;}}
          showsUserLocation={true}
          style={{flex: 1, marginBottom: this.state.marginBottom}}
          onMapReady={this._onMapReady}
          initialRegion={this.props.getRegion()}
          onLongPress={this.onLongPress}
          >
          {this.props.markers.map((coordinate) => {
            return(<Marker coordinate={coordinate}/>)
          })}
        </MapView>
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
});
