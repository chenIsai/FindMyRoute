import React from "react";
import {Text, AppState, Alert} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MapDisplay from "./Map/MapDisplay.js";
import UnitPicker from "./InputScreen/unitInput.js";
import DistanceInput from "./InputScreen/distanceInput.js";
import InputScreen from "./InputScreen/InputScreen.js";

import AsyncStorage from "@react-native-community/async-storage";

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
      route: [],
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem("distance").then((distance) => {
      this.setState({distance});
    });
    AsyncStorage.getItem("unit").then((unit) => {
      this.setState({unit});
    });
    AsyncStorage.getItem("markers").then((markersString) => {
      if (markersString === null) {
        return;
      }
      markers = JSON.parse(markersString);
      this.setState({markers});
    })
    this.forceUpdate();
  }

  // componentDidMount = () => {
  //   AppState.addEventListener("change", this._handleAppStateChange)
  // }
  //
  // componentWillUnmount() {
  //   AppState.removeEventListener("change", this._handleAppStateChange);
  // }
  //
  // _handleAppStateChange = nextAppState => {
  //   if (nextAppState === "background" || nextAppState === "inactive") {
  //     this.saveState;
  //   }
  // }

  saveRoute = (name) => {
    if ((this.state.route.length < 2) || (this.state.markers.length < 2)) {
      Alert.alert("Invalid route selected!");
      return;
    }
    const copyOfRoute = [...this.state.route];
    const copyOfMarkers = [...this.state.markers];
    const distance = this.state.distance;
    const unit = this.state.unit;
    const newRoute = {
      route: {copyOfRoute},
      markers: {copyOfMarkers},
      distance: {distance},
      unit: {unit},
      name: {name},
    };
    AsyncStorage.setItem(name, newRoute);
  }

  handleDistanceChange = (text) => {
    AsyncStorage.setItem("distance", text);
    this.setState({distance: text})
  }

  handleUnitChange = (text) => {
    AsyncStorage.setItem("unit", text);
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
    AsyncStorage.setItem("markers", JSON.stringify(updated));
  }

  clearMarkers = () => {
    this.setState({markers: []});
    AsyncStorage.removeItem("markers");
  }

  // saveState = async() => {
  //   console.log("ashdkja");
  //   try {
  //     const items = [["@saveDistance", this.state.distance], ["@saveUnit", this.state.unit], ["@saveRegion", this.state.mapRegion]];
  //     await AsyncStorage.multiSet(items);
  //   } catch (e) {
  //     alert(e);
  //   }
  // }
  //
  // retrieveOldState = async() => {
  //   try {
  //     await AsyncStorage.multiGet(["@saveDistance", "@saveUnit", "@saveRegion"]).then(data => {
  //       // this.setState({mapRegion: {data[2][1]}, distance: {data[0][1]}, unit: {data[1][1]}});
  //       console.log(data[2][1]);
  //       console.log(data[0][1]);
  //       console.log(data[1][1]);
  //     })
  //   } catch (e) {
  //     alert(e);
  //   }
  // }

  handleRegionChange = (region) => {
    region.latitudeDelta = this.state.mapRegion.latitudeDelta;
    region.longitudeDelta = this.state.mapRegion.longitudeDelta;
    this.setState({mapRegion: region});
  }


  // <Tab.Screen name="Setup">
  //   {() => <InputScreen
  //     getDistance={this.getCurrentDistance.bind(this)} updateDistance={this.handleDistanceChange.bind(this)}
  //     getUnit={this.getCurrentUnit.bind(this)} updateUnit={this.handleUnitChange.bind(this)}/>}
  // </Tab.Screen>
  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Display">
            {() => <Text>{JSON.stringify(this.state)}</Text>}
          </Tab.Screen>
          <Tab.Screen name="Map">
          {() => <MapDisplay getRegion={this.getCurrentRegion.bind(this)}
            onRegionChange={this.handleRegionChange.bind(this)} updateMarkers={this.updateMarkers.bind(this)} markers={this.state.markers}
            clearMarkers={this.clearMarkers.bind(this)}
            saveRoute={this.saveRoute.bind(this)}
            />
          }
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
