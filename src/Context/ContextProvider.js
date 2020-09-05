import React from "react"

import UnitContext from "./UnitContext";
import RunContext from "./RunContext";
import UserContext from "./UserContext";
import AuthContext from "./AuthContext";
import PlanContext from "./PlanContext";
import SplitsContext from "./SplitsContext";

import AsyncStorage from "@react-native-community/async-storage";
import AppNavigator from "../Navigation/AppNavigator";
import links from "../Authentication/link";

export default class ContextProvider extends React.Component {
  constructor(props) {
    super(props);

    // Distance
    this.updateDistance = (distance) => {
      const plan = {...this.state.plan};
      plan.distance = distance;
      this.setState(state => ({plan}));
    }
    // Unit
    this.updateUnit = (value) => {
      const unit = {...this.state.unit};
      unit.value = value;
      this.setState(state => ({unit}));
      AsyncStorage.setItem("unit", unit.value);
    }

    // Markers
    this.updateMarkers = (markers) => {
      const plan = {...this.state.plan};
      plan.markers = markers;
      this.setState(state => ({plan}));
    }

    // Current route
    this.updateRoute = (overview_polyline) => {
      const plan = {...this.state.plan};
      plan.route = plan.route.concat(overview_polyline);
      this.setState(state => ({plan}));
    }

    // Current Directions (decoded route)
    this.updateDirections = (updated) => {
      const plan = {...this.state.plan};
      plan.directions = updated;
      this.setState(state => ({plan}));
    },

    this.updatePlan = (newPlan) => {
      const plan = {...this.state.plan};
      if (newPlan.distance) {
        plan.distance = newPlan.distance;
      }
      if (newPlan.directions) {
        plan.directions = newPlan.directions;
      }
      if (newPlan.route) {
        plan.route = newPlan.route;
      }
      if (newPlan.markers) {
        plan.markers = newPlan.markers;
      }
      this.setState(state => ({plan}));
    }

    this.clearPlan = () => {
      const plan = this.initialState.plan;
      this.setState(state => ({plan}));
    }

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

    // Splits for Current Run
    this.updateSplits = (value) => {
      const splits = {...this.state.splits};
      splits.value = value;
      this.setState(state => ({splits}));
    }

    //  Access and Refresh tokens
    this.setTokens = (newTokens) => {
      const tokens = {...this.state.tokens};
      if (newTokens.access || newTokens.access === "") {
        tokens.accessToken = newTokens.access;
      }
      if (newTokens.refresh || newTokens.access === "") {
        tokens.refreshToken = newTokens.refresh;
        AsyncStorage.setItem("refresh", newTokens.refresh);
      }
      this.setState(state => ({tokens}), () => this.updateUser());
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
        } else if (response.status === 401) {
          this.refreshTokens();
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
      this.state.tokens.setTokens({access: "", refresh: ""});
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
      unit: {
        value: "km",
        updateUnit: this.updateUnit,
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
      plan: {
        distance: 0,
        directions: [],
        route: [],
        markers: [],
        updateDistance: this.updateDistance,
        updateDirections: this.updateDirections,
        updateMarkers: this.updateMarkers,
        updateRoute: this.updateRoute,
        updatePlan: this.updatePlan,
        clearPlan: this.clearPlan,
      },
      splits: {
        value: [],
        updateSplits: this.updateSplits,
      },
      isLoading: true,
    }

    this.state = this.initialState;
  }

  componentDidMount = () => {
    this._loadState();
  }

  _loadState = async () => {
    const keys = ["unit", "refresh"];

    AsyncStorage.multiGet(keys, (err, items) => {
      var tokens = {...this.state.tokens};
      var unit = {...this.state.unit};

      unit.value = items[0][1] !== null ? items[0][1] : "km";
      tokens.refreshToken = items[1][1] !== null ? items[1][1] : "";
      this.setState({unit, tokens, isLoading: false});
    }).then(this.refreshTokens);
  }

  render() {
    return (
      <AuthContext.Provider value={this.state.tokens}>
        <UserContext.Provider value={this.state.user}>
          <UnitContext.Provider value={this.state.unit}>
            <PlanContext.Provider value={this.state.plan}>
              <RunContext.Provider value={this.state.run}>
                <SplitsContext.Provider value={this.state.splits}>
                  <AppNavigator isLoading={this.state.isLoading}/>
                </SplitsContext.Provider>
              </RunContext.Provider>
            </PlanContext.Provider>
          </UnitContext.Provider>
        </UserContext.Provider>
      </AuthContext.Provider>
    )
  }
}
