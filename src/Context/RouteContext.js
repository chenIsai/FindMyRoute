import React from "react";
const RouteContext = React.createContext({
  unit: {
    value: [],
    updateRoute: () => {},
    clearRoute: () => {},
}});

export default RouteContext;
