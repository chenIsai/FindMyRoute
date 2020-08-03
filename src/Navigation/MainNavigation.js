import React from "react";
import {View, Text} from "react-native";

import {createDrawerNavigator} from "@react-navigation/drawer";
import {createStackNavigator} from "@react-navigation/stack";
import {NavigationContainer} from "@react-navigation/native";

import DistanceContext from "../Context/DistanceContext";
import MarkersContext from "../Context/MarkersContext";
import UnitContext from "../Context/UnitContext";
import RouteContext from "../Context/RouteContext";

import AsyncStorage from "@react-native-community/async-storage";

import Footer from "./Footer";

function Temp() {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
      <Text>TEMP</Text>
    </View>
  )
}

const Drawer = createDrawerNavigator();

class MainNavigator extends React.Component {
  constructor(props) {
    super(props);
    this.updateDistance = (value) => {
      distance = {...this.state.distance};
      distance.value = value;
      this.setState(state => ({distance}));
      AsyncStorage.setItem("distance", distance.value.toString());
    }

    this.updateUnit = (value) => {
      unit = {...this.state.unit};
      unit.value = value;
      this.setSTate(state => ({unit}));
      AsyncStorage.setitem("unit", unit.value);
    }

    this.clearMarkers = () => {
      markers = {...this.state.markers};
      markers.value = [];
      this.setState(state => ({markers}));
      AsyncStorage.removeItem("markers");
    }

    this.updateMarkers = (coordinates) => {
      markers = {...this.state.markers};
      markers.value = markers.value.concat(coordinates);
      this.setState(state => ({markers}));
      AsyncStorage.setItem("markers", JSON.stringify(markers.value));
    }

    this.updateRoute = (routeJSON) => {
      route = {...this.state.route};
      route.value = route.value.concat(routeJSON);
      this.setState(state => ({route}));
      AsyncStorage.setItem("route", JSON.stringify(route.value));
    }

    this.clearRoute = () => {
      route = {...this.state.route};
      route.value = [];
      this.setState(state => ({route}));
      AsyncStorage.removeItem("route");
    }

    this.state = {
      mapRegion: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      distance: {
        value: 0,
        updateDistance: this.updateDistance,
      },
      unit: {
        value: "m",
        updateUnit: this.updateUnit,
      },
      markers: {
        value: [],
        updateMarkers: this.updateMarkers,
        clearMarkers: this.clearMarkers,
      },
      route: {
        value: null,
        updateRoute: this.updateRoute,
        clearRoute: this.clearRoute,
      }
    }
  }

  componentDidMount = () => {
    this._loadState();
  }

  _loadState = async () => {
    const keys = ["unit", "distance", "markers", "route"];
    AsyncStorage.multiGet(keys, (err, items) => {
      var unit = {...this.state.unit};
      var distance = {...this.state.distance};
      var markers = {...this.state.markers};
      var route = {...this.state.route};
      unit.value = items[0][1] !== null ? items[0][1] : "m";
      distance.value = items[1][1] !== null ? parseInt(items[1][1]) : 0;
      markers.value = items[2][1] !== null ? JSON.parse(items[2][1]) : [];
      route.value = items[3][1] !== null ? JSON.parse(items[3][1]) : [];
      this.setState({unit, distance, markers, route});
    });
  }

  render() {
    return(
      <NavigationContainer>
        <RouteContext.Provider value={this.state.route}>
          <UnitContext.Provider value={this.state.unit}>
            <DistanceContext.Provider value={this.state.distance}>
              <MarkersContext.Provider value={this.state.markers}>
                <Drawer.Navigator initlaRouteName="Home">
                  <Drawer.Screen name="Home" component={Footer} />
                  <Drawer.Screen name="Saved Routes" component={Temp}/>
                </Drawer.Navigator>
              </MarkersContext.Provider>
            </DistanceContext.Provider>
          </UnitContext.Provider>
        </RouteContext.Provider>
      </NavigationContainer>
    );
  }
}

export default MainNavigator;
