import React from "react";
const PlanContext = React.createContext({
  plan: {
    distance: 0,
    directions: [],
    route: [],
    markers: [],
    updateDistance: () => {},
    updateDirections: () => {},
    updateMarkers: () => {},
    updateRoute: () => {},
    clearPlan: () => {},
}});

export default PlanContext;
