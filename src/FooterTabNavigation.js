import React from "react";
import {Text, AppState} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MapDisplay from "./Map/MapDisplay.js";
import UnitPicker from "./InputScreen/unitInput.js";
import DistanceInput from "./InputScreen/distanceInput.js";
import InputScreen from "./InputScreen/InputScreen.js";

import "react-native-gesture-handler";

const Tab = createBottomTabNavigator();

export default class FooterNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      distance: "1",
      unit: "km",
      markers: [],
    }
  }

  componentDidMount = () => {
    AppState.addEventListener("change", this._handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    if (nextAppState === "background" || nextAppState === "inactive") {
      this.saveState;
    }
  }

  handleDistanceChange = (text) => {
    this.setState({distance: text})
  }

  handleUnitChange = (text) => {
    this.setState({unit: text})
  }

  getCurrentRegion = () => {
    return this.state.mapRegion;
  }

  getCurrentUnit = () => {
    return this.state.unit;
  }

  getCurrentDistance = () => {
    return this.state.distance;
  }

  updateMarkers = (coordinates) => {
    var updated = this.state.markers.concat(coordinates);
    this.setState({markers: updated});
  }

  clearMarkers = () => {
    this.setState({markers: []});
  }

  handleRegionChange = (region) => {
    region.latitudeDelta = this.state.mapRegion.latitudeDelta;
    region.longitudeDelta = this.state.mapRegion.longitudeDelta;
    this.setState({mapRegion: region});
  }


  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Setup">
            {() => <InputScreen
              getDistance={this.getCurrentDistance.bind(this)} updateDistance={this.handleDistanceChange.bind(this)}
              getUnit={this.getCurrentUnit.bind(this)} updateUnit={this.handleUnitChange.bind(this)}/>}
          </Tab.Screen>
          <Tab.Screen name="Display">
            {() => <Text>{this.state.distance} {this.state.unit}</Text>}
          </Tab.Screen>
          <Tab.Screen name="Map">
          {() => <MapDisplay getRegion={this.getCurrentRegion.bind(this)} onRegionChange={this.handleRegionChange.bind(this)} updateMarkers={this.updateMarkers.bind(this)} markers={this.state.markers} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
