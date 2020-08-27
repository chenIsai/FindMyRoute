import React from "react"

import DistanceContext from "../Context/DistanceContext";
import MarkersContext from "../Context/MarkersContext";
import UnitContext from "../Context/UnitContext";
import RouteContext from "../Context/RouteContext";
import DirectionsContext from "../Context/DirectionsContext";
import RunContext from "../Context/RunContext";
import UserContext from "../Context/UserContext";
import AuthContext from "../Context/AuthContext";

import AsyncStorage from "@react-native-community/async-storage";
import AppNavigator from "../Navigation/AppNavigator";
import links from "../Authentication/link";

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
    },

    // Live tracking user runs

    this.setRunning = () => {
      const run = {...this.state.run};
      run.isRunning = !run.isRunning;
      this.setState(state => ({run}));
    },

    this.updateRunDistance = (distance, add=true) => {
      const run = {...this.state.run};
      if (add) {
        run.distance += distance;
      } else {
        run.distance = distance;
      }
      this.setState(state => ({run}));
    }

    this.updateRunDirections = (updated) => {
      const run = {...this.state.run};
      run.directions = updated;
      this.setState(state => ({run}));
    }

    this.clearRun = () => {
      const run = {...this.state.run};
      run.directions = [],
      run.distance = 0;
      run.isRunning = false;
      this.setState(state => ({run}));
    }

    //  Access and Refresh tokens
    this.setTokens = (newTokens) => {
      const tokens = {...this.state.tokens};
      if (newTokens.access) {
        tokens.accessToken = newTokens.access;
        AsyncStorage.setItem("access", newTokens.access);
      }
      if (newTokens.refresh) {
        tokens.refreshToken = newTokens.refresh;
        AsyncStorage.setItem("refresh", newTokens.refresh);
      }
      this.setState(state => ({tokens}), this.updateUser());
    }

    this.refreshTokens = () => {
      if (this.state.tokens.refreshToken !== "" && this.state.tokens.refreshToken) {
        fetch(links.refresh, {
          method: "POST",
          body: JSON.stringify({token: this.state.tokens.refreshToken}),
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.state.tokens.refreshToken,
          }
        }).then((response) => {
          if (response.ok) {
            return response.json();
          }
          return response.status;
        }).then((data) => {
          if (Number.isInteger(data)) {
            this.state.tokens.setTokens({access: "", refresh: ""});
            return;
          }
          this.state.tokens.setTokens({access: data.accessToken, refresh: data.refreshToken});
        }).catch((error) => {
          console.log(error);
        });
      }
    }

    this.updateUser = () => {
      fetch(links.login, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + this.state.tokens.accessToken,
        }
      }).then((response) => {
        if (response.ok) {
          return response.json();
        }
      }).then((userData) => {
        const user = {...this.state.user}
        user.value = userData
        this.setState({user})
      }).catch((error) => {
        console.log(error);
      })
    }

    this.logout = () => {
      AsyncStorage.getAllKeys().then(keys => AsyncStorage.multiRemove(keys)).then(this.setState(this.initialState, this._loadState))
    }

    this.initialState = {
      tokens: {
        accessToken: null,
        refreshToken: null,
        setTokens: this.setTokens,
        refreshTokens: this.refreshTokens,
        logout: this.logout,
      },
      distance: {
        value: [],
        total: 0,
        updateDistance: this.updateDistance,
        clearDistance: this.clearDistance,
      },
      unit: {
        value: "km",
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
      user: {
        value: [],
        updateUser: this.updateUser,
      },
      run: {
        distance: 0,
        directions: [],
        isRunning: false,
        updateRunDistance: this.updateRunDistance,
        updateRunDirections: this.updateRunDirections,
        setRunning: this.setRunning,
        clearRun: this.clearRun,
      },
      isLoading: true,
    }

    this.state = this.initialState;
  }

  componentDidMount = () => {
    this._loadState();
  }

  _loadState = async () => {
    const keys = ["unit", "access", "refresh"];

    AsyncStorage.multiGet(keys, (err, items) => {
      var tokens = {...this.state.tokens};
      var unit = {...this.state.unit};

      unit.value = items[0][1] !== null ? items[0][1] : "km";
      tokens.accessToken = items[1][1] !== null ? items[1][1] : "";
      tokens.refreshToken = items[2][1] !== null ? items[2][1] : "";
      this.setState({unit, tokens, isLoading: false});
    }).then(this.refreshTokens);
  }

  render() {
    return (
      <AuthContext.Provider value={this.state.tokens}>
        <UserContext.Provider value={this.state.user}>
          <RunContext.Provider value={this.state.run}>
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
          </RunContext.Provider>
        </UserContext.Provider>
      </AuthContext.Provider>
    )
  }
}
