import React from "react"

import DistanceContext from "../Context/DistanceContext";
import MarkersContext from "../Context/MarkersContext";
import UnitContext from "../Context/UnitContext";
import RouteContext from "../Context/RouteContext";
import DirectionsContext from "../Context/DirectionsContext";
import AuthContext from "../Context/AuthContext";

import AsyncStorage from "@react-native-community/async-storage";
import AppNavigator from "../Navigation/AppNavigator";
import link from "../Authentication/link";

export default class ContextProvider extends React.Component {
  constructor(props) {
    super(props);

    // Distance
    this.updateDistance = (value) => {
      const distance = {...this.state.distance};
      distance.value = distance.value.concat(value);
      distance.total = distance.value.reduce((total, next) => total + next, 0);
      this.setState(state => ({distance}));
    }

    this.clearDistance = () => {
      const distance = {...this.state.distance};
      distance.value = [];
      distance.total = 0;
      this.setState(state=> ({distance}));
    }

    // Unit
    this.updateUnit = (value) => {
      const unit = {...this.state.unit};
      unit.value = value;
      this.setState(state => ({unit}));
      AsyncStorage.setItem("unit", unit.value);
    }

    // Markers
    this.clearMarkers = () => {
      const markers = {...this.state.markers};
      markers.value = [];
      this.setState(state => ({markers}));
    }

    this.updateMarkers = (coordinates) => {
      const markers = {...this.state.markers};
      markers.value = markers.value.concat(coordinates);
      this.setState(state => ({markers}));
    }

    // Current route
    this.updateRoute = (overview_polyline) => {
      const route = {...this.state.route};
      route.value = route.value.concat(overview_polyline);
      this.setState(state => ({route}));
    }

    this.clearRoute = () => {
      const route = {...this.state.route};
      route.value = [];
      this.setState(state => ({route}));
    }

    // Current Directions (decoded route)
    this.updateDirections = (updated) => {
       const directions = {...this.state.directions};
       directions.value = updated;
       this.setState(state => ({directions}));
    }

    //  Access and Refresh tokens
    this.updateAccess = (token) => {
      const tokens = {...this.state.tokens};
      tokens.accessToken = token;
      AsyncStorage.setItem("access", token);
      this.setState(state => ({tokens}));
    }

    this.updateRefresh = (token) => {
      const tokens = {...this.state.tokens};
      tokens.refreshToken = token;
      AsyncStorage.setItem("refresh", token);
      this.setState(state => ({tokens}));
    }

    this.refreshAccessToken = () => {
      if (this.state.tokens.refreshToken !== "" && this.state.tokens.refreshToken) {
        fetch(link.refresh, {
          method: "POST",
          body: JSON.stringify({token: this.state.tokens.refreshToken}),
          headers: {"Content-Type": "application/json"}
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.status;
        }).then((data) => {
          if (Number.isInteger(data)) {
            return false;
          }
          this.state.tokens.updateRefresh(data.refreshToken);
          this.state.tokens.updateAccess(data.accessToken);
          return true;
        }).catch((error) => {
          console.log(error);
          return false;
        });
      }
    }

    this.state = {
      tokens: {
        accessToken: null,
        refreshToken: null,
        updateAccess: this.updateAccess,
        updateRefresh: this.updateRefresh,
        refreshAccess: this.refreshAccessToken,
      },
      mapRegion: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      distance: {
        value: [],
        total: 0,
        updateDistance: this.updateDistance,
        clearDistance: this.clearDistance,
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
        value: [],
        updateRoute: this.updateRoute,
        clearRoute: this.clearRoute,
      },
      directions: {
        value: [],
        updateDirections: this.updateDirections,
      },
      isLoading: true,
    }
  }

  componentDidMount = () => {
    this._loadState();
  }

  _loadState = async () => {
    const keys = ["unit", "access", "refresh"];

    AsyncStorage.multiGet(keys, (err, items) => {
      var tokens = {...this.state.tokens};
      var unit = {...this.state.unit};

      unit.value = items[0][1] !== null ? items[0][1] : "m";
      tokens.accessToken = items[1][1] !== null ? items[1][1] : "";
      tokens.refreshToken = items[2][1] !== null ? items[2][1] : "";
      this.setState({unit, tokens, isLoading: false});
    }).then(this.refreshAccessToken);
  }

  render() {
    return (
      <AuthContext.Provider value={this.state.tokens}>
        <DirectionsContext.Provider value={this.state.directions}>
          <RouteContext.Provider value={this.state.route}>
            <UnitContext.Provider value={this.state.unit}>
              <DistanceContext.Provider value={this.state.distance}>
                <MarkersContext.Provider value={this.state.markers}>
                  <AppNavigator isLoading={this.state.isLoading}/>
                </MarkersContext.Provider>
              </DistanceContext.Provider>
            </UnitContext.Provider>
          </RouteContext.Provider>
        </DirectionsContext.Provider>
      </AuthContext.Provider>
    )
  }
}
